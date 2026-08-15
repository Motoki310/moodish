// ==========================================================
// 管理者用:入力データ一覧ページの挙動
// ==========================================================

const STORAGE_KEY = "dateSpotProposalSubmissions";


document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("admin-login");
  const loginForm = document.getElementById("admin-login-form");
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const loginError = document.getElementById("admin-login-error");
  const content = document.getElementById("admin-content");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginError.classList.add("hidden");

  const { error } = await db.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });

  if (error) {
    loginError.classList.remove("hidden");
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  loginSection.classList.add("hidden");
  content.classList.remove("hidden");
  initAdminContent();
});
  passwordInput.focus();
});

function initAdminContent() {
  renderTable();

  document.getElementById("export-btn").addEventListener("click", exportJson);
  document.getElementById("clear-btn").addEventListener("click", clearAll);
}

async function getSubmissions() {
  const { data, error } = await db
    .from("submissions")
    .select("id, created_at, data")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("データ取得に失敗しました:", error);
    alert("送信データの取得に失敗しました");
    return [];
  }

  return data.map((row) => ({
    ...row.data,
    submittedAt: row.data.submittedAt || row.created_at
  }));
}
async function renderTable() {
  const list = await getSubmissions();
  const tbody = document.getElementById("admin-table-body");
  const emptyState = document.getElementById("empty-state");
  const countEl = document.getElementById("entry-count");

  countEl.textContent = `${list.length}件の送信データ`;

  if (list.length === 0) {
    tbody.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  tbody.innerHTML = list
    .map((item) => {
      const ngSummary = [
        item.ngFood ? `苦手:${item.ngFood}` : "",
        item.allergy ? `アレルギー:${item.allergy}` : "",
        item.smoking && item.smoking !== "こだわらない" ? `喫煙:${item.smoking}` : ""
      ]
        .filter(Boolean)
        .join(" / ") || "-";

      return `
        <tr>
          <td>${formatDate(item.submittedAt)}</td>
          <td>${escapeHtml(item.purpose)}</td>
          <td>${escapeHtml(item.locationText)}</td>
          <td>${escapeHtml(item.budget)}</td>
          <td>${escapeHtml(item.scene)}</td>
          <td>${formatDate(item.datetime)}</td>
          <td>${escapeHtml(item.genre)}</td>
          <td>${escapeHtml(item.seat)}</td>
          <td>${escapeHtml(item.moodText)}</td>
          <td>${escapeHtml(ngSummary)}</td>
        </tr>
      `;
    })
    .join("");
}

function formatDate(isoLike) {
  if (!isoLike) return "-";
  const d = new Date(isoLike);
  if (isNaN(d.getTime())) return isoLike;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function exportJson() {
  const list = getSubmissions();
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `date-spot-submissions_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function clearAll() {
  const list = getSubmissions();
  if (list.length === 0) return;
  const ok = window.confirm(`保存されている${list.length}件の送信データをすべて削除します。よろしいですか?この操作は取り消せません。`);
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  renderTable();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ==========================================================
// 管理者用:入力データ一覧ページの挙動
// ==========================================================

const STORAGE_KEY = "dateSpotProposalSubmissions";
const ADMIN_PASSWORD = "eY3$Tf@FJLjkj^UwOQVr";

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("admin-login");
  const loginForm = document.getElementById("admin-login-form");
  const passwordInput = document.getElementById("admin-password");
  const loginError = document.getElementById("admin-login-error");
  const content = document.getElementById("admin-content");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (passwordInput.value === ADMIN_PASSWORD) {
      loginSection.classList.add("hidden");
      content.classList.remove("hidden");
      initAdminContent();
    } else {
      loginError.classList.remove("hidden");
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  passwordInput.focus();
});

function initAdminContent() {
  renderTable();

  document.getElementById("export-btn").addEventListener("click", exportJson);
  document.getElementById("clear-btn").addEventListener("click", clearAll);
}

function getSubmissions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function renderTable() {
  const list = getSubmissions();
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

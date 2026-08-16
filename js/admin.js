// ==========================================================
// 管理者用：入力データ一覧ページ
// ==========================================================


// ==========================================================
// ページ読み込み時
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("admin-login");
  const loginForm = document.getElementById("admin-login-form");
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const loginError = document.getElementById("admin-login-error");
  const content = document.getElementById("admin-content");


  // --------------------------------------------------------
  // 管理者ログイン
  // --------------------------------------------------------

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    loginError.classList.add("hidden");

    const { error } = await db.auth.signInWithPassword({
      email: emailInput.value,
      password: passwordInput.value
    });


    // ログイン失敗
    if (error) {
      console.error("ログイン失敗:", error);

      loginError.classList.remove("hidden");

      passwordInput.value = "";
      passwordInput.focus();

      return;
    }


    // ログイン成功
    loginSection.classList.add("hidden");
    content.classList.remove("hidden");

    await initAdminContent();
  });


  passwordInput.focus();
});


// ==========================================================
// 管理画面の初期化
// ==========================================================

async function initAdminContent() {

  await renderTable();

  const exportButton =
    document.getElementById("export-btn");

  const clearButton =
    document.getElementById("clear-btn");


  if (exportButton) {
    exportButton.addEventListener(
      "click",
      exportJson
    );
  }


  if (clearButton) {
    clearButton.addEventListener(
      "click",
      clearAll
    );
  }
}


// ==========================================================
// Supabaseから送信データを取得
// ==========================================================

async function getSubmissions() {

  const { data, error } = await db
    .from("submissions")
    .select("id, created_at, data")
    .order("created_at", {
      ascending: false
    });


  if (error) {

    console.error(
      "データ取得に失敗しました:",
      error
    );

    alert(
      "送信データの取得に失敗しました"
    );

    return [];
  }


  // Supabaseでは
  //
  // {
  //   id: 1,
  //   created_at: "...",
  //   data: { 実際の入力内容 }
  // }
  //
  // という形なので、
  // dataの中身を管理画面用に展開する

  return data.map((row) => ({

    databaseId: row.id,

    ...row.data,

    submittedAt:
      row.data.submittedAt
      || row.created_at

  }));
}


// ==========================================================
// 表を表示
// ==========================================================

async function renderTable() {

  const list =
    await getSubmissions();

  const tbody =
    document.getElementById(
      "admin-table-body"
    );

  const emptyState =
    document.getElementById(
      "empty-state"
    );

  const countEl =
    document.getElementById(
      "entry-count"
    );


  countEl.textContent =
    `${list.length}件の送信データ`;


  // --------------------------------------------------------
  // データ0件
  // --------------------------------------------------------

  if (list.length === 0) {

    tbody.innerHTML = "";

    emptyState.classList.remove(
      "hidden"
    );

    return;
  }


  emptyState.classList.add(
    "hidden"
  );


  // --------------------------------------------------------
  // データを1行ずつ表示
  // --------------------------------------------------------

  tbody.innerHTML = list

    .map((item) => {


      // ====================================================
      // NG条件
      // ====================================================

      const ngSummary = [

        item.ngFood
          ? `苦手：${item.ngFood}`
          : "",

        item.allergy
          ? `アレルギー：${item.allergy}`
          : "",

        item.smoking
        && item.smoking !== "こだわらない"
          ? `喫煙：${item.smoking}`
          : ""

      ]
        .filter(Boolean)
        .join(" / ")
        || "-";


      // ====================================================
      // ジャンル
      //
      // 「その他」を選んだ場合
      // → その他（タイ料理）
      // のように表示
      // ====================================================

      let genreText =
        item.genre || "-";


      if (
        item.genre === "その他"
        && item.genreOther
      ) {

        genreText =
          `その他（${item.genreOther}）`;

      }


      // ====================================================
      // 表の1行
      // ====================================================

      return `
        <tr>

          <td>
            ${formatDate(item.submittedAt)}
          </td>

          <td>
            ${escapeHtml(item.relationship || "-")}
          </td>

          <td>
            ${escapeHtml(item.purpose || "-")}
          </td>

          <td>
            ${escapeHtml(item.locationText || "-")}
          </td>

          <td>
            ${escapeHtml(item.budget || "-")}
          </td>

          <td>
            ${escapeHtml(item.scene || "-")}
          </td>

          <td>
            ${formatDate(item.datetime)}
          </td>

          <td>
            ${escapeHtml(genreText)}
          </td>

          <td>
            ${escapeHtml(item.seat || "-")}
          </td>

          <td>
            ${escapeHtml(item.moodText || "-")}
          </td>

          <td>
            ${escapeHtml(ngSummary)}
          </td>

          <td>
            ${escapeHtml(item.requestText || "-")}
          </td>

        </tr>
      `;

    })

    .join("");
}


// ==========================================================
// 日時表示
// ==========================================================

function formatDate(isoLike) {

  if (!isoLike) {
    return "-";
  }


  const d =
    new Date(isoLike);


  if (isNaN(d.getTime())) {
    return isoLike;
  }


  const pad = (n) =>
    String(n).padStart(
      2,
      "0"
    );


  return (
    `${d.getFullYear()}/`
    + `${pad(d.getMonth() + 1)}/`
    + `${pad(d.getDate())} `
    + `${pad(d.getHours())}:`
    + `${pad(d.getMinutes())}`
  );
}


// ==========================================================
// JSONとして書き出す
// ==========================================================

async function exportJson() {

  const list =
    await getSubmissions();


  if (list.length === 0) {

    alert(
      "書き出すデータがありません"
    );

    return;
  }


  const blob =
    new Blob(

      [
        JSON.stringify(
          list,
          null,
          2
        )
      ],

      {
        type:
          "application/json"
      }

    );


  const url =
    URL.createObjectURL(blob);


  const a =
    document.createElement("a");


  a.href =
    url;


  a.download =
    `moodish-submissions_${Date.now()}.json`;


  document.body.appendChild(a);

  a.click();

  a.remove();


  URL.revokeObjectURL(url);
}


// ==========================================================
// 全削除
// ==========================================================
//
// 現時点では安全のため実際には削除しない。
// Supabase側にDELETE権限を設定してから実装する。
// ==========================================================

async function clearAll() {

  const list =
    await getSubmissions();


  if (list.length === 0) {

    alert(
      "削除するデータがありません"
    );

    return;
  }


  const ok =
    window.confirm(

      `保存されている${list.length}件の送信データをすべて削除しますか？`

      + "\n\n現在は安全のため削除機能を無効にしています。"

    );


  if (!ok) {
    return;
  }


  alert(
    "現在、全削除機能は無効です。"
  );
}


// ==========================================================
// HTMLエスケープ
// ==========================================================

function escapeHtml(str) {

  return String(str)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );
}

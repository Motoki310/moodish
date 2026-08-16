// ==========================================================
// 提案フォームページの挙動
// ==========================================================

const MOOD_LABELS = {
  moodCasualSpecial: [
    "カジュアル",
    "ややカジュアル",
    "普通",
    "やや特別感",
    "特別感"
  ],
  moodBrightDark: [
    "明るい",
    "やや明るい",
    "普通",
    "やや暗め",
    "暗め"
  ],
  moodLivelyQuiet: [
    "にぎやか",
    "ややにぎやか",
    "普通",
    "やや静か",
    "静か"
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("proposal-form");

  const locationModeRadios =
    form.querySelectorAll('input[name="locationMode"]');

  const areaBlock = document.getElementById("location-area");
  const midpointBlock = document.getElementById("location-midpoint");

  const genreSelect = document.getElementById("genre");
  const genreOtherInput = document.getElementById("genreOther");

  const resultSection = document.getElementById("result");
  const resultCards = document.getElementById("result-cards");


  // ========================================================
  // 場所の入力方式切り替え
  // エリア指定 / 2人の最寄駅から中間地点
  // ========================================================

  locationModeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const mode =
        form.querySelector('input[name="locationMode"]:checked').value;

      areaBlock.classList.toggle(
        "hidden",
        mode !== "area"
      );

      midpointBlock.classList.toggle(
        "hidden",
        mode !== "midpoint"
      );
    });
  });


  // ========================================================
  // 予算スライダー
  // ========================================================

  setupBudgetSliders(form);


  // ========================================================
  // ジャンル「その他」の自由記述欄
  // ========================================================

  if (genreSelect && genreOtherInput) {

    function updateGenreOther() {
      const isOther = genreSelect.value === "その他";

      genreOtherInput.disabled = !isOther;

      if (!isOther) {
        genreOtherInput.value = "";
      }
    }

    genreSelect.addEventListener(
      "change",
      updateGenreOther
    );

    updateGenreOther();
  }


  // ========================================================
  // フォーム送信
  // ========================================================

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const data = collectFormData(form);

    try {
      // Supabaseへ保存
      await saveSubmission(data);

      // 現在はダミー店舗を3件表示
      renderResult(
        data,
        resultCards
      );

      resultSection.classList.remove("hidden");

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    } catch (error) {
      console.error(error);
    }
  });
});


// ==========================================================
// 予算スライダー
// ==========================================================

function setupBudgetSliders(form) {

  const minInput =
    form.querySelector("#budgetMin");

  const maxInput =
    form.querySelector("#budgetMax");

  const minLabel =
    document.getElementById("budgetMinLabel");

  const maxLabel =
    document.getElementById("budgetMaxLabel");


  function update() {

    let min =
      Number(minInput.value);

    let max =
      Number(maxInput.value);


    // 下限が上限を超えないようにする
    if (min > max) {

      if (document.activeElement === minInput) {

        max = min;
        maxInput.value = max;

      } else {

        min = max;
        minInput.value = min;

      }
    }


    minLabel.textContent =
      formatYen(min);

    maxLabel.textContent =
      formatYen(max);
  }


  minInput.addEventListener(
    "input",
    update
  );

  maxInput.addEventListener(
    "input",
    update
  );

  update();
}


// ==========================================================
// 金額表示
// ==========================================================

function formatYen(n) {

  return `${Number(n).toLocaleString()}円`;

}


// ==========================================================
// フォームの内容をまとめる
// ==========================================================

function collectFormData(form) {

  const fd =
    new FormData(form);


  // --------------------------------------------------------
  // 場所
  // --------------------------------------------------------

  const locationMode =
    fd.get("locationMode");


  const locationText =

    locationMode === "area"

      ? (fd.get("area") || "").trim()
        || "(未入力)"

      : `${(fd.get("station1") || "").trim() || "未入力"} と ${(fd.get("station2") || "").trim() || "未入力"} の中間`;


  // --------------------------------------------------------
  // 予算
  // --------------------------------------------------------

  const budgetMin =
    Number(fd.get("budgetMin"));

  const budgetMax =
    Number(fd.get("budgetMax"));


  // --------------------------------------------------------
  // ジャンル
  // --------------------------------------------------------

  const genre =
    fd.get("genre") || "";

  const genreOther =
    genre === "その他"
      ? (fd.get("genreOther") || "").trim()
      : "";


  // --------------------------------------------------------
  // 保存するデータ
  // --------------------------------------------------------

  return {

    // 管理用
    id:
      `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}`,

    submittedAt:
      new Date().toISOString(),


    // -----------------------------
    // デート条件
    // -----------------------------

    relationship:
      fd.get("relationship") || "",

    purpose:
      fd.get("purpose") || "",


    // -----------------------------
    // 場所
    // -----------------------------

    locationMode,

    locationText,

    area:
      fd.get("area") || "",

    station1:
      fd.get("station1") || "",

    station2:
      fd.get("station2") || "",


    // -----------------------------
    // 予算
    // -----------------------------

    budgetMin,

    budgetMax,

    budget:
      `${formatYen(budgetMin)}〜${formatYen(budgetMax)}`,


    // -----------------------------
    // シーン・日時
    // -----------------------------

    scene:
      fd.get("scene") || "",

    datetime:
      fd.get("datetime") || "",


    // -----------------------------
    // ジャンル
    // -----------------------------

    genre,

    genreOther,


    // -----------------------------
    // 席
    // -----------------------------

    seat:
      fd.get("seat") || "おまかせ",


    // -----------------------------
    // 雰囲気
    // -----------------------------

    moodCasualSpecial:
      Number(
        fd.get("moodCasualSpecial")
      ),

    moodBrightDark:
      Number(
        fd.get("moodBrightDark")
      ),

    moodLivelyQuiet:
      Number(
        fd.get("moodLivelyQuiet")
      ),


    moodText: [

      MOOD_LABELS
        .moodCasualSpecial[
          Number(
            fd.get("moodCasualSpecial")
          )
        ],

      MOOD_LABELS
        .moodBrightDark[
          Number(
            fd.get("moodBrightDark")
          )
        ],

      MOOD_LABELS
        .moodLivelyQuiet[
          Number(
            fd.get("moodLivelyQuiet")
          )
        ]

    ].join(" / "),


    // -----------------------------
    // NG条件
    // -----------------------------

    ngFood:
      fd.get("ngFood") || "",

    allergy:
      fd.get("allergy") || "",

    smoking:
      fd.get("smoking")
      || "こだわらない",


    // -----------------------------
    // 自由記述
    // -----------------------------

    requestText:
      (fd.get("requestText") || "").trim()
  };
}


// ==========================================================
// Supabaseへ保存
// ==========================================================

async function saveSubmission(data) {

  const { error } = await db
    .from("submissions")
    .insert({
      data: data
    });


  if (error) {

    console.error(
      "保存に失敗しました:",
      error
    );

    alert(
      "データの保存に失敗しました"
    );

    throw error;
  }
}


// ==========================================================
// ダミー店舗からランダムに選ぶ
// ==========================================================

function pickRandomRestaurants(
  pool,
  count
) {

  const shuffled =
    [...pool].sort(
      () => Math.random() - 0.5
    );

  return shuffled.slice(
    0,
    count
  );
}


// ==========================================================
// 提案結果表示
// ==========================================================

function renderResult(
  data,
  container
) {

  const picks =
    pickRandomRestaurants(
      DUMMY_RESTAURANTS,
      3
    );


  container.innerHTML =
    picks
      .map(
        (r, i) => `

          <article class="result-card">

            <span class="rank">
              ${i + 1}位
            </span>

            <div class="thumb">
              🌸
            </div>

            <h3>
              ${escapeHtml(r.name)}
            </h3>

            <p class="meta">
              ${escapeHtml(r.genre)}
              ・
              ${escapeHtml(r.area)}
              ・
              ${escapeHtml(r.budget)}
            </p>

            <p class="catch">
              ${escapeHtml(r.catch)}
            </p>

            <div class="tags">

              ${r.tags
                .map(
                  (t) =>
                    `<span class="tag">${escapeHtml(t)}</span>`
                )
                .join("")}

            </div>

          </article>

        `
      )
      .join("");
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
    );
}

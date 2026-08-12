// ==========================================================
// 提案フォームページの挙動
// ==========================================================

const STORAGE_KEY = "dateSpotProposalSubmissions";

const MOOD_LABELS = {
  moodCasualSpecial: ["カジュアル", "ややカジュアル", "普通", "やや特別感", "特別感"],
  moodBrightDark: ["明るい", "やや明るい", "普通", "やや暗め", "暗め"],
  moodLivelyQuiet: ["にぎやか", "ややにぎやか", "普通", "やや静か", "静か"]
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("proposal-form");
  const locationModeRadios = form.querySelectorAll('input[name="locationMode"]');
  const areaBlock = document.getElementById("location-area");
  const midpointBlock = document.getElementById("location-midpoint");
  const resultSection = document.getElementById("result");
  const resultCards = document.getElementById("result-cards");

  // 場所の入力方式切り替え(エリア指定 / 最寄駅から中間地点)
  locationModeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const mode = form.querySelector('input[name="locationMode"]:checked').value;
      areaBlock.classList.toggle("hidden", mode !== "area");
      midpointBlock.classList.toggle("hidden", mode !== "midpoint");
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const data = collectFormData(form);
    saveSubmission(data);
    renderResult(data, resultCards);

    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function collectFormData(form) {
  const fd = new FormData(form);
  const locationMode = fd.get("locationMode");

  const locationText =
    locationMode === "area"
      ? (fd.get("area") || "").trim() || "(未入力)"
      : `${(fd.get("station1") || "").trim() || "未入力"} と ${(fd.get("station2") || "").trim() || "未入力"} の中間`;

  return {
    id: `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    submittedAt: new Date().toISOString(),

    purpose: fd.get("purpose") || "",
    locationMode,
    locationText,
    area: fd.get("area") || "",
    station1: fd.get("station1") || "",
    station2: fd.get("station2") || "",
    budget: fd.get("budget") || "",
    scene: fd.get("scene") || "",
    datetime: fd.get("datetime") || "",
    genre: fd.get("genre") || "",

    seat: fd.get("seat") || "おまかせ",
    moodCasualSpecial: Number(fd.get("moodCasualSpecial")),
    moodBrightDark: Number(fd.get("moodBrightDark")),
    moodLivelyQuiet: Number(fd.get("moodLivelyQuiet")),
    moodText: [
      MOOD_LABELS.moodCasualSpecial[Number(fd.get("moodCasualSpecial"))],
      MOOD_LABELS.moodBrightDark[Number(fd.get("moodBrightDark"))],
      MOOD_LABELS.moodLivelyQuiet[Number(fd.get("moodLivelyQuiet"))]
    ].join(" / "),

    ngFood: fd.get("ngFood") || "",
    allergy: fd.get("allergy") || "",
    smoking: fd.get("smoking") || "こだわらない"
  };
}

function saveSubmission(data) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  list.unshift(data); // 新しいものを先頭に
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function pickRandomRestaurants(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function renderResult(data, container) {
  const picks = pickRandomRestaurants(DUMMY_RESTAURANTS, 3);

  container.innerHTML = picks
    .map(
      (r, i) => `
    <article class="result-card">
      <span class="rank">${i + 1}位</span>
      <div class="thumb">🌸</div>
      <h3>${escapeHtml(r.name)}</h3>
      <p class="meta">${escapeHtml(r.genre)} ・ ${escapeHtml(r.area)} ・ ${escapeHtml(r.budget)}</p>
      <p class="catch">${escapeHtml(r.catch)}</p>
      <div class="tags">
        ${r.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      </div>
    </article>
  `
    )
    .join("");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

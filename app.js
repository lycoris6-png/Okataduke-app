const STORAGE_KEY = "okataduke-itte-state-v1";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const DRIVE_FOLDER_NAME = "おかたづけ一手 Photos";
const MASCOTS = {
  broom: "assets/chibi-broom.png",
  laundry: "assets/chibi-laundry.png"
};

const defaultAreas = [
  { id: "desk", name: "机", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "office_desk", name: "オフィスの机", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "futon", name: "布団周り", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "floor", name: "床", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "kitchen", name: "キッチン", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "entry", name: "玄関", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "sink", name: "洗面所", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "bath", name: "バスルーム", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "closet", name: "クローゼット", level: 1, completedCount: 0, lastWorkedAt: null }
];
const modes = [
  { id: "low_energy", label: "低エネルギー", hint: "1つ、3つ、置くだけ中心", categories: ["trash", "floor", "clothes", "tiny"], energy: "low" },
  { id: "normal", label: "普通", hint: "3個だけを淡々と", categories: ["trash", "floor", "paper", "clothes", "tiny"], energy: "normal" },
  { id: "motivated", label: "やる気あり", hint: "5個まで出します", categories: ["trash", "floor", "paper", "clothes", "dishes"], energy: "high" },
  { id: "trash_only", label: "ゴミだけ", hint: "捨てる判断が明らかなもの", categories: ["trash"], energy: "low" },
  { id: "floor_only", label: "床だけ", hint: "床面を少し取り戻す", categories: ["floor"], energy: "low" },
  { id: "paper_only", label: "紙類だけ", hint: "読む判断はしない", categories: ["paper"], energy: "normal" },
  { id: "clothes_only", label: "服だけ", hint: "洗濯・収納の入口だけ", categories: ["clothes"], energy: "normal" }
];

const taskTemplates = [
  { id: "desk_paper_stack_3", text: "机の上から紙を3枚だけ重ねる", areaIds: ["desk"], category: "paper", energy: "low", estimatedMinutes: 1 },
  { id: "desk_pen_3", text: "ペンを3本だけペン立てに入れる", areaIds: ["desk"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "desk_trash_3", text: "明らかなゴミを3つ捨てる", areaIds: ["desk"], category: "trash", energy: "low", estimatedMinutes: 2 },
  { id: "desk_cup_1", text: "コップや皿を1つだけ流しへ運ぶ", areaIds: ["desk"], category: "dishes", energy: "low", estimatedMinutes: 1 },
  { id: "desk_clear_palm", text: "机の端を手のひら1枚分だけ空ける", areaIds: ["desk"], category: "tiny", energy: "normal", estimatedMinutes: 2 },
  { id: "desk_items_3", text: "使っていない小物を3つだけ一か所に寄せる", areaIds: ["desk"], category: "tiny", energy: "low", estimatedMinutes: 2 },

  { id: "office_doc_stack_3", text: "書類を3枚だけ同じ向きに重ねる", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 1 },
  { id: "office_paper_trash_3", text: "明らかな紙ゴミを3枚だけ捨てる", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 2 },
  { id: "office_memo_1", text: "期限切れ・不要なメモを1枚だけ捨てる", areaIds: ["office_desk"], category: "paper", energy: "normal", estimatedMinutes: 2 },
  { id: "office_items_3", text: "小物を3つだけ机の端に寄せる", areaIds: ["office_desk"], category: "tiny", energy: "low", estimatedMinutes: 2 },
  { id: "office_pens_3", text: "ペンを3本だけまとめる", areaIds: ["office_desk"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "office_mail_3", text: "郵便物や封筒を3枚だけ一か所に置く", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 2 },
  { id: "office_receipt_3", text: "レシートを3枚だけまとめる", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 1 },
  { id: "office_front_palm", text: "机の手前を手のひら1枚分だけ空ける", areaIds: ["office_desk"], category: "tiny", energy: "normal", estimatedMinutes: 2 },
  { id: "office_package_1", text: "空き袋・包装紙を1つだけ捨てる", areaIds: ["office_desk"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "office_hold_doc_1", text: "判断が必要な書類を1枚だけ保留場所に置く", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 2 },

  { id: "futon_clothes_3", text: "布団周りの服を3枚だけ集める", areaIds: ["futon"], category: "clothes", energy: "low", estimatedMinutes: 2 },
  { id: "futon_trash_3", text: "枕元のゴミを3つ捨てる", areaIds: ["futon"], category: "trash", energy: "low", estimatedMinutes: 2 },
  { id: "futon_floor_3", text: "床のものを3個だけ拾う", areaIds: ["futon"], category: "floor", energy: "low", estimatedMinutes: 2 },
  { id: "futon_book_1", text: "読みかけの本を1冊だけ置き場に戻す", areaIds: ["futon"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "futon_cord_1", text: "充電コードを1本だけよける", areaIds: ["futon"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "futon_top_3", text: "布団の上のものを3個だけどかす", areaIds: ["futon"], category: "tiny", energy: "low", estimatedMinutes: 2 },
  { id: "futon_roller_3", text: "粘着テープのコロコロを布団の周りに3往復だけかける", areaIds: ["futon"], category: "floor", energy: "normal", estimatedMinutes: 2 },
  { id: "futon_clear_palm", text: "布団の上を手のひら1枚分だけ空ける", areaIds: ["futon"], category: "tiny", energy: "low", estimatedMinutes: 2 },

  { id: "floor_pick_3", text: "床のものを3個拾う", areaIds: ["floor"], category: "floor", energy: "low", estimatedMinutes: 2 },
  { id: "floor_path_3", text: "通り道のものを3個だけ端に寄せる", areaIds: ["floor"], category: "floor", energy: "low", estimatedMinutes: 2 },
  { id: "floor_trash_3", text: "ゴミを3つ捨てる", areaIds: ["floor"], category: "trash", energy: "low", estimatedMinutes: 2 },
  { id: "floor_clothes_3", text: "服を3枚だけカゴに入れる", areaIds: ["floor"], category: "clothes", energy: "low", estimatedMinutes: 2 },
  { id: "floor_paper_3", text: "紙類を3枚だけ拾う", areaIds: ["floor"], category: "paper", energy: "low", estimatedMinutes: 2 },
  { id: "floor_danger_1", text: "足元の危ないものを1つどかす", areaIds: ["floor"], category: "floor", energy: "low", estimatedMinutes: 1 },
  { id: "floor_roller_3", text: "粘着テープのコロコロを床に3往復だけかける", areaIds: ["floor"], category: "floor", energy: "normal", estimatedMinutes: 2 },

  { id: "kitchen_sink_3", text: "シンクの中のものを3つだけ動かす", areaIds: ["kitchen"], category: "dishes", energy: "low", estimatedMinutes: 2 },
  { id: "kitchen_container_1", text: "空き容器を1つ捨てる", areaIds: ["kitchen"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "kitchen_spice_1", text: "調味料を1つ元の場所に戻す", areaIds: ["kitchen"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "kitchen_cup_1", text: "コップを1つ洗う", areaIds: ["kitchen"], category: "dishes", energy: "normal", estimatedMinutes: 2 },
  { id: "kitchen_counter_palm", text: "台の上を手のひら1枚分だけ空ける", areaIds: ["kitchen"], category: "tiny", energy: "normal", estimatedMinutes: 2 },
  { id: "kitchen_trash_3", text: "明らかなゴミを3つ捨てる", areaIds: ["kitchen"], category: "trash", energy: "low", estimatedMinutes: 2 },
  { id: "fridge_dates_3", text: "冷蔵庫の中の期限を3つだけ見る", areaIds: ["kitchen"], category: "fridge", energy: "low", estimatedMinutes: 2 },
  { id: "fridge_expired_1", text: "期限切れの食品を1つだけ捨てる", areaIds: ["kitchen"], category: "fridge", energy: "normal", estimatedMinutes: 2 },
  { id: "fridge_empty_1", text: "冷蔵庫の中の空容器を1つ捨てる", areaIds: ["kitchen"], category: "fridge", energy: "low", estimatedMinutes: 1 },
  { id: "fridge_front_3", text: "冷蔵庫の手前のものを3つだけ並べる", areaIds: ["kitchen"], category: "fridge", energy: "low", estimatedMinutes: 2 },
  { id: "fridge_veg_1", text: "野菜室の明らかに傷んだものを1つ確認する", areaIds: ["kitchen"], category: "fridge", energy: "normal", estimatedMinutes: 2 },

  { id: "entry_shoes_align_1", text: "靴を1足だけ揃える", areaIds: ["entry"], category: "entry", energy: "low", estimatedMinutes: 1 },
  { id: "entry_shoes_put_1", text: "出しっぱなしの靴を1足しまう", areaIds: ["entry"], category: "entry", energy: "low", estimatedMinutes: 1 },
  { id: "entry_trash_1", text: "玄関のゴミを1つ捨てる", areaIds: ["entry"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "entry_umbrella_1", text: "傘を1本だけ整える", areaIds: ["entry"], category: "entry", energy: "low", estimatedMinutes: 1 },
  { id: "entry_mail_3", text: "郵便物を3枚だけ一か所に置く", areaIds: ["entry"], category: "paper", energy: "low", estimatedMinutes: 2 },
  { id: "entry_floor_1", text: "玄関の床のものを1つどかす", areaIds: ["entry"], category: "floor", energy: "low", estimatedMinutes: 1 },

  { id: "sink_items_3", text: "洗面台の上のものを3つだけ寄せる", areaIds: ["sink"], category: "sink", energy: "low", estimatedMinutes: 2 },
  { id: "sink_empty_1", text: "空の容器を1つ捨てる", areaIds: ["sink"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "sink_towel_1", text: "タオルを1枚だけ洗濯カゴへ入れる", areaIds: ["sink"], category: "clothes", energy: "low", estimatedMinutes: 1 },
  { id: "sink_toothbrush_1", text: "歯ブラシ周りを1つだけ戻す", areaIds: ["sink"], category: "sink", energy: "low", estimatedMinutes: 1 },
  { id: "sink_hair_1", text: "髪の毛やゴミをティッシュで1回だけ取る", areaIds: ["sink"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "sink_clear_palm", text: "洗面台を手のひら1枚分だけ空ける", areaIds: ["sink"], category: "sink", energy: "normal", estimatedMinutes: 2 },

  { id: "bath_empty_bottle_1", text: "空のボトルを1つ捨てる", areaIds: ["bath"], category: "bath", energy: "low", estimatedMinutes: 1 },
  { id: "bath_bottles_3", text: "ボトルを3本だけ並べる", areaIds: ["bath"], category: "bath", energy: "low", estimatedMinutes: 1 },
  { id: "bath_drain_1", text: "排水口まわりの見えるゴミを1つ取る", areaIds: ["bath"], category: "bath", energy: "normal", estimatedMinutes: 2 },
  { id: "bath_item_1", text: "浴室内の小物を1つ戻す", areaIds: ["bath"], category: "bath", energy: "low", estimatedMinutes: 1 },
  { id: "bath_towel_1", text: "タオルを1枚だけ洗濯カゴへ入れる", areaIds: ["bath"], category: "clothes", energy: "low", estimatedMinutes: 1 },
  { id: "bath_floor_1", text: "床のものを1つだけ外へ出す", areaIds: ["bath"], category: "floor", energy: "low", estimatedMinutes: 1 },

  { id: "closet_hanger_3", text: "服を3枚だけハンガーにかける", areaIds: ["closet"], category: "clothes", energy: "normal", estimatedMinutes: 2 },
  { id: "closet_laundry_3", text: "洗濯物を3枚だけカゴに入れる", areaIds: ["closet"], category: "clothes", energy: "low", estimatedMinutes: 2 },
  { id: "closet_floor_clothes_3", text: "床の服を3枚だけ拾う", areaIds: ["closet"], category: "clothes", energy: "low", estimatedMinutes: 2 },
  { id: "closet_wash_1", text: "明らかに洗う服を1枚だけ分ける", areaIds: ["closet"], category: "clothes", energy: "low", estimatedMinutes: 1 },
  { id: "closet_bag_1", text: "バッグを1つだけ定位置に戻す", areaIds: ["closet"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "closet_drawer_1", text: "引き出しを1段だけ閉める", areaIds: ["closet"], category: "tiny", energy: "low", estimatedMinutes: 1 }
];
const coachLines = [
  "ぼくが次の一手だけ出します。ここだけ見れば大丈夫です。",
  "私ならまずこれやる！終わったら押してね。",
  "ぼくと一緒に、三つだけ片づけましょう。",
  "全部じゃなくていいよ。今はこの一手だけ！",
  "迷うものは後で大丈夫です。ぼくたちは進める方を選びます。",
  "私、こういう小さい前進すき！一個でも勝ち！",
  "ここまで来られたので、もう十分に始まっています。",
  "勢いがなくても大丈夫。ぼくが順番を持っています。",
  "よーし、次これ！考えるのは私たちに預けて。",
  "手を動かせる大きさにしてあります。ゆっくりで大丈夫です。",
  "止まっても平気！次の一手はここにあります。",
  "私たち、ちゃんと見てるよ。今の一手で変わるからね。"
];

const praiseLines = [
  "ぼくから見ても、ちゃんと進みました。今日はここで区切って大丈夫です。",
  "私、今の片づけ好き！小さいけど、ちゃんと場所が息した感じ！",
  "おつかれさまでした。ぼくたちも一緒に見届けました。",
  "ここで止められるのも上手な片づけです。ぼくはそう思います。",
  "私ならここで一回お茶にする！ちゃんとやったもん。",
  "完璧ではなく、再開できる形で終われました。とても良いです。",
  "やったね！私、こういうちょっと変わる瞬間が好き！",
  "ぼくは、今日の一手をきちんと記録しておきます。",
  "ここまでで十分。私たち、また次の一手を出せるよ。",
  "おつかれさまです。ぼくたちが次回もここから手伝います。",
  "終われるところまで来たの、かなりえらいよ。私が保証する！",
  "今日はこれで閉じましょう。ぼくは十分だと思います。"
];

let state = loadState();
let selectedMode = state.session?.mode || "normal";
let selectedDuration = state.session?.durationMinutes || 5;
let timerId = null;
let toastTimer = null;
let driveToken = null;
let driveTokenExpiresAt = 0;
let driveTokenClient = null;

const $ = (id) => document.getElementById(id);

function createInitialState() {
  return {
    areas: structuredClone(defaultAreas),
    todayDate: todayKey(),
    todayCompleted: 0,
    heldTasks: [],
    session: null,
    lastTaskIndex: 0,
    customTasks: {},
    drive: {
      clientId: "",
      folderId: null
    }
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const initial = saved || createInitialState();
    if (initial.todayDate !== todayKey()) {
      initial.todayDate = todayKey();
      initial.todayCompleted = 0;
    }
    initial.areas = normalizeAreas(initial.areas);
    if (!initial.customTasks) initial.customTasks = {};
    if (!initial.drive) initial.drive = { clientId: "", folderId: null };
    return initial;
  } catch {
    return createInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeAreas(savedAreas) {
  const migrated = (Array.isArray(savedAreas) ? savedAreas : []).map((area) => {
    if (area.id === "bed") return { ...area, id: "futon", name: "布団周り" };
    return area;
  });
  const byId = new Map(migrated.map((area) => [area.id, area]));
  defaultAreas.forEach((area) => {
    if (!byId.has(area.id)) byId.set(area.id, { ...area });
  });
  return Array.from(byId.values()).filter((area) => area.id !== "bed");
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });
}

function renderHome() {
  $("todayCount").textContent = state.todayCompleted;
  $("holdCount").textContent = Object.values(state.customTasks || {}).filter((items) => items?.length).length;
  $("areaCount").textContent = state.areas.length;
  $("headerResumeButton").classList.toggle("hidden", !state.session?.isActive);

  const areaGrid = $("areaGrid");
  areaGrid.innerHTML = "";
  state.areas.forEach((area) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "area-card";
    card.dataset.areaId = area.id;
    const percent = Math.min(100, area.completedCount * 10);
    card.innerHTML = `
      <strong>${escapeHtml(area.name)}</strong>
      <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
      <small>${area.completedCount}手 完了 ・ 押して開始</small>
    `;
    card.addEventListener("click", () => startSessionForArea(area.id));
    areaGrid.append(card);
  });
  renderDriveStatus();
}

function renderSetup({ resetBefore = false } = {}) {
  if (resetBefore) {
    $("beforeInput").value = "";
    $("beforePreview").removeAttribute("src");
    $("beforePreview").classList.add("hidden");
  }

  const areaSelect = $("areaSelect");
  areaSelect.innerHTML = "";
  state.areas.forEach((area) => {
    const option = document.createElement("option");
    option.value = area.id;
    option.textContent = area.name;
    areaSelect.append(option);
  });
  if (state.session?.areaId) areaSelect.value = state.session.areaId;

  const modeGrid = $("modeGrid");
  modeGrid.innerHTML = "";
  modes.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mode-card ${mode.id === selectedMode ? "selected" : ""}`;
    button.dataset.mode = mode.id;
    button.innerHTML = `<strong>${mode.label}</strong><span>${mode.hint}</span>`;
    button.addEventListener("click", () => {
      selectedMode = mode.id;
      renderSetup();
    });
    modeGrid.append(button);
  });

  document.querySelectorAll("#durationGroup button").forEach((button) => {
    button.classList.toggle("selected", Number(button.dataset.duration) === selectedDuration);
  });
}

function startSession() {
  const areaId = $("areaSelect").value;
  beginSession({
    areaId,
    mode: selectedMode,
    durationMinutes: selectedDuration,
    beforeImage: $("beforePreview").src || null
  });
}

function startSessionForArea(areaId) {
  selectedMode = modeForArea(areaId);
  selectedDuration = 5;
  beginSession({
    areaId,
    mode: selectedMode,
    durationMinutes: selectedDuration,
    beforeImage: null
  });
}

function beginSession({ areaId, mode, durationMinutes, beforeImage }) {
  state.session = {
    id: `session-${Date.now()}`,
    areaId,
    mode,
    startedAt: new Date().toISOString(),
    durationMinutes,
    completedCount: 0,
    currentTask: chooseTask(mode, areaId),
    beforeImage,
    afterImage: null,
    isActive: true,
    endsAt: Date.now() + durationMinutes * 60 * 1000
  };
  saveState();
  renderRun();
  showScreen("runScreen");
  startTimer();
  uploadSessionPhoto("before");
}

function modeForArea(areaId) {
  if (areaId === "floor") return "floor_only";
  if (areaId === "closet" || areaId === "futon") return "clothes_only";
  if (areaId === "desk" || areaId === "office_desk") return "paper_only";
  return "normal";
}

function resumeSession() {
  if (!state.session?.isActive) return;
  if (!state.session.endsAt) {
    state.session.endsAt = Date.now() + state.session.durationMinutes * 60 * 1000;
  }
  renderRun();
  showScreen("runScreen");
  startTimer();
}

function chooseTask(modeId, areaId = state.session?.areaId) {
  const customList = customTaskTemplatesForArea(areaId);
  if (customList.length) {
    const task = customList[state.lastTaskIndex % customList.length];
    state.lastTaskIndex += 1;
    return task;
  }
  const mode = modes.find((item) => item.id === modeId) || modes[1];
  const pool = taskTemplates.filter((task) => {
    const areaMatch = !task.areaIds || task.areaIds.includes(areaId);
    const categoryMatch = mode.categories.includes(task.category) || areaMatch;
    const energyMatch = mode.energy === "high" || task.energy !== "high";
    return areaMatch && categoryMatch && energyMatch;
  });
  const fallback = taskTemplates.filter((task) => !task.areaIds || task.areaIds.includes(areaId));
  const list = pool.length ? pool : fallback.length ? fallback : taskTemplates;
  const task = list[state.lastTaskIndex % list.length];
  state.lastTaskIndex += 1;
  return task;
}

function customTaskTemplatesForArea(areaId) {
  const lines = state.customTasks?.[areaId];
  if (!Array.isArray(lines) || !lines.length) return [];
  return lines.map((text, index) => ({
    id: `custom_${areaId}_${index}`,
    text,
    areaIds: [areaId],
    category: "custom",
    energy: "low",
    estimatedMinutes: 2
  }));
}

function defaultTaskTextsForArea(areaId) {
  return taskTemplates
    .filter((task) => task.areaIds?.includes(areaId))
    .map((task) => task.text);
}

function renderRun() {
  const session = state.session;
  const area = state.areas.find((item) => item.id === session.areaId);
  const mascot = mascotForTask(session.currentTask);
  $("currentArea").textContent = area?.name || "エリア";
  $("taskText").textContent = session.currentTask?.text || "ゴミを3つ捨てる";
  $("sessionDoneCount").textContent = session.completedCount;
  $("coachLine").textContent = coachLines[session.completedCount % coachLines.length];
  $("runMascot").src = mascot;
  renderTimer();
}

function completeTask({ repeat = false } = {}) {
  const session = state.session;
  if (!session?.isActive) return;
  session.completedCount += 1;
  state.todayCompleted += 1;
  const area = state.areas.find((item) => item.id === session.areaId);
  if (area) {
    area.completedCount += 1;
    area.lastWorkedAt = new Date().toISOString();
  }
  if (!repeat) session.currentTask = chooseTask(session.mode, session.areaId);
  saveState();
  renderRun();
  showPop();
  showToast("1手ぶん進みました");
}

function skipTask({ silent = false } = {}) {
  const session = state.session;
  if (!session?.isActive) return;
  session.currentTask = chooseTask(session.mode, session.areaId);
  saveState();
  renderRun();
  if (!silent) showToast("スキップしました");
}

function endSession() {
  if (!state.session) return;
  state.session.isActive = false;
  saveState();
  stopTimer();
  renderSummary();
  showScreen("summaryScreen");
}

function renderSummary() {
  const session = state.session;
  $("summarySessionCount").textContent = session?.completedCount || 0;
  $("summaryTodayCount").textContent = state.todayCompleted;
  $("summaryDialogue").textContent = praiseLines[(session?.completedCount || 0) % praiseLines.length];
  setImage($("summaryBefore"), session?.beforeImage);
  setImage($("summaryAfter"), session?.afterImage);
}

function renderDriveStatus() {
  $("driveClientIdInput").value = state.drive?.clientId || "";
  const status = $("driveStatus");
  const connected = hasDriveToken();
  status.textContent = connected ? "接続中" : state.drive?.clientId ? "未接続" : "未設定";
  status.classList.toggle("connected", connected);
}

function saveDriveClientId() {
  state.drive.clientId = $("driveClientIdInput").value.trim();
  state.drive.folderId = null;
  driveToken = null;
  driveTokenExpiresAt = 0;
  driveTokenClient = null;
  saveState();
  renderDriveStatus();
  showToast(state.drive.clientId ? "Drive設定を保存しました" : "Drive設定を空にしました");
}

function hasDriveToken() {
  return Boolean(driveToken && Date.now() < driveTokenExpiresAt - 60000);
}

function connectDrive() {
  const clientId = state.drive?.clientId || $("driveClientIdInput").value.trim();
  if (!clientId) {
    showToast("OAuthクライアントIDを入れてください");
    return Promise.reject(new Error("Missing Google OAuth client ID"));
  }
  if (!window.google?.accounts?.oauth2) {
    showToast("Google認証ライブラリを読み込み中です");
    return Promise.reject(new Error("Google Identity Services is not loaded"));
  }
  state.drive.clientId = clientId;
  saveState();
  return new Promise((resolve, reject) => {
    driveTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || "Drive authorization failed"));
          return;
        }
        driveToken = response.access_token;
        driveTokenExpiresAt = Date.now() + Number(response.expires_in || 3600) * 1000;
        renderDriveStatus();
        showToast("Google Driveに接続しました");
        resolve(driveToken);
      },
      error_callback: () => {
        reject(new Error("Drive authorization popup was closed"));
      }
    });
    driveTokenClient.requestAccessToken({ prompt: "consent" });
  }).catch((error) => {
    showToast("Drive接続に失敗しました");
    throw error;
  });
}

async function getDriveToken() {
  if (hasDriveToken()) return driveToken;
  return connectDrive();
}

async function ensureDriveFolder() {
  if (state.drive.folderId) return state.drive.folderId;
  const token = await getDriveToken();
  const query = [
    `name = '${DRIVE_FOLDER_NAME.replace(/'/g, "\\'")}'`,
    "mimeType = 'application/vnd.google-apps.folder'",
    "trashed = false"
  ].join(" and ");
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&spaces=drive`;
  const found = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(assertDriveResponse);
  if (found.files?.[0]?.id) {
    state.drive.folderId = found.files[0].id;
    saveState();
    return state.drive.folderId;
  }
  const created = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: DRIVE_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder"
    })
  }).then(assertDriveResponse);
  state.drive.folderId = created.id;
  saveState();
  return created.id;
}

async function uploadSessionPhoto(kind) {
  const session = state.session;
  const dataUrl = kind === "before" ? session?.beforeImage : session?.afterImage;
  if (!dataUrl || !state.drive?.clientId) return;
  try {
    const folderId = await ensureDriveFolder();
    const token = await getDriveToken();
    const blob = dataUrlToBlob(dataUrl);
    const extension = blob.type.includes("png") ? "png" : "jpg";
    const area = state.areas.find((item) => item.id === session.areaId)?.name || "area";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${timestamp}_${safeFileName(area)}_${kind}.${extension}`;
    const metadata = {
      name: filename,
      parents: [folderId]
    };
    const boundary = `okataduke_${Date.now()}`;
    const body = new Blob([
      `--${boundary}\r\n`,
      "Content-Type: application/json; charset=UTF-8\r\n\r\n",
      JSON.stringify(metadata),
      `\r\n--${boundary}\r\n`,
      `Content-Type: ${blob.type || "image/jpeg"}\r\n\r\n`,
      blob,
      `\r\n--${boundary}--`
    ], { type: `multipart/related; boundary=${boundary}` });
    const uploaded = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`
      },
      body
    }).then(assertDriveResponse);
    if (!session.driveFiles) session.driveFiles = {};
    session.driveFiles[kind] = uploaded;
    saveState();
    showToast(`${kind === "before" ? "Before" : "After"}写真をDriveに保存しました`);
  } catch (error) {
    showToast("Drive保存に失敗しました");
    console.error(error);
  }
}

async function assertDriveResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `Drive API error ${response.status}`);
  }
  return data;
}

function dataUrlToBlob(dataUrl) {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}

function safeFileName(value) {
  return value.replace(/[\\/:*?"<>|]/g, "_").slice(0, 32);
}

function startTimer() {
  stopTimer();
  timerId = window.setInterval(() => {
    renderTimer();
    if (remainingMs() <= 0) endSession();
  }, 500);
}

function stopTimer() {
  if (timerId) window.clearInterval(timerId);
  timerId = null;
}

function remainingMs() {
  if (!state.session?.endsAt) return 0;
  return Math.max(0, state.session.endsAt - Date.now());
}

function renderTimer() {
  const totalSeconds = Math.ceil(remainingMs() / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  $("timerText").textContent = `${minutes}:${seconds}`;
}

function showPop() {
  const pop = $("completionPop");
  pop.classList.remove("hidden", "show");
  void pop.offsetWidth;
  pop.classList.add("show");
  window.setTimeout(() => pop.classList.add("hidden"), 780);
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.add("hidden"), 2300);
}

function mascotForTask(task) {
  if (!task) return MASCOTS.broom;
  if (task.category === "clothes" || task.category === "paper") return MASCOTS.laundry;
  return MASCOTS.broom;
}

function readImage(input, callback) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
}

function setImage(img, src) {
  if (src) {
    img.src = src;
    img.classList.remove("hidden");
  } else {
    img.removeAttribute("src");
  }
}

function addArea() {
  const name = $("areaNameInput").value.trim();
  if (!name) return;
  state.areas.push({
    id: `area-${Date.now()}`,
    name,
    level: 1,
    completedCount: 0,
    lastWorkedAt: null
  });
  $("areaNameInput").value = "";
  $("areaDialog").close();
  saveState();
  renderHome();
}

function openTaskEditor(areaId = state.areas[0]?.id) {
  renderTaskAreaOptions();
  $("taskAreaSelect").value = areaId || state.areas[0]?.id || "";
  renderTaskEditor();
  $("taskDialog").showModal();
}

function renderTaskAreaOptions() {
  const select = $("taskAreaSelect");
  select.innerHTML = "";
  state.areas.forEach((area) => {
    const option = document.createElement("option");
    option.value = area.id;
    option.textContent = area.name;
    select.append(option);
  });
}

function renderTaskEditor() {
  const areaId = $("taskAreaSelect").value;
  const custom = state.customTasks?.[areaId];
  const lines = Array.isArray(custom) ? custom : defaultTaskTextsForArea(areaId);
  $("taskListInput").value = lines.join("\n");
}

function saveTaskEditor() {
  const areaId = $("taskAreaSelect").value;
  const lines = $("taskListInput").value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  state.customTasks[areaId] = lines;
  saveState();
  $("taskDialog").close();
  showToast("掃除タスクを保存しました");
}

function resetTaskEditor() {
  const areaId = $("taskAreaSelect").value;
  delete state.customTasks[areaId];
  saveState();
  renderTaskEditor();
  showToast("初期候補に戻しました");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function bindEvents() {
  $("homeButton").addEventListener("click", () => {
    stopTimer();
    renderHome();
    showScreen("homeScreen");
  });
  $("resetButton").addEventListener("click", () => {
    if (!confirm("保存データをリセットしますか？")) return;
    stopTimer();
    state = createInitialState();
    selectedMode = "normal";
    selectedDuration = 5;
    saveState();
    renderHome();
    showScreen("homeScreen");
    showToast("リセットしました");
  });
  $("headerResumeButton").addEventListener("click", resumeSession);
  $("headerAddAreaButton").addEventListener("click", () => $("areaDialog").showModal());
  $("editTasksButton").addEventListener("click", () => openTaskEditor());
  $("saveDriveClientButton").addEventListener("click", saveDriveClientId);
  $("connectDriveButton").addEventListener("click", () => {
    connectDrive().catch((error) => console.error(error));
  });
  $("beginSessionButton").addEventListener("click", startSession);
  $("doneButton").addEventListener("click", () => completeTask());
  $("skipButton").addEventListener("click", skipTask);
  $("endButton").addEventListener("click", endSession);
  $("continueButton").addEventListener("click", () => {
    selectedMode = state.session?.mode || selectedMode;
    renderSetup({ resetBefore: true });
    showScreen("setupScreen");
  });
  $("finishButton").addEventListener("click", () => {
    state.session = null;
    saveState();
    renderHome();
    showScreen("homeScreen");
    showToast("おつかれさまでした");
  });
  $("saveAreaButton").addEventListener("click", addArea);
  $("taskAreaSelect").addEventListener("change", renderTaskEditor);
  $("saveTasksButton").addEventListener("click", saveTaskEditor);
  $("resetTasksButton").addEventListener("click", resetTaskEditor);
  $("durationGroup").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-duration]");
    if (!button) return;
    selectedDuration = Number(button.dataset.duration);
    document.querySelectorAll("#durationGroup button").forEach((item) => {
      item.classList.toggle("selected", item === button);
    });
  });
  $("beforeInput").addEventListener("change", (event) => {
    readImage(event.target, (src) => setImage($("beforePreview"), src));
  });
  $("afterInput").addEventListener("change", (event) => {
    readImage(event.target, (src) => {
      if (!state.session) return;
      state.session.afterImage = src;
      saveState();
      setImage($("summaryAfter"), src);
      showToast("After写真を保存しました");
      uploadSessionPhoto("after");
    });
  });
}

bindEvents();
renderHome();

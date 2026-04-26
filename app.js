const STORAGE_KEY = "okataduke-itte-state-v1";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const DRIVE_FOLDER_NAME = "おかたづけ一手 Photos";

const defaultAreas = [
  { id: "desk", name: "机", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "bed", name: "ベッド周り", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "floor", name: "床", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "entry", name: "玄関", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "kitchen", name: "キッチン", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "sink", name: "洗面所", level: 1, completedCount: 0, lastWorkedAt: null },
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
  { id: "trash_3", text: "ゴミを3つ捨てる", category: "trash", energy: "low", estimatedMinutes: 2 },
  { id: "trash_1_bottle", text: "ペットボトルを1本捨てる", category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "trash_clear", text: "明らかに不要なものを1つ捨てる", category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "floor_3", text: "床のものを3個拾う", category: "floor", energy: "low", estimatedMinutes: 2 },
  { id: "floor_5", text: "床のものを5個拾う", category: "floor", energy: "high", estimatedMinutes: 2 },
  { id: "desk_paper_3", text: "机の上から紙を3枚どかす", category: "paper", energy: "normal", estimatedMinutes: 2 },
  { id: "paper_stack_3", text: "紙を3枚だけ同じ向きに重ねる", category: "paper", energy: "low", estimatedMinutes: 1 },
  { id: "clothes_5", text: "洗濯物を5枚だけカゴに入れる", category: "clothes", energy: "normal", estimatedMinutes: 2 },
  { id: "clothes_3", text: "服を3枚だけ一か所に集める", category: "clothes", energy: "low", estimatedMinutes: 2 },
  { id: "shoes_1", text: "玄関の靴を1足だけ揃える", category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "cup_1", text: "空のコップを1つ流しへ運ぶ", category: "dishes", energy: "low", estimatedMinutes: 1 },
  { id: "surface_3", text: "平らな場所から3つだけどかす", category: "tiny", energy: "normal", estimatedMinutes: 2 }
];

const coachLines = [
  "終わったら、押すだけで大丈夫。",
  "判断が重いものは触らなくて大丈夫。",
  "完璧にしないのが今日の作戦。",
  "3つで止めても、進んでいます。",
  "迷ったら保留で逃がしましょう。"
];

const praiseLines = [
  "よし、少し空気が通りました。",
  "小さい1手は、ちゃんと進捗です。",
  "今日はここで区切って大丈夫。",
  "見える範囲が少し変わりました。",
  "終われるところまで来ました。"
];

let state = loadState();
let selectedMode = state.session?.mode || "normal";
let selectedDuration = state.session?.durationMinutes || 5;
let timerId = null;
let toastTimer = null;
let coachTimer = null;
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
    if (!initial.drive) initial.drive = { clientId: "", folderId: null };
    return initial;
  } catch {
    return createInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  $("headerTodayCount").textContent = state.todayCompleted;
  $("holdCount").textContent = state.heldTasks.length;
  $("areaCount").textContent = state.areas.length;
  $("resumeButton").classList.toggle("hidden", !state.session?.isActive);

  const areaGrid = $("areaGrid");
  areaGrid.innerHTML = "";
  state.areas.forEach((area) => {
    const card = document.createElement("article");
    card.className = "area-card";
    const percent = Math.min(100, area.completedCount * 10);
    card.innerHTML = `
      <strong>${escapeHtml(area.name)}</strong>
      <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
      <small>${area.completedCount}手 完了</small>
    `;
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
  state.session = {
    id: `session-${Date.now()}`,
    areaId,
    mode: selectedMode,
    startedAt: new Date().toISOString(),
    durationMinutes: selectedDuration,
    completedCount: 0,
    currentTask: chooseTask(selectedMode),
    beforeImage: $("beforePreview").src || null,
    afterImage: null,
    isActive: true,
    endsAt: Date.now() + selectedDuration * 60 * 1000
  };
  saveState();
  renderRun();
  showScreen("runScreen");
  startTimer();
  showCoach("最初は3つだけで大丈夫。");
  uploadSessionPhoto("before");
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

function chooseTask(modeId) {
  const mode = modes.find((item) => item.id === modeId) || modes[1];
  const pool = taskTemplates.filter((task) => {
    const categoryMatch = mode.categories.includes(task.category);
    const energyMatch = mode.energy === "high" || task.energy !== "high";
    return categoryMatch && energyMatch;
  });
  const list = pool.length ? pool : taskTemplates;
  const task = list[state.lastTaskIndex % list.length];
  state.lastTaskIndex += 1;
  return task;
}

function renderRun() {
  const session = state.session;
  const area = state.areas.find((item) => item.id === session.areaId);
  const mode = modes.find((item) => item.id === session.mode);
  $("headerTodayCount").textContent = state.todayCompleted;
  $("currentArea").textContent = area?.name || "エリア";
  $("modeLabel").textContent = mode?.label || "普通";
  $("taskText").textContent = session.currentTask?.text || "ゴミを3つ捨てる";
  $("sessionDoneCount").textContent = session.completedCount;
  $("coachLine").textContent = coachLines[session.completedCount % coachLines.length];
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
  if (!repeat) session.currentTask = chooseTask(session.mode);
  saveState();
  renderRun();
  showPop();
  showToast("1手ぶん進みました");
  showCoach(coachLines[session.completedCount % coachLines.length]);
}

function skipTask({ silent = false } = {}) {
  const session = state.session;
  if (!session?.isActive) return;
  session.currentTask = chooseTask(session.mode);
  saveState();
  renderRun();
  if (!silent) showToast("スキップしました");
}

function holdTask() {
  const session = state.session;
  if (!session?.isActive) return;
  state.heldTasks.push({ ...session.currentTask, heldAt: new Date().toISOString() });
  showToast("保留に逃がしました");
  skipTask({ silent: true });
}

function endSession() {
  if (!state.session) return;
  state.session.isActive = false;
  saveState();
  stopTimer();
  renderSummary();
  showCoach(praiseLines[(state.session?.completedCount || 0) % praiseLines.length]);
  showScreen("summaryScreen");
}

function renderSummary() {
  const session = state.session;
  $("summarySessionCount").textContent = session?.completedCount || 0;
  $("summaryTodayCount").textContent = state.todayCompleted;
  $("summaryLine").textContent = praiseLines[(session?.completedCount || 0) % praiseLines.length];
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

function showCoach(message) {
  const bubble = $("coachBubble");
  $("coachBubbleText").textContent = message;
  bubble.classList.remove("hidden");
  window.clearTimeout(coachTimer);
  coachTimer = window.setTimeout(() => bubble.classList.add("hidden"), 3600);
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
  $("saveDriveClientButton").addEventListener("click", saveDriveClientId);
  $("connectDriveButton").addEventListener("click", () => {
    connectDrive().catch((error) => console.error(error));
  });
  $("startButton").addEventListener("click", () => {
    renderSetup({ resetBefore: true });
    showScreen("setupScreen");
  });
  $("resumeButton").addEventListener("click", resumeSession);
  $("beginSessionButton").addEventListener("click", startSession);
  $("doneButton").addEventListener("click", () => completeTask());
  $("repeatButton").addEventListener("click", () => completeTask({ repeat: true }));
  $("skipButton").addEventListener("click", skipTask);
  $("holdButton").addEventListener("click", holdTask);
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
  $("addAreaButton").addEventListener("click", () => $("areaDialog").showModal());
  $("saveAreaButton").addEventListener("click", addArea);
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
  document.querySelectorAll("[data-mobile-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      const nav = button.dataset.mobileNav;
      if (nav === "home") {
        stopTimer();
        renderHome();
        showScreen("homeScreen");
      }
      if (nav === "start") {
        renderSetup({ resetBefore: true });
        showScreen("setupScreen");
      }
      if (nav === "resume") resumeSession();
    });
  });
}

bindEvents();
renderHome();

const state = {
  yourName: "Chris",
  herName: "Sofhia"
};

const introScreen = document.getElementById("introScreen");
const introCard = document.querySelector(".intro-card");
const introTitle = document.getElementById("introTitle");
const introHint = document.getElementById("introHint");
const introTimeLine = document.getElementById("introTimeLine");
const introTeaser = document.getElementById("introTeaser");
const introSealBtn = document.getElementById("introSealBtn");
const introSealTrack = document.querySelector(".intro-seal-track");
const introSealProgress = document.getElementById("introSealProgress");
const mainPage = document.getElementById("mainPage");
const bgMusic = document.getElementById("bgMusic");

const heroTitle = document.getElementById("heroTitle");
const heroSubtitle = document.getElementById("heroSubtitle");
const confessionMessage = document.getElementById("confessionMessage");
const flowerBtn = document.getElementById("flowerBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseModal = document.getElementById("surpriseModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalMessage = document.getElementById("modalMessage");
const nicknameToggle = document.getElementById("nicknameToggle");
const moodToggle = document.getElementById("moodToggle");
const daysCounter = document.getElementById("daysCounter");
const distanceText = document.getElementById("distanceText");
const memoryTitle = document.getElementById("memoryTitle");
const memoryText = document.getElementById("memoryText");
const memoryPrev = document.getElementById("memoryPrev");
const memoryNext = document.getElementById("memoryNext");
const relationshipMap = document.querySelector(".relationship-map");
const holdRevealBtn = document.getElementById("holdRevealBtn");
const holdProgress = document.getElementById("holdProgress");
const secretLine = document.getElementById("secretLine");
const finalVowBtn = document.getElementById("finalVowBtn");
const finalVowLine = document.getElementById("finalVowLine");
const saveKeepsakeBtn = document.getElementById("saveKeepsakeBtn");
const copyShareLinkBtn = document.getElementById("copyShareLinkBtn");
const shareLinkStatus = document.getElementById("shareLinkStatus");
const letterNotes = document.querySelectorAll(".letter-note");

let musicAvailable = true;
const DEFAULT_MUSIC_VOLUME = 0.4;
const PRIMED_MUSIC_VOLUME = 0.001;
const metDate = new Date("2025-07-27T00:00:00");
const memoryCards = [
  {
    title: "What I Admire About You",
    text: "You are kind even when no one is looking, and that softness is one of the reasons I love you deeply."
  },
  {
    title: "What I Am Grateful For",
    text: "I am grateful for every conversation, every laugh, and every quiet moment where I feel close to you."
  },
  {
    title: "What I Promise",
    text: "I will love you with patience, honesty, and effort, not just in words but in the way I show up every day."
  }
];

let typingTimer = null;
let memoryTypingTimer = null;
let heartTrailEnabled = false;
let lastHeartTime = 0;
let useNickname = false;
let memoryIndex = 0;
let holdTimer = null;
let holdStart = 0;
let flowerComboCount = 0;
let flowerComboResetTimer = null;
const FLOWER_COMBO_THRESHOLD = 3;
const FLOWER_COMBO_WINDOW_MS = 5000;
let daysRefreshTimer = null;
let secretTypingTimer = null;
let secretRevealDone = false;
const secretLineText = secretLine ? secretLine.textContent : "";
let modalTypingTimer = null;
const modalMessageText = modalMessage ? modalMessage.textContent : "";
let mood = "day";
const letterTypingTimers = new WeakMap();
const URL_TEXT_LIMIT = 40;
const MUSIC_MOMENT_TRIGGER_RATIO = 0.54;
let sweetNickname = "My Sofiii";
let musicMomentTimer = null;
let musicPrimedByGesture = false;
let audioUnlockBound = false;
let moodParticleTimer = null;
let introTeaserIndex = 0;
let introTeaserTimer = null;
let introHoldTimer = null;
let introHoldStart = 0;
let introCompleted = false;
const INTRO_HOLD_MS = 3000;
let revealObserver = null;
const confessionHighlightPhrases = [
  "I am grateful",
  "patient, sincere, and real",
  "choosing you",
  "respect, consistency, and care"
];
const letterOpenTimers = new WeakMap();
const finalVowText = finalVowLine ? finalVowLine.textContent : "";
let finalVowTypingTimer = null;
let shareStatusTimer = null;
const introTeaserLines = [
  "I still remember our first long call.",
  "Distance never changed how I feel.",
  "You are in my prayers every day.",
  "Different time zones, same heart.",
  "I keep choosing you, always."
];

const australiaPoint = { lat: -12.4634, lng: 130.8456, city: "Darwin" };
const philippinesPoint = { lat: 14.4791, lng: 120.8969, city: "Cavite" };

function getDisplayName() {
  return useNickname ? sweetNickname : state.herName;
}

function getConfessionText() {
  return `Thank you for coming into my life, ${getDisplayName()}. Even if we are far away from each other, I still feel close to you in my heart every single day. I know we are not yet official lovers, and I respect that, but I want to be honest about how deeply I feel. I am grateful for every message, every call, every small moment we share across the distance. You make my ordinary days feel softer, brighter, and more meaningful. Sometimes the distance is hard, but my feelings stay the same: patient, sincere, and real. I admire your heart, your kindness, and the way you make me feel seen even from miles away. If the right time comes, I would love to build something true with you, one step at a time. Until then, I will keep choosing you with respect, consistency, and care. I may not be beside you physically right now, but I am always here for you, and I am grateful that I met you.`;
}

function sanitizeParamValue(value, maxLength) {
  if (!value) {
    return "";
  }
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function applyUrlPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const nameParam = sanitizeParamValue(params.get("name"), URL_TEXT_LIMIT);
  const nickParam = sanitizeParamValue(params.get("nick"), URL_TEXT_LIMIT);

  if (nameParam) {
    state.herName = nameParam;
  }
  if (nickParam) {
    sweetNickname = nickParam;
  }
}

function triggerMusicMoment() {
  if (!musicAvailable || !bgMusic || bgMusic.paused) {
    return;
  }

  if (musicMomentTimer) {
    clearTimeout(musicMomentTimer);
    musicMomentTimer = null;
  }

  const boostedVolume = Math.min(1, DEFAULT_MUSIC_VOLUME + 0.16);
  bgMusic.volume = boostedVolume;
  musicMomentTimer = setTimeout(() => {
    bgMusic.volume = DEFAULT_MUSIC_VOLUME;
    musicMomentTimer = null;
  }, 1800);
}

function getTimeAwareLine() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return `Good morning, ${state.herName}.`;
  }
  if (hour < 18) {
    return `Good afternoon, ${state.herName}.`;
  }
  return `Good evening, ${state.herName}.`;
}

function getSeasonTag() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) {
    return "blossom";
  }
  if (month >= 5 && month <= 7) {
    return "sunlit";
  }
  if (month >= 8 && month <= 10) {
    return "amber";
  }
  return "cozy";
}

function applySeasonTheme() {
  document.body.setAttribute("data-season", getSeasonTag());
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getHighlightedConfessionHtml(text) {
  let html = escapeHtml(text);
  const phrases = [...confessionHighlightPhrases].sort((a, b) => b.length - a.length);

  phrases.forEach((phrase) => {
    const escapedPhrase = escapeRegExp(escapeHtml(phrase));
    const rx = new RegExp(escapedPhrase, "gi");
    html = html.replace(rx, (match) => `<span class="phrase-wave">${match}</span>`);
  });

  return html;
}

function initSectionReveal() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length === 0) {
    return;
  }

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${index * 80}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    if (relationshipMap) {
      relationshipMap.classList.add("route-live");
    }
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      if (entry.target.classList.contains("relationship-map")) {
        entry.target.classList.add("route-live");
      }
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px"
  });

  revealItems.forEach((item) => revealObserver.observe(item));
}

function spawnMoodParticle() {
  if (!introCompleted || mainPage.classList.contains("hidden")) {
    return;
  }

  const particle = document.createElement("span");
  const isNight = mood === "night";
  particle.className = `mood-particle ${isNight ? "night-particle" : "day-particle"}`;

  const x = Math.floor(Math.random() * window.innerWidth);
  const y = isNight ? -10 - Math.floor(Math.random() * 30) : window.innerHeight + 10 + Math.floor(Math.random() * 30);
  const dx = -40 + Math.floor(Math.random() * 80);
  const dy = isNight ? 170 + Math.floor(Math.random() * 120) : -170 - Math.floor(Math.random() * 130);
  const size = 6 + Math.floor(Math.random() * 10);
  const duration = isNight ? 4400 + Math.floor(Math.random() * 1800) : 3400 + Math.floor(Math.random() * 1400);

  particle.style.setProperty("--particle-x", `${x}px`);
  particle.style.setProperty("--particle-y", `${y}px`);
  particle.style.setProperty("--particle-dx", `${dx}px`);
  particle.style.setProperty("--particle-dy", `${dy}px`);
  particle.style.setProperty("--particle-size", `${size}px`);
  particle.style.setProperty("--particle-duration", `${duration}ms`);

  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), duration + 120);
}

function startMoodParticles() {
  if (moodParticleTimer) {
    return;
  }
  moodParticleTimer = setInterval(spawnMoodParticle, 840);
}

function runFinalVowTypewriter() {
  if (!finalVowLine) {
    return;
  }

  if (finalVowTypingTimer) {
    clearTimeout(finalVowTypingTimer);
    finalVowTypingTimer = null;
  }

  finalVowLine.classList.remove("hidden");
  finalVowLine.classList.add("typing-caret");
  finalVowLine.textContent = "";

  let index = 0;
  const step = () => {
    finalVowLine.textContent = finalVowText.slice(0, index);
    index += 1;

    if (index <= finalVowText.length) {
      const currentChar = finalVowText[index - 1];
      const delay = /[,.!?]/.test(currentChar) ? 165 : 44;
      finalVowTypingTimer = setTimeout(step, delay);
      return;
    }

    finalVowLine.classList.remove("typing-caret");
    if (finalVowBtn) {
      finalVowBtn.textContent = "Always, still you.";
      finalVowBtn.setAttribute("disabled", "true");
    }
  };

  step();
}

function renderIntroTimeLine() {
  if (!introTimeLine) {
    return;
  }
  introTimeLine.textContent = `${getTimeAwareLine()} I made this just for you.`;
}

function setIntroTeaser(index) {
  if (!introTeaser) {
    return;
  }
  introTeaser.classList.add("is-switching");
  setTimeout(() => {
    introTeaser.textContent = introTeaserLines[index % introTeaserLines.length];
    introTeaser.classList.remove("is-switching");
  }, 180);
}

function startIntroTeaserRotation() {
  if (!introTeaser || introTeaserTimer) {
    return;
  }
  setIntroTeaser(introTeaserIndex);
  introTeaserTimer = setInterval(() => {
    introTeaserIndex = (introTeaserIndex + 1) % introTeaserLines.length;
    setIntroTeaser(introTeaserIndex);
  }, 3400);
}

function stopIntroTeaserRotation() {
  if (introTeaserTimer) {
    clearInterval(introTeaserTimer);
    introTeaserTimer = null;
  }
}

function spawnIntroPetalBurst() {
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "intro-petal";

    const x = (window.innerWidth * 0.5) + (Math.random() * 140 - 70);
    const y = (window.innerHeight * 0.56) + (Math.random() * 30 - 15);
    const dx = -180 + Math.random() * 360;
    const dy = -240 - Math.random() * 160;
    const size = 10 + Math.floor(Math.random() * 12);
    const rot = -30 + Math.floor(Math.random() * 60);
    const duration = 880 + Math.floor(Math.random() * 520);

    petal.style.setProperty("--petal-x", `${x}px`);
    petal.style.setProperty("--petal-y", `${y}px`);
    petal.style.setProperty("--petal-dx", `${dx}px`);
    petal.style.setProperty("--petal-dy", `${dy}px`);
    petal.style.setProperty("--petal-size", `${size}px`);
    petal.style.setProperty("--petal-rot", `${rot}deg`);
    petal.style.setProperty("--petal-duration", `${duration}ms`);

    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), duration + 100);
  }
}

function beginIntroTransition() {
  if (introCompleted) {
    return;
  }
  introCompleted = true;
  stopIntroTeaserRotation();
  if (introSealTrack) {
    introSealTrack.classList.remove("is-holding");
  }

  if (introScreen) {
    introScreen.classList.add("is-exiting");
  }
  spawnIntroPetalBurst();

  if (musicPrimedByGesture) {
    try {
      bgMusic.currentTime = 0;
    } catch {}
  }
  tryPlayMusic();

  // Retry once shortly after transition starts for stricter mobile autoplay timing.
  setTimeout(() => {
    if (musicAvailable && bgMusic.paused) {
      tryPlayMusic();
    }
  }, 700);

  setTimeout(() => {
    triggerMusicMoment();
  }, 320);

  setTimeout(() => {
    showMainPage();
    runTypewriter(getConfessionText());
    heartTrailEnabled = true;
    if (introHint) {
      introHint.textContent = "Here is my confession.";
    }
  }, 640);
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function haversineKm(a, b) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = (sinLat * sinLat) + (Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return earthRadiusKm * c;
}

function renderDistanceCard() {
  if (!distanceText) {
    return;
  }
  const km = Math.round(haversineKm(australiaPoint, philippinesPoint));
  distanceText.textContent = `${australiaPoint.city}, Australia to ${philippinesPoint.city}, Philippines: about ${km.toLocaleString()} km apart, still connected by heart.`;
}

function applyMood(nextMood) {
  mood = nextMood;
  document.body.setAttribute("data-mood", mood);
  if (moodToggle) {
    const isNight = mood === "night";
    moodToggle.setAttribute("aria-pressed", String(isNight));
    moodToggle.textContent = isNight ? "Switch to Soft Sunrise" : "Switch to Dreamy Evening";
  }
  try {
    localStorage.setItem("confession-mood", mood);
  } catch {}
}

function showMainPage() {
  introScreen.classList.add("hidden");
  mainPage.classList.remove("hidden");
  mainPage.classList.remove("page-live");
  requestAnimationFrame(() => {
    mainPage.classList.add("page-live");
  });
}

async function tryPlayMusic() {
  if (!musicAvailable) {
    return;
  }

  try {
    bgMusic.volume = DEFAULT_MUSIC_VOLUME;
    await bgMusic.play();
  } catch {}
}

async function primeMusicFromGesture() {
  if (!musicAvailable || musicPrimedByGesture) {
    return;
  }

  const previousVolume = bgMusic.volume;
  bgMusic.volume = PRIMED_MUSIC_VOLUME;

  try {
    await bgMusic.play();
    bgMusic.pause();
    try {
      bgMusic.currentTime = 0;
    } catch {}
    bgMusic.volume = DEFAULT_MUSIC_VOLUME;
    musicPrimedByGesture = true;
  } catch {
    bgMusic.volume = previousVolume;
  }
}

function bindGlobalAudioUnlock() {
  if (audioUnlockBound) {
    return;
  }
  audioUnlockBound = true;

  const unlock = () => {
    primeMusicFromGesture();
    if (musicPrimedByGesture) {
      ["pointerdown", "touchstart", "click", "keydown"].forEach((eventName) => {
        window.removeEventListener(eventName, unlock, true);
      });
    }
  };

  ["pointerdown", "touchstart", "click", "keydown"].forEach((eventName) => {
    window.addEventListener(eventName, unlock, true);
  });
}

function renderContent() {
  heroTitle.textContent = `${getDisplayName()}, Thank You`;
  heroSubtitle.textContent = `From me, with a grateful heart.`;
  introTitle.textContent = `Hi, ${state.herName}.`;
  renderIntroTimeLine();
  confessionMessage.textContent = "";
}

function renderDaysCounter() {
  if (!daysCounter) {
    return;
  }
  const now = new Date();
  const diff = now.getTime() - metDate.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  daysCounter.textContent = `${days} days since I met you`;
}

function scheduleDaysCounterRefresh() {
  if (daysRefreshTimer) {
    clearTimeout(daysRefreshTimer);
    daysRefreshTimer = null;
  }

  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const msUntilNextDay = Math.max(1000, nextMidnight.getTime() - now.getTime());

  daysRefreshTimer = setTimeout(() => {
    renderDaysCounter();
    scheduleDaysCounterRefresh();
  }, msUntilNextDay);
}

function renderMemoryCard() {
  if (!memoryTitle || !memoryText) {
    return;
  }
  const card = memoryCards[memoryIndex];
  memoryTitle.textContent = card.title;
  runMemoryTypewriter(card.text);
}

function runMemoryTypewriter(text) {
  if (!memoryText) {
    return;
  }

  memoryText.classList.add("typing-caret");
  memoryText.textContent = "";

  if (memoryTypingTimer) {
    clearTimeout(memoryTypingTimer);
    memoryTypingTimer = null;
  }

  let index = 0;
  const step = () => {
    memoryText.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      const currentChar = text[index - 1];
      const delay = /[,.!?]/.test(currentChar) ? 145 : 34;
      memoryTypingTimer = setTimeout(step, delay);
      return;
    }

    memoryText.classList.remove("typing-caret");
  };

  step();
}

function runTypewriter(text) {
  confessionMessage.classList.add("typing-caret");
  confessionMessage.textContent = "";

  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }

  let index = 0;
  const triggerIndex = Math.max(1, Math.floor(text.length * MUSIC_MOMENT_TRIGGER_RATIO));
  let momentTriggered = false;
  const step = () => {
    confessionMessage.textContent = text.slice(0, index);

    if (!momentTriggered && index >= triggerIndex) {
      triggerMusicMoment();
      momentTriggered = true;
    }

    index += 1;

    if (index <= text.length) {
      const currentChar = text[index - 1];
      const delay = /[,.!?]/.test(currentChar) ? 170 : 46;
      typingTimer = setTimeout(step, delay);
      return;
    }

    confessionMessage.classList.remove("typing-caret");
    confessionMessage.innerHTML = getHighlightedConfessionHtml(text);
  };

  step();
}

function runSecretTypewriter() {
  if (!secretLine) {
    return;
  }

  if (secretTypingTimer) {
    clearTimeout(secretTypingTimer);
    secretTypingTimer = null;
  }

  secretLine.classList.remove("hidden");
  secretLine.classList.add("typing-caret");
  secretLine.textContent = "";

  let index = 0;
  const step = () => {
    secretLine.textContent = secretLineText.slice(0, index);
    index += 1;

    if (index <= secretLineText.length) {
      const currentChar = secretLineText[index - 1];
      const delay = /[,.!?]/.test(currentChar) ? 155 : 42;
      secretTypingTimer = setTimeout(step, delay);
      return;
    }

    secretLine.classList.remove("typing-caret");
    secretRevealDone = true;
  };

  step();
}

function runModalTypewriter() {
  if (!modalMessage) {
    return;
  }

  if (modalTypingTimer) {
    clearTimeout(modalTypingTimer);
    modalTypingTimer = null;
  }

  modalMessage.classList.add("typing-caret");
  modalMessage.textContent = "";

  let index = 0;
  const step = () => {
    modalMessage.textContent = modalMessageText.slice(0, index);
    index += 1;

    if (index <= modalMessageText.length) {
      const currentChar = modalMessageText[index - 1];
      const delay = /[,.!?]/.test(currentChar) ? 210 : 58;
      modalTypingTimer = setTimeout(step, delay);
      return;
    }

    modalMessage.classList.remove("typing-caret");
  };

  step();
}

function runLetterTypewriter(note) {
  const paragraph = note.querySelector("p");
  if (!paragraph) {
    return;
  }

  const fullText = paragraph.dataset.fullText || "";
  const existingTimer = letterTypingTimers.get(paragraph);
  if (existingTimer) {
    clearTimeout(existingTimer);
    letterTypingTimers.delete(paragraph);
  }

  paragraph.classList.add("typing-caret");
  paragraph.textContent = "";

  let index = 0;
  const step = () => {
    paragraph.textContent = fullText.slice(0, index);
    index += 1;

    if (index <= fullText.length) {
      const currentChar = fullText[index - 1];
      const delay = /[,.!?]/.test(currentChar) ? 155 : 36;
      const timer = setTimeout(step, delay);
      letterTypingTimers.set(paragraph, timer);
      return;
    }

    paragraph.classList.remove("typing-caret");
    letterTypingTimers.delete(paragraph);
  };

  step();
}

function openModal() {
  if (!surpriseModal) {
    return;
  }
  surpriseModal.classList.remove("hidden");
  surpriseModal.setAttribute("aria-hidden", "false");
  runModalTypewriter();
}

function closeModal() {
  if (!surpriseModal) {
    return;
  }
  if (modalTypingTimer) {
    clearTimeout(modalTypingTimer);
    modalTypingTimer = null;
  }
  if (modalMessage) {
    modalMessage.classList.remove("typing-caret");
    modalMessage.textContent = "";
  }
  surpriseModal.classList.add("hidden");
  surpriseModal.setAttribute("aria-hidden", "true");
}

function spawnHeart(x, y) {
  const heart = document.createElement("span");
  heart.className = "floating-heart";

  const size = 12 + Math.floor(Math.random() * 13);
  const driftX = -24 + Math.floor(Math.random() * 48);
  const driftY = -42 - Math.floor(Math.random() * 46);

  heart.style.setProperty("--heart-size", `${size}px`);
  heart.style.setProperty("--heart-x", `${x}px`);
  heart.style.setProperty("--heart-y", `${y}px`);
  heart.style.setProperty("--heart-dx", `${driftX}px`);
  heart.style.setProperty("--heart-dy", `${driftY}px`);

  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 2300);
}

function triggerComboCelebration() {
  const confettiColors = [
    ["#ffd166", "#d4a33f"],
    ["#ff8fab", "#d55f88"],
    ["#90e0ef", "#57b4c3"],
    ["#b5e48c", "#7fb85c"],
    ["#f7aef8", "#c977ca"]
  ];
  const petalPalette = [
    ["#ffd4e7", "#f484b7", "#cf4a87"],
    ["#ffc7de", "#f170aa", "#c73c7a"],
    ["#ffd9ea", "#f79bc3", "#d85b92"]
  ];

  for (let i = 0; i < 68; i += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    const x = Math.floor(Math.random() * window.innerWidth);
    const y = -10 - Math.floor(Math.random() * 80);
    const driftX = -140 + Math.floor(Math.random() * 280);
    const [color, shadow] = confettiColors[i % confettiColors.length];
    const confettiWidth = 6 + Math.floor(Math.random() * 5);
    const confettiHeight = 10 + Math.floor(Math.random() * 8);
    const spin = 460 + Math.floor(Math.random() * 520);
    const rot = -35 + Math.floor(Math.random() * 70);
    const duration = 2600 + Math.floor(Math.random() * 1300);

    confetti.style.setProperty("--confetti-x", `${x}px`);
    confetti.style.setProperty("--confetti-y", `${y}px`);
    confetti.style.setProperty("--confetti-dx", `${driftX}px`);
    confetti.style.setProperty("--confetti-color", color);
    confetti.style.setProperty("--confetti-shadow", shadow);
    confetti.style.setProperty("--confetti-w", `${confettiWidth}px`);
    confetti.style.setProperty("--confetti-h", `${confettiHeight}px`);
    confetti.style.setProperty("--confetti-spin", `${spin}deg`);
    confetti.style.setProperty("--confetti-rot", `${rot}deg`);
    confetti.style.setProperty("--confetti-duration", `${duration}ms`);

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }

  for (let i = 0; i < 44; i += 1) {
    const roseDrop = document.createElement("span");
    roseDrop.className = "rose-rain";
    const dropX = Math.floor(Math.random() * window.innerWidth);
    const driftX = -40 + Math.floor(Math.random() * 80);
    const size = 10 + Math.floor(Math.random() * 12);
    const spin = 180 + Math.floor(Math.random() * 280);
    const tilt = -24 + Math.floor(Math.random() * 48);
    const duration = 3600 + Math.floor(Math.random() * 2200);
    const palette = petalPalette[i % petalPalette.length];

    roseDrop.style.setProperty("--drop-x", `${dropX}px`);
    roseDrop.style.setProperty("--drop-dx", `${driftX}px`);
    roseDrop.style.setProperty("--drop-size", `${size}px`);
    roseDrop.style.setProperty("--drop-spin", `${spin}deg`);
    roseDrop.style.setProperty("--drop-tilt", `${tilt}deg`);
    roseDrop.style.setProperty("--drop-duration", `${duration}ms`);
    roseDrop.style.setProperty("--petal-light", palette[0]);
    roseDrop.style.setProperty("--petal-mid", palette[1]);
    roseDrop.style.setProperty("--petal-dark", palette[2]);

    document.body.appendChild(roseDrop);
    setTimeout(() => roseDrop.remove(), duration + 300);
  }
}

function handleHeartTrail(clientX, clientY) {
  if (!heartTrailEnabled) {
    return;
  }

  const now = Date.now();
  if (now - lastHeartTime < 60) {
    return;
  }
  lastHeartTime = now;

  spawnHeart(clientX, clientY);
}

function createFlowerElement() {
  const flower = document.createElement("span");
  flower.className = "pink-flower";

  const outerPetals = 8;
  for (let i = 0; i < outerPetals; i += 1) {
    const petal = document.createElement("span");
    petal.className = "flower-petal";
    petal.style.setProperty("--petal-w", "44%");
    petal.style.setProperty("--petal-h", "60%");
    petal.style.setProperty("--petal-light", "#ffc7e3");
    petal.style.setProperty("--petal-dark", "#ef5fa0");
    petal.style.transform = `translate(-50%, -93%) rotate(${i * (360 / outerPetals)}deg)`;
    flower.appendChild(petal);
  }

  const innerPetals = 5;
  for (let i = 0; i < innerPetals; i += 1) {
    const petal = document.createElement("span");
    petal.className = "flower-petal";
    petal.style.setProperty("--petal-w", "36%");
    petal.style.setProperty("--petal-h", "48%");
    petal.style.setProperty("--petal-light", "#ffb7d9");
    petal.style.setProperty("--petal-dark", "#d9488b");
    petal.style.transform = `translate(-50%, -79%) rotate(${18 + (i * (360 / innerPetals))}deg)`;
    flower.appendChild(petal);
  }

  const core = document.createElement("span");
  core.className = "flower-core";
  flower.appendChild(core);

  return flower;
}

function spawnFlowerBurst() {
  const beatFactor = bgMusic && !bgMusic.paused ? Math.abs(Math.sin(bgMusic.currentTime * 4)) : 0.35;
  const totalFlowers = 10 + Math.floor(beatFactor * 10);

  flowerComboCount += 1;
  if (flowerComboResetTimer) {
    clearTimeout(flowerComboResetTimer);
  }
  flowerComboResetTimer = setTimeout(() => {
    flowerComboCount = 0;
  }, FLOWER_COMBO_WINDOW_MS);

  if (flowerBtn) {
    flowerBtn.classList.remove("btn-pulse");
    requestAnimationFrame(() => flowerBtn.classList.add("btn-pulse"));
  }

  if (flowerComboCount >= FLOWER_COMBO_THRESHOLD) {
    triggerComboCelebration();
    flowerComboCount = 0;
    clearTimeout(flowerComboResetTimer);
    flowerComboResetTimer = null;
  }

  for (let i = 0; i < totalFlowers; i += 1) {
    const flower = createFlowerElement();

    const x = Math.floor(Math.random() * window.innerWidth);
    const y = Math.floor(Math.random() * window.innerHeight);
    const size = 12 + Math.floor(Math.random() * 18) + Math.floor(beatFactor * 8);
    const driftX = -60 + Math.floor(Math.random() * 120);
    const driftY = -140 - Math.floor(Math.random() * 140);

    flower.style.setProperty("--x", `${x}px`);
    flower.style.setProperty("--y", `${y}px`);
    flower.style.setProperty("--size", `${size}px`);
    flower.style.setProperty("--dx", `${driftX}px`);
    flower.style.setProperty("--dy", `${driftY}px`);

    document.body.appendChild(flower);
    setTimeout(() => flower.remove(), 2900);
  }
}

function startHoldReveal() {
  if (!holdProgress || !secretLine) {
    return;
  }

  if (secretRevealDone) {
    holdProgress.style.width = "100%";
    return;
  }

  clearInterval(holdTimer);
  holdStart = Date.now();
  holdProgress.style.width = "0%";

  holdTimer = setInterval(() => {
    const elapsed = Date.now() - holdStart;
    const pct = Math.min(100, (elapsed / 1800) * 100);
    holdProgress.style.width = `${pct}%`;

    if (pct >= 100) {
      clearInterval(holdTimer);
      holdTimer = null;
      runSecretTypewriter();
    }
  }, 60);
}

function cancelHoldReveal() {
  if (!holdProgress) {
    return;
  }
  if (holdTimer) {
    clearInterval(holdTimer);
    holdTimer = null;
  }
  if (holdProgress.style.width !== "100%") {
    holdProgress.style.width = "0%";
  }
}

function downloadKeepsake() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const title = `${getDisplayName()}, Thank You`;
  const message = getConfessionText();

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#fff8ee");
  gradient.addColorStop(1, "#ffe6f3");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#8e2f66";
  ctx.font = "bold 66px Georgia";
  ctx.fillText(title, 80, 150);

  ctx.fillStyle = "#5d3a7c";
  ctx.font = "36px Arial";
  const words = message.split(" ");
  const lines = [];
  let line = "";

  for (let i = 0; i < words.length; i += 1) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > 900) {
      lines.push(line);
      line = words[i];
    } else {
      line = test;
    }
  }
  lines.push(line);

  lines.slice(0, 14).forEach((ln, idx) => {
    ctx.fillText(ln, 80, 250 + (idx * 52));
  });

  ctx.fillStyle = "#b54f8f";
  ctx.font = "italic 32px Georgia";
  ctx.fillText(`Saved on ${new Date().toLocaleDateString()}`, 80, 1230);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "our-keepsake-card.png";
  link.click();
}

function buildPersonalizedShareLink() {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("name", state.herName);
  url.searchParams.set("nick", sweetNickname);
  return url.toString();
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
}

function setShareStatus(message) {
  if (!shareLinkStatus) {
    return;
  }

  shareLinkStatus.textContent = message;
  if (shareStatusTimer) {
    clearTimeout(shareStatusTimer);
    shareStatusTimer = null;
  }
  if (!message) {
    return;
  }

  shareStatusTimer = setTimeout(() => {
    shareLinkStatus.textContent = "";
    shareStatusTimer = null;
  }, 3400);
}

async function copyPersonalizedLink() {
  const shareUrl = buildPersonalizedShareLink();

  try {
    await copyText(shareUrl);
    setShareStatus("Personalized link copied.");
  } catch {
    setShareStatus("Could not copy automatically. Please copy from address bar.");
  }
}

introScreen.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  beginIntroTransition();
});

function startIntroHold() {
  if (!introSealProgress || introCompleted) {
    return;
  }

  primeMusicFromGesture();

  clearInterval(introHoldTimer);
  introHoldStart = Date.now();
  introSealProgress.style.width = "0%";
  if (introSealTrack) {
    introSealTrack.classList.add("is-holding");
  }

  introHoldTimer = setInterval(() => {
    const elapsed = Date.now() - introHoldStart;
    const pct = Math.min(100, (elapsed / INTRO_HOLD_MS) * 100);
    introSealProgress.style.width = `${pct}%`;

    if (pct >= 100) {
      clearInterval(introHoldTimer);
      introHoldTimer = null;
      introSealProgress.style.width = "100%";
      beginIntroTransition();
    }
  }, 40);
}

function cancelIntroHold() {
  if (introCompleted || !introSealProgress) {
    return;
  }
  if (introHoldTimer) {
    clearInterval(introHoldTimer);
    introHoldTimer = null;
  }
  if (introSealTrack) {
    introSealTrack.classList.remove("is-holding");
  }
  introSealProgress.style.width = "0%";
}

if (introSealBtn) {
  ["mousedown", "touchstart"].forEach((eventName) => {
    introSealBtn.addEventListener(eventName, startIntroHold);
  });
  ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((eventName) => {
    introSealBtn.addEventListener(eventName, cancelIntroHold);
  });
}

if (introCard) {
  introCard.addEventListener("pointermove", (event) => {
    const rect = introCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltY = (x - 0.5) * 5;
    const tiltX = (0.5 - y) * 5;
    introCard.style.setProperty("--tiltX", `${tiltX}deg`);
    introCard.style.setProperty("--tiltY", `${tiltY}deg`);
  });

  introCard.addEventListener("pointerleave", () => {
    introCard.style.setProperty("--tiltX", "0deg");
    introCard.style.setProperty("--tiltY", "0deg");
  });
}

bgMusic.addEventListener("error", () => {
  musicAvailable = false;
});

document.addEventListener("pointermove", (event) => {
  handleHeartTrail(event.clientX, event.clientY);
});

document.addEventListener("touchmove", (event) => {
  if (event.touches.length === 0) {
    return;
  }
  const touch = event.touches[0];
  handleHeartTrail(touch.clientX, touch.clientY);
}, { passive: true });

if (flowerBtn) {
  flowerBtn.addEventListener("click", spawnFlowerBurst);
}
if (nicknameToggle) {
  nicknameToggle.addEventListener("click", () => {
    useNickname = !useNickname;
    nicknameToggle.setAttribute("aria-pressed", String(useNickname));
    nicknameToggle.textContent = useNickname ? "Use Real Name" : "Use Sweet Nickname";
    renderContent();
    runTypewriter(getConfessionText());
  });
}
if (moodToggle) {
  moodToggle.addEventListener("click", () => {
    applyMood(mood === "day" ? "night" : "day");
  });
}
if (memoryPrev) {
  memoryPrev.addEventListener("click", () => {
    memoryIndex = (memoryIndex - 1 + memoryCards.length) % memoryCards.length;
    renderMemoryCard();
  });
}
if (memoryNext) {
  memoryNext.addEventListener("click", () => {
    memoryIndex = (memoryIndex + 1) % memoryCards.length;
    renderMemoryCard();
  });
}
if (surpriseBtn) {
  surpriseBtn.addEventListener("click", openModal);
}
if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeModal);
}
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}
if (holdRevealBtn) {
  ["mousedown", "touchstart"].forEach((eventName) => {
    holdRevealBtn.addEventListener(eventName, startHoldReveal);
  });
  ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((eventName) => {
    holdRevealBtn.addEventListener(eventName, cancelHoldReveal);
  });
}
if (saveKeepsakeBtn) {
  saveKeepsakeBtn.addEventListener("click", downloadKeepsake);
}
if (copyShareLinkBtn) {
  copyShareLinkBtn.addEventListener("click", copyPersonalizedLink);
}
if (finalVowBtn) {
  finalVowBtn.addEventListener("click", runFinalVowTypewriter);
}

if (letterNotes.length > 0) {
  letterNotes.forEach((note) => {
    const paragraph = note.querySelector("p");
    if (!paragraph) {
      return;
    }

    const fullText = paragraph.textContent.replace(/\s+/g, " ").trim();
    paragraph.dataset.fullText = fullText;
    paragraph.textContent = "";

    note.addEventListener("toggle", () => {
      const activeTimer = letterTypingTimers.get(paragraph);
      if (activeTimer) {
        clearTimeout(activeTimer);
        letterTypingTimers.delete(paragraph);
      }
      const openTimer = letterOpenTimers.get(paragraph);
      if (openTimer) {
        clearTimeout(openTimer);
        letterOpenTimers.delete(paragraph);
      }

      paragraph.classList.remove("typing-caret");

      if (note.open) {
        note.classList.remove("is-cracking");
        void note.offsetWidth;
        note.classList.add("is-cracking");

        const timer = setTimeout(() => {
          note.classList.remove("is-cracking");
          runLetterTypewriter(note);
          letterOpenTimers.delete(paragraph);
        }, 360);
        letterOpenTimers.set(paragraph, timer);
      } else {
        paragraph.textContent = "";
        note.classList.remove("is-cracking");
      }
    });
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

bgMusic.volume = DEFAULT_MUSIC_VOLUME;
bindGlobalAudioUnlock();
mainPage.classList.add("hidden");
introScreen.classList.remove("hidden");
closeModal();
applySeasonTheme();
applyUrlPersonalization();
renderContent();
renderDaysCounter();
renderMemoryCard();
renderDistanceCard();
scheduleDaysCounterRefresh();
startIntroTeaserRotation();
initSectionReveal();
startMoodParticles();

try {
  const savedMood = localStorage.getItem("confession-mood");
  applyMood(savedMood === "night" ? "night" : "day");
} catch {
  applyMood("day");
}

if (secretLine) {
  secretLine.textContent = "";
}
if (modalMessage) {
  modalMessage.textContent = "";
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    renderDaysCounter();
    scheduleDaysCounterRefresh();
  }
});

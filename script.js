const CONFIG = {
  version: "Minecraft Java Edition 26.2",
  serverName: "Valgharie",
  maxPlayers: 20,
  serverIp: "A_REMPLACER_PAR_IP_OU_DOMAINE_DU_SERVEUR",
  statusApi: "https://api.mcsrvstat.us/3/A_REMPLACER_PAR_IP_OU_DOMAINE_DU_SERVEUR",
  refreshSeconds: 15,
  defaultCredentials: { username: "2026", password: "2026" }
};

const defaultProfiles = [
  {
    "id": "arlexen",
    "name": "Arlexen",
    "username": "Arlexen",
    "password": "2026",
    "style": "minecraft",
    "avatar": "🧑",
    "online": false
  },
  {
    "id": "viewelvalghar",
    "name": "ViewelValghar",
    "username": "viewelvalghar",
    "password": "2026",
    "style": "minecraft",
    "avatar": "🧑‍🌾",
    "online": false
  },
  {
    "id": "routier87",
    "name": "Routier87",
    "username": "Routier87",
    "password": "200187",
    "style": "minecraft",
    "avatar": "👨‍🔧",
    "online": false
  },
  {
    "id": "ledocsensei",
    "name": "Le Doc Sensei",
    "username": "ledocsensei",
    "password": "2026",
    "style": "minecraft",
    "avatar": "👨‍💻",
    "online": false
  },
  {
    "id": "n3r0x",
    "name": "N3R0X",
    "username": "N3R0X",
    "password": "2026",
    "style": "minecraft",
    "avatar": "🧑‍🎨",
    "online": false
  }
];

const defaultChat = [
];

let profiles = JSON.parse(localStorage.getItem("valgharie_profiles") || "null") || structuredClone(defaultProfiles);
profiles = profiles.filter(p => ["Arlexen","ViewelValghar","Routier87","Le Doc Sensei","N3R0X"].includes(p.name));
defaultProfiles.forEach(dp => {
  if (!profiles.some(p => p.id === dp.id)) profiles.push(structuredClone(dp));
});

let factories = JSON.parse(localStorage.getItem("valgharie_factories") || "null") || structuredClone(defaultFactories);
let chat = JSON.parse(localStorage.getItem("valgharie_chat") || "null") || structuredClone(defaultChat);
let activeId = localStorage.getItem("valgharie_active") || "routier";
let factoryFilter = "mine";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const activeProfile = () => profiles.find(p => p.id === activeId) || profiles[0];

function save() {
  localStorage.setItem("valgharie_profiles", JSON.stringify(profiles));
  localStorage.setItem("valgharie_factories", JSON.stringify(factories));
  localStorage.setItem("valgharie_chat", JSON.stringify(chat));
  localStorage.setItem("valgharie_active", activeId);
}

function applyFont(style) {
  document.body.classList.remove("font-modern","font-classic","font-pixel");
  if (style === "modern") document.body.classList.add("font-modern");
  if (style === "classic") document.body.classList.add("font-classic");
  if (style === "pixel") document.body.classList.add("font-pixel");
}


function renderLoginProfiles() {
  const container = $("#loginProfiles");
  if (!container) return;

  container.innerHTML = profiles.map(p => `
    <button type="button" class="login-profile-card" data-login-profile="${p.id}">
      <div class="login-profile-avatar">${p.avatar}</div>
      <strong>${escapeHtml(p.name)}</strong>
      <span>● ${p.online ? "Connecté" : "Profil disponible"}</span>
      <small class="profile-connect">Connexion du profil</small>
    </button>
  `).join("");

  $$(".login-profile-card").forEach(card => {
    card.onclick = () => selectLoginProfile(card.dataset.loginProfile);
  });
}

function selectLoginProfile(id) {
  const p = profiles.find(x => x.id === id);
  if (!p) return;

  activeId = p.id;
  $$(".login-profile-card").forEach(card => {
    card.classList.toggle("selected", card.dataset.loginProfile === id);
  });

  $("#selectedProfileBox").classList.remove("hidden");
  $("#selectedProfileAvatar").textContent = p.avatar;
  $("#selectedProfileName").textContent = p.name;
  $("#loginUsername").value = "";
  $("#loginPassword").value = "";
  $("#loginUsername").focus();
  $("#loginError").textContent = "";
}

function loginProfile(username, password) {
  const p = profiles.find(x => x.id === activeId);
  if (!p) {
    $("#loginError").textContent = "Sélectionne d'abord un profil.";
    return false;
  }

  if (username === p.username && password === p.password) {
    localStorage.setItem("valgharie_session", p.id);
    p.online = true;
    save();
    unlockSite();
    return true;
  }

  $("#loginError").textContent = "Identifiant ou mot de passe incorrect.";
  return false;
}

function unlockSite() {
  $("#loginScreen")?.classList.add("hidden");
  document.body.classList.remove("locked");
  applyFont(activeProfile().style);
  renderAll();
  refreshServerStatus();
}

function lockSite() {
  localStorage.removeItem("valgharie_session");
  $("#loginScreen")?.classList.remove("hidden");
  document.body.classList.add("locked");
  renderLoginProfiles();
  const sessionId = localStorage.getItem("valgharie_session");
  if (sessionId) selectLoginProfile(sessionId);
}

function initLogin() {
  renderLoginProfiles();

  const sessionId = localStorage.getItem("valgharie_session");
  if (sessionId && profiles.some(p => p.id === sessionId)) {
    activeId = sessionId;
    unlockSite();
  } else {
    document.body.classList.add("locked");
    $("#loginScreen")?.classList.remove("hidden");
  }

  $("#loginForm").onsubmit = e => {
    e.preventDefault();
    loginProfile($("#loginUsername").value.trim(), $("#loginPassword").value);
  };

  $("#logoutBtn").onclick = () => {
    activeProfile().online = false;
    save();
    lockSite();
  };
}

function renderTopProfiles() {
  $("#topProfiles").innerHTML = profiles.map(p => `
    <div class="top-avatar" title="Ouvrir ${escapeHtml(p.name)}">
      <div class="avatar">${p.avatar}</div>
      ${escapeHtml(p.name)}
    </div>`).join("");
}

function renderProfileList() {
  $("#profileList").innerHTML = profiles.map(p => `
    <div class="profile-row ${p.id===activeId ? "active":""}" data-profile="${p.id}">
      <div class="avatar">${p.avatar}</div>
      <div class="profile-info">
        <strong>${escapeHtml(p.name)}</strong>
        <span class="${p.online ? "online" : "offline"}">● ${p.online ? "Connecté" : "Non connecté"}</span>
      </div>
      <span class="gear">⚙</span>
    </div>`).join("");
  $$(".profile-row").forEach(el => el.onclick = () => setActiveProfile(el.dataset.profile));
}

function renderProfileCard() {
  const p = activeProfile();
  $("#profileCard").innerHTML = `
    <div class="profile-main">
      <div class="big-avatar">${p.avatar}</div>
      <div>
        <h2>Profil : ${escapeHtml(p.name)}</h2>
        <div class="${p.online ? "online" : "offline"}">● ${p.online ? "Connecté au serveur" : "Non connecté au serveur"}</div>
        <div class="profile-meta">Identifiant : <b>${escapeHtml(p.username)}</b><br>Mot de passe : <b>${"•".repeat(Math.min(p.password.length, 8))}</b></div>
      </div>
    </div>
    <button class="outline-btn" style="width:auto" onclick="goTo('parametres')">✎ Modifier le profil</button>`;
}

function factoryCard(f) {
  return `<article class="factory-card">
    <div class="factory-image">${f.icon}</div>
    <div class="factory-body">
      <h3>${escapeHtml(f.name)}</h3>
      <p class="owner">♙ ${escapeHtml(f.owner)}</p>
      <p>${escapeHtml(f.resource)}</p>
      <p>${escapeHtml(f.coords)}</p>
    </div>
  </article>`;
}

function renderFactories() {
  const list = factoryFilter === "mine" ? factories.filter(f => f.owner === activeProfile().name) : factories;
  $("#factoryGrid").innerHTML = list.length ? list.map(factoryCard).join("") : `<div class="notice">Aucune usine trouvée pour ce profil.</div>`;
  $("#allFactoriesGrid").innerHTML = factories.map(factoryCard).join("");
}

function renderProfilesPage() {
  $("#profilesPageGrid").innerHTML = profiles.map(p => `
    <div class="profile-tile">
      <div class="big-avatar">${p.avatar}</div>
      <h3>${escapeHtml(p.name)}</h3>
      <div class="online">● Connecté</div>
      <p>Identifiant : ${escapeHtml(p.username)}</p>
      <p>Usines : ${factories.filter(f=>f.owner===p.name).length}</p>
      <button class="outline-btn" onclick="setActiveProfile('${p.id}');goTo('accueil')">Ouvrir le profil</button>
    </div>`).join("");
}

function renderChat(targetId) {
  const target = $(targetId);
  if (!target) return;
  target.innerHTML = chat.map(m => `
    <div class="chat-message">
      <div class="avatar">${(profiles.find(p=>p.name===m[0])||{avatar:"◉"}).avatar}</div>
      <div><strong>${escapeHtml(m[0])}</strong><small>Aujourd'hui</small><p>${escapeHtml(m[1])}</p></div>
    </div>`).join("");
  target.scrollTop = target.scrollHeight;
}

function renderChatAll() {
  renderChat("#chatMessages");
  renderChat("#chatMessagesLarge");
}

function populateSettings() {
  const p = activeProfile();
  $("#usernameInput").value = p.username;
  $("#passwordInput").value = p.password;
  $("#fontStyleSelect").value = p.style;
  $("#settingsProfileSelect").innerHTML = profiles.map(x=>`<option value="${x.id}" ${x.id===p.id?"selected":""}>${escapeHtml(x.name)}</option>`).join("");
  $("#settingsDisplayName").value = p.name;
  $("#settingsUsername").value = p.username;
  $("#settingsPassword").value = p.password;
  $("#settingsFont").value = p.style;
}

function setActiveProfile(id) {
  activeId = id;
  save();
  applyFont(activeProfile().style);
  renderAll();
}


async function refreshServerStatus() {
  if (!CONFIG.serverIp || CONFIG.serverIp.startsWith("A_REMPLACER")) {
    setServerStatus("Serveur non configuré", "offline");
    return;
  }

  try {
    const response = await fetch(CONFIG.statusApi, { cache: "no-store" });
    if (!response.ok) throw new Error("status");
    const data = await response.json();

    const onlinePlayers = data?.players?.list || [];
    const onlineNames = onlinePlayers.map(p => String(p).toLowerCase());

    profiles.forEach(p => {
      p.online = onlineNames.some(name =>
        name === p.name.toLowerCase() ||
        name.replace(/[^a-z0-9]/g, "") === p.name.toLowerCase().replace(/[^a-z0-9]/g, "")
      );
    });

    const count = data?.players?.online ?? onlinePlayers.length;
    $("#onlineCount").textContent = count;
    setServerStatus(data.online ? "Serveur en ligne" : "Serveur hors ligne", data.online ? "online" : "offline");
    renderProfileList();
    renderProfileCard();
  } catch (error) {
    setServerStatus("Statut indisponible", "offline");
    profiles.forEach(p => p.online = false);
    $("#onlineCount").textContent = "—";
    renderProfileList();
    renderProfileCard();
  }
}

function setServerStatus(text, state) {
  const el = $("#liveServerStatus");
  if (!el) return;
  el.className = `live-server-status ${state}`;
  el.innerHTML = `<span>●</span> ${escapeHtml(text)}`;
}

function renderAll() {
  renderTopProfiles();
  renderProfileList();
  renderProfileCard();
  renderFactories();
  renderProfilesPage();
  renderChatAll();
  populateSettings();
  $("#onlineCount").textContent = profiles.filter(p=>p.online).length;
}

function goTo(page) {
  $$(".page").forEach(p=>p.classList.remove("active"));
  $(`#page-${page}`).classList.add("active");
  $$(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.page===page));
  window.scrollTo({top:0, behavior:"smooth"});
}
window.goTo = goTo;

function addChatMessage(input) {
  const text = input.value.trim();
  if (!text) return;
  chat.push([activeProfile().name, text]);
  input.value = "";
  save();
  renderChatAll();
}

function openFactoryDialog() {
  $("#factoryDialog").showModal();
}
function openProfileDialog() {
  $("#profileDialog").showModal();
}

$("#saveSettingsBtn").onclick = () => {
  const p = activeProfile();
  p.username = $("#usernameInput").value.trim() || "2026";
  p.password = $("#passwordInput").value || "2026";
  p.style = $("#fontStyleSelect").value;
  save();
  applyFont(p.style);
  renderAll();
  $("#settingsMessage").textContent = "Profil mis à jour automatiquement.";
  setTimeout(()=>$("#settingsMessage").textContent="",2500);
};

$("#applyFullSettings").onclick = () => {
  const oldName = activeProfile().name;
  const p = activeProfile();
  p.name = $("#settingsDisplayName").value.trim() || oldName;
  p.username = $("#settingsUsername").value.trim() || "2026";
  p.password = $("#settingsPassword").value || "2026";
  p.style = $("#settingsFont").value;
  factories.forEach(f => { if (f.owner === oldName) f.owner = p.name; });
  save();
  applyFont(p.style);
  renderAll();
};

$("#settingsProfileSelect").onchange = e => setActiveProfile(e.target.value);
$("#fontStyleSelect").onchange = e => applyFont(e.target.value);

$("#newProfileBtn").onclick = openProfileDialog;
$("#newProfileBtn2").onclick = openProfileDialog;
$("#addFactoryBtn").onclick = openFactoryDialog;
$("#addFactoryBtn2").onclick = openFactoryDialog;

$("#saveFactory").onclick = e => {
  e.preventDefault();
  const f = {
    id: Date.now(),
    name: $("#factoryName").value.trim(),
    resource: $("#factoryResource").value.trim(),
    coords: $("#factoryCoords").value.trim() || "Coordonnées non renseignées",
    owner: activeProfile().name,
    icon: "▦"
  };
  if (!f.name || !f.resource) return;
  factories.push(f);
  save();
  $("#factoryForm").reset();
  $("#factoryDialog").close();
  renderAll();
};

$("#saveProfile").onclick = e => {
  e.preventDefault();
  const name = $("#newProfileName").value.trim();
  if (!name) return;
  const id = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-");
  if (profiles.some(p=>p.id===id)) return;
  profiles.push({
    id, name,
    username: $("#newProfileUsername").value.trim() || "2026",
    password: $("#newProfilePassword").value || "2026",
    style:"minecraft", avatar:"🧑", online:true
  });
  save();
  $("#profileForm").reset();
  $("#newProfileUsername").value = "2026";
  $("#newProfilePassword").value = "2026";
  $("#profileDialog").close();
  renderAll();
};

$("#chatForm").onsubmit = e => { e.preventDefault(); addChatMessage($("#chatInput")); };
$("#chatFormLarge").onsubmit = e => { e.preventDefault(); addChatMessage($("#chatInputLarge")); };

$$(".nav-btn").forEach(btn => btn.onclick = () => goTo(btn.dataset.page));
$$(".tab").forEach(btn => btn.onclick = () => {
  $$(".tab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  factoryFilter = btn.dataset.factoryFilter;
  renderFactories();
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

applyFont(activeProfile().style);
initLogin();
setInterval(refreshServerStatus, CONFIG.refreshSeconds * 1000);

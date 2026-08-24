


(function () {
  const user = Auth.requireAuth();
  if (!user) return;
  const data = Storage.getUserData(user.email);
  const stats = overallStats(data);


  const header = document.querySelector('[data-dynamic="profile-header"]');
  if (header) {
    header.querySelector(".avatar").textContent = user.name[0]?.toUpperCase() || "?";
    header.querySelector("h3").textContent = user.name;
    header.querySelector("p.small").textContent = user.email;
  }


  const nameInput = document.getElementById("pname");
  const emailInput = document.getElementById("pemail");
  if (nameInput) nameInput.value = user.name;
  if (emailInput) { emailInput.value = user.email; emailInput.disabled = true; }
  const saveBtn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.trim() === "Save changes");
  if (saveBtn) saveBtn.addEventListener("click", () => {
    const newName = (nameInput.value || "").trim();
    if (!newName) { Notify.showError("Name cannot be empty."); return; }
    const users = Storage.getUsers();
    users[user.email].name = newName;
    Storage.saveUsers(users);
    Notify.showSuccess("Profile updated.");
    if (header) header.querySelector("h3").textContent = newName;
  });


  const statCards = document.querySelectorAll('[data-dynamic="profile-stats"] .card h2');
  if (statCards.length) {
    statCards[0].textContent = stats.attempts;
    statCards[1].textContent = stats.attempts ? `${stats.accuracy}%` : "—";
  }


  const histBox = document.querySelector('[data-dynamic="attempt-history"]');
  if (histBox) {
    if (data.history.length) {
      const rows = [...data.history].reverse().slice(0, 8).map((a) => {
        const pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
        return `<a class="option" href="./result.html?attempt=${a.id}" style="display:flex;justify-content:space-between;text-decoration:none"><span>${a.subject} · Test ${a.testNumber}</span><b>${pct}%</b></a>`;
      }).join("");
      histBox.innerHTML = `<h3>Attempt history</h3><div class="stack" style="margin-top:14px">${rows}</div>`;
    }
  }

  const signOutBtn = Array.from(document.querySelectorAll(".btn")).find((b) => b.textContent.trim() === "Sign out");
  if (signOutBtn) signOutBtn.addEventListener("click", (e) => { e.preventDefault(); Auth.logout("./login.html"); });


  const main = document.querySelector("main.main");
  if (main) {
    const unlocked = new Set(data.achievements || []);
    const card = document.createElement("section");
    card.className = "card";
    card.style.marginTop = "22px";
    card.innerHTML = `
      <div class="row between small muted"><span>XP</span><b>${data.xp || 0}</b></div>
      <div class="row between small muted" style="margin-top:8px"><span>Current streak</span><b>${data.streak.current || 0} 🔥</b></div>
      <h3 style="margin-top:16px">Achievements</h3>
      <div class="row" style="flex-wrap:wrap;gap:10px;margin-top:12px">${ACHIEVEMENTS.map((a) =>
        `<span class="tag${unlocked.has(a.id) ? "" : ""}" style="${unlocked.has(a.id) ? "" : "opacity:.4"}">${a.icon} ${a.label}</span>`).join("")}</div>`;
    main.appendChild(card);
  }
})();

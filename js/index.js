(function () {
  const stats = document.querySelector('[data-dynamic="platform-stats"]');
  if (stats) {
    const users = Object.keys(Storage.getUsers()).length;
    const attempts = Storage.getAllUsersPublic().reduce((s, u) => s + u.attempts, 0);
    const nums = stats.querySelectorAll(".stat b");
    if (nums[0]) nums[0].textContent = attempts;
    if (nums[1]) nums[1].textContent = users;
    if (nums[2]) nums[2].textContent = SUBJECTS.length;
    if (nums[3]) nums[3].textContent = questionBankFromStorage().length;
  }

  const featured = document.querySelector('[data-dynamic="featured-quizzes"]');
  if (featured) {
    featured.innerHTML = SUBJECTS.map((s) => `
      <article class="card card-hover">
        <div class="icon-chip">${s.icon || "📚"}</div>
        <b>${s.name}</b>
        <p class="small">${s.desc}</p>
        <a class="btn btn-sm btn-ghost" style="margin-top:14px" href="./test-selection.html?subject=${encodeURIComponent(s.key)}">Start test</a>
      </article>`).join("");
  }
})();

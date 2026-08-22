
(function () {
  if (Auth.currentUser()) { window.location.href = "./index.html"; return; }
  const form = document.querySelector(".auth-card");
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");
  const submitBtn = Array.from(form.querySelectorAll("button")).find((b) => b.textContent.trim() === "Sign in");

  async function doLogin(e) {
    if (e) e.preventDefault();
    const ok = await Auth.login(emailInput.value, passInput.value);
    if (ok) setTimeout(() => { window.location.href = "./index.html"; }, 400);
  }
  form.addEventListener("submit", doLogin);
  if (submitBtn) submitBtn.addEventListener("click", doLogin);
})();

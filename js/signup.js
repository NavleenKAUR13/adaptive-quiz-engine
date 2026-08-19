
(function () {
  if (Auth.currentUser()) { window.location.href = "./index.html"; return; }
  const form = document.querySelector(".auth-card");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");
  const submitBtn = Array.from(form.querySelectorAll("button")).find((b) => b.textContent.trim() === "Create free account");

  async function doSignup(e) {
    if (e) e.preventDefault();
    const ok = await Auth.signup(nameInput.value, emailInput.value, passInput.value);
    if (ok) setTimeout(() => { window.location.href = "./login.html"; }, 700);
  }
  form.addEventListener("submit", doSignup);
  if (submitBtn) submitBtn.addEventListener("click", doSignup);
})();

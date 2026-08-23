

const Auth = (() => {
  function genSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function hashPassword(password, salt) {
    const enc = new TextEncoder().encode(salt + ":" + password);
    const digest = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  }

  function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  async function signup(name, email, password, confirm) {
    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();
    if (!name || !email || !password) { Notify.showError("Please fill in all fields."); return false; }
    if (!isValidEmail(email)) { Notify.showError("That email address doesn't look valid."); return false; }
    if (password.length < 6) { Notify.showError("Password must be at least 6 characters."); return false; }
    if (confirm !== undefined && confirm !== password) { Notify.showError("Passwords do not match."); return false; }

    const users = Storage.getUsers();
    if (users[email]) { Notify.showError("An account with this email already exists."); return false; }

    const salt = genSalt();
    const passHash = await hashPassword(password, salt);
    users[email] = { name, email, salt, passHash, createdAt: Date.now() };
    Storage.saveUsers(users);
    Storage.saveUserData(email, Storage.defaultUserData());
    // Per the required flow: Signup does NOT log the user in automatically.
    // They're sent to the Login page next.
    Notify.showSuccess(`Account created successfully. Please log in, ${name}.`);
    return true;
  }

  async function login(email, password) {
    email = (email || "").trim().toLowerCase();
    if (!email || !password) { Notify.showError("Please enter both email and password."); return false; }
    const users = Storage.getUsers();
    const user = users[email];
    if (!user) { Notify.showError("No account found with that email."); return false; }
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.passHash) { Notify.showError("Incorrect email or password."); return false; }
    Storage.setSession(email);
    Notify.showSuccess(`Welcome back, ${user.name}!`);
    return true;
  }

  function logout(redirect = "./login.html") {
    Notify.showConfirmation("You will be signed out of Quizzy on this device.", () => {
      Storage.clearSession();
      Notify.showInfo("You have been signed out.");
      setTimeout(() => { window.location.href = redirect; }, 500);
    }, { title: "Sign out?", confirmLabel: "Sign out" });
  }

  function currentUser() {
    const session = Storage.getSession();
    if (!session) return null;
    const users = Storage.getUsers();
    const user = users[session.email];
    return user ? { name: user.name, email: user.email } : null;
  }

  // Call at the top of any protected page.
  function requireAuth() {
    const user = currentUser();
    if (!user) {
      sessionStorage.setItem("quizzy_flash", "Please login to continue.");
      window.location.href = "./login.html";
      return null;
    }
    return user;
  }

  function consumeFlash() {
    const msg = sessionStorage.getItem("quizzy_flash");
    if (msg) { sessionStorage.removeItem("quizzy_flash"); Notify.showWarning(msg); }
  }

  return { signup, login, logout, currentUser, requireAuth, consumeFlash, isValidEmail };
})();

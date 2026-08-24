

const Storage = (() => {
  const K_USERS = "quizzy_users_v1";
  const K_SESSION = "quizzy_session_v1";
  const K_DATA_PREFIX = "quizzy_userdata_v1::";

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

 
  function getUsers() { return readJSON(K_USERS, {}); }
  function saveUsers(users) { writeJSON(K_USERS, users); }

  //  session (sessionStorage: cleared when the tab/browser closes,
  // survives a refresh, and logout only clears THIS — never localStorage)
  function readSessionJSON(key, fallback) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function getSession() { return readSessionJSON(K_SESSION, null); }
  function setSession(email) { sessionStorage.setItem(K_SESSION, JSON.stringify({ email, since: Date.now() })); }
  function clearSession() { sessionStorage.removeItem(K_SESSION); }

  // ---------- per-user data ----------
  function defaultUserData() {
    return {
      sm2: {},          // questionId -> {ef, reps, interval, nextReview, lastQuality, lastResult}
      history: [],       // list of attempts
      streak: { current: 0, best: 0, lastActivityDate: null },
      achievements: [],  // unlocked achievement ids
      xp: 0,
      subscribed: false,
    };
  }
  function getUserData(email) {
    return readJSON(K_DATA_PREFIX + email, defaultUserData());
  }
  function saveUserData(email, data) {
    writeJSON(K_DATA_PREFIX + email, data);
  }

  // leaderboard support: every registered user, public fields only
  function getAllUsersPublic() {
    const users = getUsers();
    return Object.values(users).map((u) => {
      const data = getUserData(u.email);
      const attempts = data.history.length;
      const totalQ = data.history.reduce((s, a) => s + a.total, 0);
      const totalCorrect = data.history.reduce((s, a) => s + a.score, 0);
      const accuracy = totalQ ? Math.round((totalCorrect / totalQ) * 100) : 0;
      const mastered = Object.values(data.sm2).filter((s) => s.reps >= 2 && s.ef >= 2.5).length;
      return {
        name: u.name, email: u.email, xp: data.xp || 0, attempts, accuracy,
        streak: data.streak.current || 0, mastered,
      };
    });
  }

  return {
    getUsers, saveUsers, getSession, setSession, clearSession,
    getUserData, saveUserData, defaultUserData, getAllUsersPublic,
  };
})();

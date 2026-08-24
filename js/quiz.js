

(function () {
  const params = new URLSearchParams(window.location.search);
  const subject = params.get("subject");
  const testNumber = Number(params.get("test") || 1);

  const user = Auth.requireAuth();
  if (!user) return;
  const data = Storage.getUserData(user.email);

  if (!subject || !SUBJECTS.some((s) => s.key === subject)) { window.location.href = "./subjects.html"; return; }
  if (testNumber >= 3 && !data.subscribed) {
    showPremiumModal(() => { window.location.href = `./test-selection.html?subject=${encodeURIComponent(subject)}`; });
    return;
  }

  const questions = selectQuestionsForSubject(subject, data.sm2);
  if (!questions.length) { window.location.href = "./test-selection.html?subject=" + encodeURIComponent(subject); return; }

  const N = questions.length;
  const answers = questions.map(() => null); // null until locked: {chosen, correct, timeSec}
  let index = 0;
  let viewIndex = 0;
  const startedAt = Date.now();
  let qStart = Date.now();
  let totalInterval = null;
  let qInterval = null;

  function qText(root, prefix) {
    return root ? Array.from(root.querySelectorAll("button, a")).find((el) => el.textContent.trim().startsWith(prefix)) : null;
  }

  const totalTimerEl = document.querySelector('[data-dynamic="total-timer"]');
  const qTimerEl = document.querySelector('[data-dynamic="q-timer"]');
  const idxEl = document.querySelector('[data-dynamic="question-index"]');
  const catEl = document.querySelector('[data-dynamic="difficulty"]');
  const progressFill = document.querySelector(".progress > i");
  const qTextEl = document.querySelector('[data-dynamic="question-text"]');
  const optionsEl = document.querySelector('[data-dynamic="options"]');
  const paletteEl = document.querySelector('[data-dynamic="question-palette"]');
  const summaryEl = document.querySelector('[data-dynamic="attempt-summary"]');
  const cardEl = qTextEl ? qTextEl.closest(".card") : null;
  const bottomRow = cardEl ? cardEl.querySelector(".row.between:last-of-type") : null;
  const prevBtn = qText(bottomRow, "← Previous");
  const markBtn = qText(bottomRow, "Mark for review");
  const nextBtn = qText(bottomRow, "Next");
  const exitLink = qText(document.querySelector("header.nav"), "Exit");
  const submitBtn = qText(summaryEl, "Submit test");

  if (markBtn) markBtn.style.display = "none"; // not part of the reference flow
  if (submitBtn) submitBtn.style.display = "none"; // submission happens via Next on the last question, as in the reference

  function fmtTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // ---------- total timer: counts UP only, no overall limit (matches reference) ----------
  function startTotalTimer() {
    totalInterval = setInterval(() => {
      const s = Math.floor((Date.now() - startedAt) / 1000);
      if (totalTimerEl) totalTimerEl.textContent = `⏱ Total ${fmtTime(s)}`;
    }, 250);
  }

  // ---------- per-question countdown: 30s, locks answer at 0 ----------
  function startQuestionTimer() {
    clearInterval(qInterval);
    qStart = Date.now();
    let remaining = Q_SECONDS;
    if (qTimerEl) { qTimerEl.textContent = `● ${remaining}s`; qTimerEl.classList.remove("rose"); qTimerEl.classList.add("lemon"); }
    qInterval = setInterval(() => {
      remaining -= 1;
      if (qTimerEl) qTimerEl.textContent = `● ${Math.max(remaining, 0)}s`;
      if (remaining <= 10 && qTimerEl) { qTimerEl.classList.remove("lemon"); qTimerEl.classList.add("rose"); }
      if (remaining <= 0) {
        clearInterval(qInterval);
        lockAnswer(null);
      }
    }, 1000);
  }

  // ---------- render ----------
  function render() {
    viewIndex = index;
    const q = questions[viewIndex];
    if (idxEl) idxEl.innerHTML = `Question <b>${viewIndex + 1}</b> of <b>${N}</b>`;
    if (catEl) catEl.textContent = q.cat;
    if (progressFill) progressFill.style.width = `${Math.round((viewIndex / N) * 100)}%`;
    if (qTextEl) qTextEl.textContent = q.q;

    renderOptions(viewIndex, true);
    renderPalette();
    if (prevBtn) prevBtn.disabled = viewIndex === 0;
    if (nextBtn) {
      nextBtn.textContent = viewIndex === N - 1 ? "Submit Test →" : "Next Question →";
      nextBtn.disabled = answers[viewIndex] === null;
    }
    startQuestionTimer();
  }

  // view an already-answered question (read-only, no timer)
  function viewAnswered(i) {
    clearInterval(qInterval);
    viewIndex = i;
    const q = questions[i];
    if (idxEl) idxEl.innerHTML = `Question <b>${i + 1}</b> of <b>${N}</b>`;
    if (catEl) catEl.textContent = q.cat;
    if (progressFill) progressFill.style.width = `${Math.round(((index) / N) * 100)}%`;
    if (qTextEl) qTextEl.textContent = q.q;
    renderOptions(i, false);
    renderPalette();
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) { nextBtn.textContent = "Next Question →"; nextBtn.disabled = false; }
  }

  function renderOptions(i, live) {
    const q = questions[i];
    const a = answers[i];
    if (!optionsEl) return;
    optionsEl.innerHTML = "";
    const keys = ["A", "B", "C", "D"];
    q.options.forEach((opt, k) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      const keySpan = document.createElement("span");
      keySpan.className = "key";
      keySpan.textContent = keys[k];
      btn.appendChild(keySpan);
      btn.appendChild(document.createTextNode(" " + opt));
      if (a) {
        btn.disabled = true;
        if (k === q.correct) btn.classList.add("correct");
        if (k === a.chosen && a.chosen !== q.correct) btn.classList.add("incorrect");
        if (k === a.chosen) btn.classList.add("selected");
      } else if (live) {
        btn.addEventListener("click", () => lockAnswer(k));
      } else {
        btn.disabled = true;
      }
      optionsEl.appendChild(btn);
    });
  }

  function renderPalette() {
    if (!paletteEl) return;
    paletteEl.innerHTML = "";
    questions.forEach((q, i) => {
      const dot = document.createElement("span");
      dot.textContent = i + 1;
      dot.style.cursor = i <= index ? "pointer" : "default";
      let bg = "";
      if (i === viewIndex) bg = "outline:2px solid var(--primary);outline-offset:2px;";
      if (answers[i]) bg += answers[i].correct ? "background:var(--mint);color:var(--correct-text);" : "background:var(--accent-soft);color:var(--incorrect-text);";
      else if (i === index) bg += "background:var(--sky);";
      dot.style.cssText += bg;
      if (i <= index) dot.addEventListener("click", () => { answers[i] ? viewAnswered(i) : render(); });
      paletteEl.appendChild(dot);
    });
  }

  function renderSummary() {
    if (!summaryEl) return;
    const answered = answers.filter((a) => a !== null).length;
    const correct = answers.filter((a) => a && a.correct).length;
    const rows = summaryEl.querySelectorAll(".row.between");
    if (rows[0]) rows[0].querySelector("b").textContent = answered;
    if (rows[1]) rows[1].querySelector("b").textContent = correct;
    if (rows[2]) rows[2].querySelector("b").textContent = N - answered;
  }

  //  lock + reveal (identical grading to the reference)
  function lockAnswer(chosenIndex) {
    clearInterval(qInterval);
    const q = questions[index];
    const timeSec = Math.min(Q_SECONDS, Math.round((Date.now() - qStart) / 1000));
    const isCorrect = chosenIndex === q.correct;
    answers[index] = { chosen: chosenIndex, correct: isCorrect, timeSec };
    renderOptions(index, false);
    renderPalette();
    renderSummary();
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.textContent = index === N - 1 ? "Submit Test →" : "Next Question →";
    }
  }

  if (nextBtn) nextBtn.addEventListener("click", () => {
    if (viewIndex !== index) { render(); return; } // was viewing a past question — return to the live one
    if (answers[index] === null) return;
    if (index < N - 1) { index += 1; render(); }
    else submitTest();
  });
  if (prevBtn) prevBtn.addEventListener("click", () => { if (viewIndex > 0) viewAnswered(viewIndex - 1); });
  if (exitLink) exitLink.addEventListener("click", (e) => {
    e.preventDefault();
    Notify.showConfirmation("Your progress in this attempt will be lost. Are you sure you want to leave?", () => {
      window.location.href = exitLink.getAttribute("href");
    }, { title: "Leave test?", confirmLabel: "Leave" });
  });

  // ---------- submit (identical SM-2 update + history entry to the reference) ----------
  function submitTest() {
    clearInterval(qInterval);
    clearInterval(totalInterval);

    const totalSec = Math.round((Date.now() - startedAt) / 1000);
    const score = answers.filter((a) => a.correct).length;

    answers.forEach((a, i) => {
      const q = questions[i];
      let quality;
      if (a.correct) quality = a.timeSec <= 10 ? 5 : (a.timeSec <= 20 ? 4 : 3);
      else quality = a.chosen === null ? 0 : 1;
      data.sm2[q.id] = sm2Update(data.sm2[q.id], quality);
    });

    const snapshotQuestions = questions.map((q) => ({ id: q.id, cat: q.cat, q: q.q, options: q.options, correct: q.correct, explain: q.explain }));
    const attempt = {
      id: "att_" + Date.now(),
      date: Date.now(),
      subject,
      testNumber,
      score, total: N, timeSec: totalSec,
      questions: snapshotQuestions,
      answers,
    };
    data.history.push(attempt);
    data.xp = (data.xp || 0) + score * 10;
    registerActivity(data);
    const unlocked = evaluateAchievements(data);
    Storage.saveUserData(user.email, data);

    unlocked.forEach((a2) => Notify.showSuccess(`Achievement unlocked: ${a2.icon} ${a2.label}`));
    Notify.showSuccess("✓ Test submitted successfully.");
    setTimeout(() => { window.location.href = `./result.html?attempt=${attempt.id}`; }, 500);
  }

  startTotalTimer();
  render();
})();

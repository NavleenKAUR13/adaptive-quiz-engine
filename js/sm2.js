

const TEST_SIZE = 6;                 
const Q_SECONDS = 30;                
const DAY_MS = 24 * 60 * 60 * 1000;  

//  SM-2 update (identical formula to the reference implementation) 
function sm2Update(prev, quality) {
  const s = prev || { ef: 2.5, reps: 0, interval: 0 };
  let ef = s.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  let reps = s.reps;
  let interval = s.interval;

  if (quality < 3) {
    reps = 0;
    interval = 1; // wrong answers come back next attempt
  } else {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.round(interval * ef);
    reps += 1;
  }

  const lastResult = quality < 3 ? "wrong" : "right";
  const nextReview = quality < 3 ? Date.now() : Date.now() + interval * DAY_MS;

  return { ef: Number(ef.toFixed(2)), reps, interval, nextReview, lastResult, lastReviewed: Date.now() };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

//  selectQuestions

function selectQuestionsForSubject(subject, sm2State) {
  const pool = questionsForSubject(subject);
  const now = Date.now();

  const due = [];
  const fresh = [];
  const rest = [];

  pool.forEach((q) => {
    const s = sm2State[q.id];
    if (!s) fresh.push(q);
    else if (s.nextReview <= now) due.push(q);
    else rest.push(q);
  });

  const picked = [...shuffle(due), ...shuffle(fresh), ...shuffle(rest)];
  return picked.slice(0, TEST_SIZE);
}

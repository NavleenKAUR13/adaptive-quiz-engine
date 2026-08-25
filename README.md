# Quizzy – Adaptive Quiz Engine with Spaced Repetition

An interactive quiz platform that helps users practice multiple subjects, track their performance, and improve their learning through an adaptive **SM-2 spaced repetition system**.

## 1. Key Features

* User Signup, Login, Logout & Protected Pages
* Multiple Subjects
* 30-Second Timer for Each Question
* Adaptive Question Selection Using the SM-2 Algorithm
* Dashboard with Accuracy, Progress, Mastery & Review Tracking
* XP, Streaks & Achievement Badges
* Detailed Result and Question-by-Question Answer Review
* Leaderboard Based on XP and Accuracy
* Light & Dark Mode
* Sequential Test Unlocking & Premium Test 3 UI

---

## 2. Technology Stack

* Frontend: HTML, CSS & JavaScript (ES6+)
* Storage: LocalStorage & SessionStorage
*  Security: Web Crypto API with SHA-256 Password Hashing
* Algorithm: SM-2 Spaced Repetition Algorithm
* Deployment: Netlify

---

## 3. SM-2 Spaced Repetition Model

The SM-2 model makes the quiz adaptive by remembering how well the user performs on each question.

* Incorrect questions are scheduled for earlier revision
* New questions are selected after due questions
* Correct and quickly answered questions get longer review intervals
* Tracks Ease Factor, Repetitions, Interval & Next Review Date

This helps users focus more on questions they find difficult.

---

## 4. How It Works

The user selects a subject and attempts a quiz containing questions. Each question has a 30-second timer.

After the quiz, the application calculates the score, updates XP, streaks, achievements, progress, and the SM-2 review schedule.

Incorrect questions are prioritized in future attempts.

---

## 5. Future Scope

* Backend and Database Integration
* Real Global Leaderboard
* Cross-Device Data Synchronization
* Real Payment Gateway for Premium Tests
* More Subjects and Questions
* Advanced Performance Analytics
* AI-Powered Question Generation
* Personalized Learning Recommendations

---

## Contributors

* Navleen Kaur
* Nitin Singh
* Neyati

## Deployment Link

https://quizliify.netlify.app/

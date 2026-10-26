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
* **Teacher Dashboard with Question Management (CRUD)**
* **Add, View, Edit, and Deactivate Questions**
* **MongoDB Database Integration for Persistent Data Storage**
* **Backend API Integration Using Node.js and Express.js**
* **JWT-Based Authentication and Role-Based Access Control**
* **Password Hashing Using bcrypt**
* **Question Import via CSV and JSON**
* **Teacher Analytics and Quiz Performance Tracking**

## 2. Technology Stack

* **Frontend:** HTML, CSS & JavaScript (ES6+)
* **Backend:** Node.js & Express.js
* **Database:** MongoDB Atlas
* **Authentication:** JSON Web Tokens (JWT) and bcrypt
* **Storage:** LocalStorage & SessionStorage
* **Security:** Protected API Routes and Role-Based Access Control
* **Algorithm:** SM-2 Spaced Repetition Algorithm
* **Deployment:** Netlify (Frontend)

## 3. SM-2 Spaced Repetition Model

The SM-2 model makes the quiz adaptive by remembering how well the user performs on each question.

* Incorrect questions are scheduled for earlier revision.
* New questions are selected after due questions.
* Correct and quickly answered questions get longer review intervals.
* Tracks Ease Factor, Repetitions, Interval, and Next Review Date.
* Prioritizes difficult questions for revision.

This helps users focus more on questions they find difficult.

## 4. Teacher Dashboard and CRUD Operations

The teacher dashboard allows authorized teachers to manage the quiz question bank.

* **Create:** Add new questions with their options, correct answers, subjects, and related details.
* **Read:** View and access questions stored in the database.
* **Update:** Edit existing questions when corrections or changes are needed.
* **Delete/Deactivate:** Deactivate questions to prevent them from appearing in quizzes while retaining their database records.

Additional teacher features include CSV/JSON question import and quiz performance analytics.

## 5. MongoDB Database Integration

Quizzy uses **MongoDB Atlas** to store application data persistently.

The backend communicates with MongoDB through Node.js and Express.js APIs.

Key database collections include:

* **Users:** Stores user accounts, password hashes, and role information.
* **Questions:** Stores quiz questions, answer options, correct answers, and subject details.
* **Attempt** Logs: Records quiz attempts and performance information.

The backend supports authentication, question management, and quiz-related operations. JWT authentication and role-based authorization help ensure that only authorized teachers can access teacher-specific APIs.

## 6. How It Works

1. Users sign up or log in to the platform.
2. Users select a subject and attempt a quiz with a 30-second timer for each question.
3. The application evaluates answers and calculates the quiz results.
4. XP, streaks, achievements, progress, and the SM-2 review schedule are updated.
5. Incorrect questions are prioritized for future revision.
6. Teachers manage the question bank through the protected teacher dashboard.
7. Question and user-related data is stored in MongoDB Atlas through the backend APIs.

## 7. Future Scope

* Real Global Leaderboard
* Cross-Device Data Synchronization
* Real Payment Gateway for Premium Tests
* More Subjects and Questions
* Advanced Performance Analytics
* AI-Powered Question Generation
* Personalized Learning Recommendations

## Contributors

* Navleen Kaur
* Nitin Singh
* Neyati

## Deployment Link

https://quizzy009.netlify.app/

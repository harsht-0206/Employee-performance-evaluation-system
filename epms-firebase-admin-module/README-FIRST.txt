EMPLOYEE PERFORMANCE MANAGEMENT SYSTEM — FIREBASE ADMIN MODULE
=============================================================

This package adds a secure admin login and employee-record management module.
It does not automatically redesign or replace your existing index.html dashboard.

FILES
-----
login.html          Sign-in page
admin.html          Admin interface
admin.js            Admin UI and Firestore operations
firebase-config.js  Firebase web configuration (replace placeholders)
firestore.rules     Firestore security rules to publish in Firebase Console

BEFORE UPLOADING
----------------
1. Create a Firebase project.
2. Register a Web App and copy its config into firebase-config.js.
3. Enable Authentication > Sign-in method > Email/Password.
4. Create a Firestore database.
5. Publish firestore.rules from Firebase Console > Firestore Database > Rules.
6. In Authentication > Settings > Authorized domains, add:
   harsht-0206.github.io
   (Add your own domain too if the site uses a different one.)
7. In Authentication > Users, create your own admin account using Add user.
8. Copy that account's UID.
9. In Firestore Data, create a collection named users.
10. Add a document whose document ID is EXACTLY the admin account's UID.
    Add a string field: role = admin
    Optional field: email = your admin email
11. Do not let users choose their own role from a public registration form.

UPLOAD USING GITHUB WEBSITE
---------------------------
1. Open your existing repository:
   https://github.com/harsht-0206/Employee-Performance-Management-System
2. Click Add file > Upload files.
3. Extract this ZIP on your computer first.
4. Upload the five files above into the repository root (the same level as index.html).
5. Commit changes.
6. Wait for GitHub Pages to deploy.
7. Open:
   https://harsht-0206.github.io/Employee-Performance-Management-System/login.html

CONNECT YOUR EXISTING DASHBOARD
-------------------------------
Add a link or button in your existing index.html:
<a href="./login.html">Admin sign in</a>
You can style it to match the current dashboard. The link is not a security boundary;
Firestore rules enforce the actual permissions.

SECURITY NOTES
--------------
- Never upload Firebase service-account JSON files or private server keys.
- A Firebase web API key is expected to be visible in the browser; secure access with
  Authentication, Firestore rules, and Firebase project restrictions.
- The provided first version allows admins to manage employee records, but does not
  create Authentication accounts for employees or implement performance reviews/goals.
- Do not store sensitive employee HR data until you have reviewed access requirements,
  privacy obligations, backups, and security rules.
- For a real company system, use an appropriately designed employee/manager access model,
  audit logging, and stronger operational controls.

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  collection, addDoc, getDocs, deleteDoc, doc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const employeeForm = document.getElementById("employeeForm");
const employeeRows = document.getElementById("employeeRows");
const formMessage = document.getElementById("formMessage");
const listMessage = document.getElementById("listMessage");
const addButton = document.getElementById("addButton");
const signedInLabel = document.getElementById("signedInLabel");
let accessGranted = false;

function showMessage(element, text) { element.textContent = text; }

async function isAdmin(user) {
  const profile = await getDoc(doc(db, "users", user.uid));
  return profile.exists() && profile.data().role === "admin";
}

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.replace("./login.html");
    return;
  }
  try {
    accessGranted = await isAdmin(user);
    if (!accessGranted) {
      await signOut(auth);
      location.replace("./login.html");
      return;
    }
    signedInLabel.textContent = user.email + " · Admin";
    await loadEmployees();
  } catch (error) {
    accessGranted = false;
    showMessage(listMessage, "Could not verify admin access. Check Firebase config and Firestore rules.");
  }
});

employeeForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!accessGranted || !auth.currentUser) return;
  addButton.disabled = true;
  showMessage(formMessage, "Saving employee…");
  const employee = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    department: document.getElementById("department").value.trim(),
    jobTitle: document.getElementById("jobTitle").value.trim(),
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser.uid
  };
  try {
    if (!employee.name || !employee.email || !employee.department || !employee.jobTitle) {
      throw new Error("Fill in all fields.");
    }
    await addDoc(collection(db, "employees"), employee);
    employeeForm.reset();
    showMessage(formMessage, "Employee saved successfully.");
    await loadEmployees();
  } catch (error) {
    showMessage(formMessage, "Could not save employee. Check required fields, Firestore rules and Firebase setup.");
  } finally {
    addButton.disabled = false;
  }
});

async function loadEmployees() {
  if (!accessGranted) return;
  showMessage(listMessage, "Loading employee records…");
  employeeRows.replaceChildren();
  try {
    const snapshot = await getDocs(collection(db, "employees"));
    if (snapshot.empty) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No employees yet. Use the form above to add one.";
      row.appendChild(cell);
      employeeRows.appendChild(row);
    }
    snapshot.forEach(employeeDoc => {
      const data = employeeDoc.data();
      const row = document.createElement("tr");
      [data.name, data.email, data.department, data.jobTitle].forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value || "";
        row.appendChild(cell);
      });
      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "danger";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        if (!accessGranted || !auth.currentUser) return;
        if (!confirm("Delete this employee record? This cannot be undone.")) return;
        deleteButton.disabled = true;
        try {
          await deleteDoc(doc(db, "employees", employeeDoc.id));
          await loadEmployees();
        } catch (error) {
          showMessage(listMessage, "Delete failed. Check Firestore security rules.");
          deleteButton.disabled = false;
        }
      });
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);
      employeeRows.appendChild(row);
    });
    showMessage(listMessage, "Showing " + snapshot.size + " employee record(s).");
  } catch (error) {
    showMessage(listMessage, "Could not load employees. Verify that Firestore is created and the security rules are published.");
  }
}

document.getElementById("refreshButton").addEventListener("click", loadEmployees);
document.getElementById("logoutButton").addEventListener("click", async () => {
  await signOut(auth);
  location.replace("./login.html");
});

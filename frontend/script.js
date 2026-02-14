const API = "http://localhost:5000/api/auth";
const TASK_API = "http://localhost:5000/api/tasks";

/* ================= UI SWITCH ================= */

function showLogin() {
  document.getElementById("signupBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
}

function showSignup() {
  document.getElementById("signupBox").style.display = "block";
  document.getElementById("loginBox").style.display = "none";
}

function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
}

/* ================= SIGNUP ================= */

async function signup() {
  const data = {
    firstName: document.getElementById("signupFirstName").value,
    lastName: document.getElementById("signupLastName").value,
    email: document.getElementById("signupEmail").value,
    mobile: document.getElementById("signupMobile").value,
    password: document.getElementById("signupPassword").value
  };

  const res = await fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (res.ok) {
    showToast(result.message, "success");
    showLogin();
  } else {
    showToast(result.message, "error");
  }
}

/* ================= LOGIN ================= */

async function login() {

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok && data.token) {

    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.fullName);

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("taskSection").style.display = "block";
    document.getElementById("header").style.display = "block";

    document.getElementById("welcomeUser").innerText =
      "Welcome, " + data.fullName;

    showToast("Login Successful 🎉", "success");

    loadTasks();   // 🔥 Load tasks after login

  } else {
    showToast(data.message || "Login failed", "error");
  }
}

/* ================= ADD TASK ================= */

async function addTask() {

  const text = document.getElementById("taskInput").value;
  const token = localStorage.getItem("token");

  if (!text) {
    showToast("Enter task first", "error");
    return;
  }

  const res = await fetch(TASK_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ text })
  });

  const data = await res.json();

  if (res.ok) {
    showToast("Task added", "success");
    document.getElementById("taskInput").value = "";
    loadTasks();
  } else {
    showToast(data.message || "Error adding task", "error");
  }
}

/* ================= LOAD TASKS ================= */

async function loadTasks() {

  const token = localStorage.getItem("token");

  const res = await fetch(TASK_API, {
    headers: {
      "Authorization": token
    }
  });

  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${task.text}
      <button onclick="deleteTask('${task._id}')">❌</button>
    `;
    list.appendChild(li);
  });
}

/* ================= DELETE TASK ================= */

async function deleteTask(id) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${TASK_API}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": token
    }
  });

  const data = await res.json();

  if (res.ok) {
    showToast("Task deleted", "success");
    loadTasks();
  } else {
    showToast(data.message || "Error deleting", "error");
  }
}

/* ================= CHANGE MOBILE ================= */

async function showUpdateMobile() {
  const newMobile = prompt("Enter New Mobile Number:");
  if (!newMobile) return;

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/update-mobile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ mobile: newMobile })
  });

  const data = await res.json();

  if (res.ok) {
    showToast(data.message, "success");
  } else {
    showToast(data.message, "error");
  }
}

/* ================= CHANGE PASSWORD ================= */

async function showUpdatePassword() {

  const oldPassword = prompt("Enter Old Password:");
  const newPassword = prompt("Enter New Password:");

  if (!oldPassword || !newPassword) return;

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ oldPassword, newPassword })
  });

  const data = await res.json();

  if (res.ok) {
    showToast(data.message, "success");
  } else {
    showToast(data.message, "error");
  }
}

/* ================= LOGOUT ================= */

function logout() {
  localStorage.clear();
  location.reload();
}

/* ================= TOAST ================= */

function showToast(message, type = "success") {

  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = "toast " + type;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

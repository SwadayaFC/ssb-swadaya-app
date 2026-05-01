async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(API + "?action=login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.status === "success") {
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "dashboard.html";
  } else {
    alert("Login gagal");
  }
}

function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

function requireAuth() {
  const user = getUser();
  if (!user) window.location.href = "login.html";
  return user;
}
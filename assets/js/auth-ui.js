(function () {
  const API_BASE = "http://localhost:8787/api";
  const AUTH_STORAGE_KEY = "antenna_shop_auth_v1";

  function saveSession(payload) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  function readSession() {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function clearSession() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (_) {}
  }

  function setMessage(node, type, text) {
    if (!node) return;
    node.textContent = text || "";
    node.className = "auth__message";
    if (!text) return;
    node.classList.add("is-visible", type === "success" ? "is-success" : "is-error");
  }

  async function request(path, body, token) {
    const response = await fetch(API_BASE + path, {
      method: body ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      throw new Error(data && data.error ? data.error : "Ошибка запроса.");
    }
    return data;
  }

  function setupScrollTargets() {
    document.querySelectorAll("[data-scroll-target]").forEach(function (button) {
      button.addEventListener("click", function () {
        var target = document.querySelector(button.getAttribute("data-scroll-target"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  window.AntennaAuth = {
    apiBase: API_BASE,
    readSession: readSession,
    clearSession: clearSession,
    request: request,
  };

  function setupLoginPage() {
    var loginForm = document.getElementById("login-form");
    var registerForm = document.getElementById("register-form");
    if (!loginForm || !registerForm) return;

    var loginMessage = document.getElementById("login-message");
    var registerMessage = document.getElementById("register-message");
    var activeSession = readSession();

    if (activeSession && activeSession.token) {
      window.location.href = "my-account.html";
      return;
    }

    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      setMessage(loginMessage, "", "");
      var button = document.getElementById("login-submit");
      button.disabled = true;

      try {
        var result = await request("/auth/login", {
          email: document.getElementById("login-email").value.trim(),
          password: document.getElementById("login-password").value,
        });
        saveSession(result);
        setMessage(loginMessage, "success", "Вход выполнен. Перенаправляю в кабинет...");
        window.setTimeout(function () {
          window.location.href = "my-account.html";
        }, 500);
      } catch (error) {
        setMessage(loginMessage, "error", error.message);
      } finally {
        button.disabled = false;
      }
    });

    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      setMessage(registerMessage, "", "");
      var button = document.getElementById("register-submit");
      button.disabled = true;

      try {
        if (!registerForm.querySelector("input[name='terms']").checked) {
          throw new Error("Подтвердите согласие с условиями использования.");
        }
        var result = await request("/auth/register", {
          name: document.getElementById("register-name").value.trim(),
          email: document.getElementById("register-email").value.trim(),
          password: document.getElementById("register-password").value,
          passwordConfirm: document.getElementById("register-password-confirm").value,
        });
        saveSession(result);
        setMessage(registerMessage, "success", "Аккаунт создан. Перенаправляю в кабинет...");
        window.setTimeout(function () {
          window.location.href = "my-account.html";
        }, 500);
      } catch (error) {
        setMessage(registerMessage, "error", error.message);
      } finally {
        button.disabled = false;
      }
    });
  }

  function setupAccountPage() {
    var welcome = document.querySelector(".cabinet__welcome");
    if (!welcome) return;

    var session = readSession();
    if (!session || !session.token) {
      window.location.href = "login.html";
      return;
    }

    request("/auth/me", null, session.token)
      .then(function (result) {
        var user = result.user || session.user || {};
        var name = user.fullName || user.firstName || user.email || "Пользователь";
        welcome.textContent = "Здравствуйте, " + name + ". Управляйте заказами и адресом доставки в одном месте.";

        var nameNode = document.getElementById("account-profile-name");
        if (nameNode) nameNode.textContent = name;

        var phoneNode = document.getElementById("account-profile-phone");
        if (phoneNode) phoneNode.textContent = user.phone || "Не указан";
      })
      .catch(function () {
        clearSession();
        window.location.href = "login.html";
      });

    document.querySelectorAll("[data-auth-logout]").forEach(function (node) {
      node.addEventListener("click", function (event) {
        event.preventDefault();
        clearSession();
        window.location.href = "login.html";
      });
    });
  }

  setupScrollTargets();
  setupLoginPage();
  setupAccountPage();
})();

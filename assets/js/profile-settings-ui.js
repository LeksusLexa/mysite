(function () {
  function auth() {
    return window.AntennaAuth || null;
  }

  function updateStoredSession(profile) {
    var helper = auth();
    if (!helper || !profile) return;
    var session = helper.readSession();
    if (!session) return;
    session.user = Object.assign({}, session.user || {}, {
      email: profile.email || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      fullName: profile.name || profile.email || "Пользователь",
    });
    try {
      localStorage.setItem("antenna_shop_auth_v1", JSON.stringify(session));
    } catch (_) {}
  }

  async function request(path, options) {
    var helper = auth();
    if (!helper) throw new Error("Auth helper is unavailable.");
    var session = helper.readSession();
    if (!session || !session.token) {
      window.location.href = "login.html";
      throw new Error("Не выполнен вход.");
    }
    return helper.request(path, options && options.body ? options.body : null, session.token, options && options.method);
  }

  function setupProfileSettingsPage() {
    var form = document.getElementById("profileSettingsForm");
    var notice = document.getElementById("profileSaveNotice");
    if (!form || !notice) return;

    var welcome = document.querySelector(".cabinet__welcome");

    function applyData(data) {
      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name || !(field.name in data)) return;
        if (field.type === "checkbox") {
          field.checked = Boolean(data[field.name]);
          return;
        }
        field.value = data[field.name] == null ? "" : data[field.name];
      });

      if (welcome && data.name) {
        welcome.textContent = "Управляйте личными данными и параметрами уведомлений вашего профиля.";
      }
    }

    function readFormData() {
      var data = {};
      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name) return;
        data[field.name] = field.type === "checkbox" ? field.checked : field.value.trim();
      });
      return data;
    }

    request("/me/profile")
      .then(function (result) {
        applyData(result.profile || {});
      })
      .catch(function () {
        window.location.href = "login.html";
      });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      request("/me/profile", {
        method: "PATCH",
        body: readFormData(),
      })
      .then(function (result) {
        applyData(result.profile || {});
        updateStoredSession(result.profile || {});
        notice.textContent = "Изменения сохранены.";
        notice.classList.add("is-visible");
          window.setTimeout(function () {
            notice.classList.remove("is-visible");
          }, 1800);
        })
        .catch(function (error) {
          notice.textContent = error.message || "Не удалось сохранить профиль.";
          notice.classList.add("is-visible");
          window.setTimeout(function () {
            notice.classList.remove("is-visible");
          }, 2200);
        });
    });
  }

  setupProfileSettingsPage();
})();

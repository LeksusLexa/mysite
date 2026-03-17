(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function auth() {
    return window.AntennaAuth || null;
  }

  async function api(path, options) {
    var helper = auth();
    if (!helper) throw new Error("Auth helper is unavailable.");
    return helper.request(path, options && options.body ? options.body : null, helper.readSession() && helper.readSession().token, options && options.method);
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

  function setupAddressesPage() {
    var listEl = document.getElementById("addressList");
    var addButton = document.getElementById("addAddressBtn");
    var modal = document.getElementById("addressModal");
    var form = document.getElementById("addressForm");
    if (!listEl || !addButton || !modal || !form) return;

    var recipientInput = document.getElementById("addressRecipientInput");
    var phoneInput = document.getElementById("addressPhoneInput");
    var cityInput = document.getElementById("addressCityInput");
    var addressLineInput = document.getElementById("addressLineInput");
    var commentInput = document.getElementById("addressCommentInput");
    var defaultInput = document.getElementById("addressDefaultInput");
    var cancelButton = document.getElementById("addressCancelBtn");
    var modalTitle = document.getElementById("addressModalTitle");
    var welcome = document.querySelector(".cabinet__welcome");
    var editingId = null;
    var addresses = [];

    function render() {
      if (!addresses.length) {
        listEl.innerHTML = '<div class="cabinet__empty">Список адресов пуст. Добавьте новый адрес доставки.</div>';
        return;
      }

      listEl.innerHTML = addresses.map(function (item) {
        var tag = item.isDefault ? '<span class="cabinet__tag">По умолчанию</span>' : "";
        var setDefaultBtn = item.isDefault ? "" : '<button class="cabinet__btn is-light" type="button" data-action="default" data-id="' + escapeHtml(item.id) + '">Сделать основным</button>';
        return (
          '<article class="cabinet__address' + (item.isDefault ? ' is-default' : '') + '">' +
            '<div class="cabinet__address-top">' +
              '<h4 class="cabinet__address-name">' + escapeHtml(item.city || item.recipientName || "Адрес") + (item.isDefault ? " (основной)" : "") + '</h4>' +
              tag +
            '</div>' +
            '<p class="cabinet__address-text"><strong>' + escapeHtml(item.recipientName || "") + '</strong><br>' +
              escapeHtml(item.phone || "") + '<br>' +
              escapeHtml(item.summary || item.addressLine || "").replace(/\n/g, "<br>") +
              (item.comment ? '<br>' + escapeHtml(item.comment) : '') +
            '</p>' +
            '<div class="cabinet__address-footer">' +
              setDefaultBtn +
              '<button class="cabinet__btn is-light" type="button" data-action="edit" data-id="' + escapeHtml(item.id) + '">Редактировать</button>' +
              '<button class="cabinet__btn is-light" type="button" data-action="delete" data-id="' + escapeHtml(item.id) + '">Удалить</button>' +
            '</div>' +
          '</article>'
        );
      }).join("");
    }

    function openModal(address) {
      editingId = address ? address.id : null;
      modalTitle.textContent = editingId ? "Редактировать адрес" : "Добавить адрес";
      recipientInput.value = address ? (address.recipientName || "") : "";
      phoneInput.value = address ? (address.phone || "") : "";
      cityInput.value = address ? (address.city || "") : "";
      addressLineInput.value = address ? (address.addressLine || "") : "";
      commentInput.value = address ? (address.comment || "") : "";
      defaultInput.checked = address ? !!address.isDefault : addresses.length === 0;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      form.reset();
      editingId = null;
    }

    async function loadAddresses() {
      var result = await request("/me/addresses");
      addresses = Array.isArray(result.addresses) ? result.addresses : [];
      render();
    }

    addButton.addEventListener("click", function () {
      openModal(null);
    });

    cancelButton.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    listEl.addEventListener("click", async function (event) {
      var button = event.target.closest("button[data-action]");
      if (!button) return;
      var action = button.getAttribute("data-action");
      var id = button.getAttribute("data-id");
      var item = addresses.find(function (address) { return String(address.id) === String(id); });
      if (!item) return;

      if (action === "edit") {
        openModal(item);
        return;
      }

      if (action === "delete") {
        if (!window.confirm('Удалить адрес?')) return;
        await request("/me/addresses/" + encodeURIComponent(id), { method: "DELETE" });
        await loadAddresses();
        return;
      }

      if (action === "default") {
        await request("/me/addresses/" + encodeURIComponent(id), {
          method: "PATCH",
          body: {
            recipientName: item.recipientName,
            phone: item.phone,
            city: item.city,
            addressLine: item.addressLine,
            comment: item.comment,
            isDefault: true
          }
        });
        await loadAddresses();
      }
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var payload = {
        recipientName: recipientInput.value.trim(),
        phone: phoneInput.value.trim(),
        city: cityInput.value.trim(),
        addressLine: addressLineInput.value.trim(),
        comment: commentInput.value.trim(),
        isDefault: defaultInput.checked
      };
      if (editingId) {
        await request("/me/addresses/" + encodeURIComponent(editingId), { method: "PATCH", body: payload });
      } else {
        await request("/me/addresses", { method: "POST", body: payload });
      }
      closeModal();
      await loadAddresses();
    });

    if (welcome) {
      welcome.textContent = "Управляйте адресами доставки: выбирайте основной, редактируйте и удаляйте адреса в одном месте.";
    }

    loadAddresses().catch(function () {
      listEl.innerHTML = '<div class="cabinet__empty">Не удалось загрузить адреса. Выполните вход заново.</div>';
    });
  }

  setupAddressesPage();
})();

import { createHmac, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const env = loadEnv();
const PORT = Number(env.PORT || 8787);
const DIRECTUS_URL = (env.DIRECTUS_URL || "http://localhost:8055").replace(/\/+$/, "");
const DIRECTUS_EMAIL = env.DIRECTUS_EMAIL || "";
const DIRECTUS_PASSWORD = env.DIRECTUS_PASSWORD || "";
const AUTH_SECRET = env.AUTH_SECRET || "local-dev-secret";
const SMTP_HOST = env.SMTP_HOST || "";
const SMTP_PORT = Number(env.SMTP_PORT || 465);
const SMTP_SECURE = String(env.SMTP_SECURE || "true").toLowerCase() !== "false";
const SMTP_USER = env.SMTP_USER || "";
const SMTP_PASS = env.SMTP_PASS || "";
const SMTP_FROM = env.SMTP_FROM || SMTP_USER || "";
const MANAGER_EMAILS = String(env.MANAGER_EMAILS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const server = createServer(async (req, res) => {
  try {
    if (handleCors(req, res)) return;

    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/api/health") {
      return json(res, 200, { ok: true });
    }

    if (req.method === "POST" && url.pathname === "/api/auth/register") {
      const body = await readJson(req);
      const result = await registerCustomer(body);
      return json(res, 201, result);
    }

    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      const body = await readJson(req);
      const result = await loginCustomer(body);
      return json(res, 200, result);
    }

    if (req.method === "GET" && url.pathname === "/api/auth/me") {
      const auth = authenticate(req);
      if (!auth) return json(res, 401, { error: "Не выполнен вход." });
      return json(res, 200, { user: auth });
    }

    if (req.method === "GET" && url.pathname === "/api/me/orders") {
      const auth = authenticate(req);
      if (!auth) return json(res, 401, { error: "Не выполнен вход." });
      const orders = await listOrders(auth);
      return json(res, 200, { orders });
    }

    if (req.method === "GET" && url.pathname === "/api/me/addresses") {
      const auth = authenticate(req);
      if (!auth) return json(res, 401, { error: "Не выполнен вход." });
      const addresses = await listAddresses(auth);
      return json(res, 200, { addresses });
    }

    if (req.method === "GET" && url.pathname === "/api/me/profile") {
      const auth = authenticate(req);
      if (!auth) return json(res, 401, { error: "Не выполнен вход." });
      const profile = await getProfile(auth);
      return json(res, 200, { profile });
    }

    if (req.method === "POST" && url.pathname === "/api/orders") {
      const auth = authenticate(req);
      if (!auth) return json(res, 401, { error: "Не выполнен вход." });
      const body = await readJson(req);
      const order = await createOrder(auth, body);
      return json(res, 201, { message: "Заказ создан.", order });
    }

    if (req.method === "POST" && url.pathname === "/api/me/addresses") {
      const auth = authenticate(req);
      if (!auth) return json(res, 401, { error: "Не выполнен вход." });
      const body = await readJson(req);
      const address = await saveAddress(auth, body);
      return json(res, 201, { message: "Адрес сохранен.", address });
    }

    if (req.method === "PATCH" && url.pathname === "/api/me/profile") {
      const auth = authenticate(req);
      if (!auth) return json(res, 401, { error: "Не выполнен вход." });
      const body = await readJson(req);
      const profile = await updateProfile(auth, body);
      return json(res, 200, { message: "Профиль обновлен.", profile });
    }

    if (req.method === "PATCH" && url.pathname.startsWith("/api/me/addresses/")) {
      const auth = authenticate(req);
      if (!auth) return json(res, 401, { error: "Не выполнен вход." });
      const body = await readJson(req);
      const id = url.pathname.split("/").pop();
      const address = await saveAddress(auth, body, id);
      return json(res, 200, { message: "Адрес обновлен.", address });
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/api/me/addresses/")) {
      const auth = authenticate(req);
      if (!auth) return json(res, 401, { error: "Не выполнен вход." });
      const id = url.pathname.split("/").pop();
      await deleteAddress(auth, id);
      return json(res, 200, { message: "Адрес удален." });
    }

    return json(res, 404, { error: "Маршрут не найден." });
  } catch (error) {
    const status = Number(error.statusCode || error.status || 500);
    return json(res, status, { error: error.message || "Внутренняя ошибка сервера." });
  }
});

server.listen(PORT, () => {
  console.log(`Auth backend listening on http://localhost:${PORT}`);
});

function loadEnv() {
  const here = dirname(fileURLToPath(import.meta.url));
  const file = resolve(here, ".env");
  if (!existsSync(file)) return process.env;
  const raw = readFileSync(file, "utf8");
  const parsed = {};
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const index = trimmed.indexOf("=");
    if (index === -1) return;
    parsed[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  });
  return { ...process.env, ...parsed };
}

function handleCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function splitName(value) {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function hashPassword(password) {
  const salt = randomUUID().replace(/-/g, "");
  const hash = scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expectedHex] = parts;
  const actual = scryptSync(String(password), salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function signToken(payload) {
  const body = {
    ...payload,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
  const encoded = base64url(JSON.stringify(body));
  const signature = createHmac("sha256", AUTH_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyToken(token) {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) return null;
  const expected = createHmac("sha256", AUTH_SECRET).update(encoded).digest("base64url");
  if (expected !== signature) return null;
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (!payload.exp || Number(payload.exp) < Date.now()) return null;
  return payload;
}

function authenticate(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return verifyToken(match[1]);
}

async function directusToken() {
  if (!DIRECTUS_EMAIL || !DIRECTUS_PASSWORD) {
    const error = new Error("Не настроены учетные данные Directus.");
    error.statusCode = 500;
    throw error;
  }
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data?.data?.access_token) {
    const error = new Error("Не удалось авторизоваться в Directus.");
    error.statusCode = 502;
    throw error;
  }
  return data.data.access_token;
}

async function directusRequest(path, options = {}) {
  const token = await directusToken();
  const response = await fetch(`${DIRECTUS_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.errors?.[0]?.message || data?.error || "Ошибка Directus.";
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }
  return data?.data;
}

async function findCustomerByEmail(email) {
  const query = new URLSearchParams({
    "filter[email][_eq]": email,
    fields: "id,email,password_hash,first_name,last_name,phone,is_active,status,city,company,comment,notify_sms,notify_email",
    limit: "1",
  });
  const data = await directusRequest(`/items/customers?${query.toString()}`, { method: "GET" });
  return Array.isArray(data) ? data[0] || null : null;
}

async function getProfile(auth) {
  const customer = await findCustomerByEmail(auth.email);
  if (!customer) {
    const error = new Error("Пользователь не найден.");
    error.statusCode = 404;
    throw error;
  }
  return {
    id: customer.id,
    email: customer.email || "",
    name: [customer.first_name, customer.last_name].filter(Boolean).join(" ").trim() || auth.fullName || "",
    firstName: customer.first_name || "",
    lastName: customer.last_name || "",
    phone: customer.phone || "",
    city: customer.city || "",
    company: customer.company || "",
    comment: customer.comment || "",
    notifySms: customer.notify_sms !== false,
    notifyEmail: customer.notify_email !== false,
  };
}

async function updateProfile(auth, body) {
  const customer = await findCustomerByEmail(auth.email);
  if (!customer) {
    const error = new Error("Пользователь не найден.");
    error.statusCode = 404;
    throw error;
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  if (!name || !phone) {
    const error = new Error("Заполните имя и телефон.");
    error.statusCode = 400;
    throw error;
  }

  const { firstName, lastName } = splitName(name);
  await directusRequest(`/items/customers/${customer.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      phone,
      city: String(body.city || "").trim(),
      company: String(body.company || "").trim(),
      comment: String(body.comment || "").trim(),
      notify_sms: Boolean(body.notifySms),
      notify_email: Boolean(body.notifyEmail),
    }),
  });

  return {
    id: customer.id,
    email: customer.email || "",
    name: [firstName, lastName].filter(Boolean).join(" ").trim() || customer.email || "",
    firstName,
    lastName,
    phone,
    city: String(body.city || "").trim(),
    company: String(body.company || "").trim(),
    comment: String(body.comment || "").trim(),
    notifySms: Boolean(body.notifySms),
    notifyEmail: Boolean(body.notifyEmail),
  };
}

async function registerCustomer(body) {
  const name = String(body.name || "").trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  const passwordConfirm = String(body.passwordConfirm || "");

  if (!name || !email || !password) {
    const error = new Error("Заполните имя, email и пароль.");
    error.statusCode = 400;
    throw error;
  }
  if (password.length < 6) {
    const error = new Error("Пароль должен быть не короче 6 символов.");
    error.statusCode = 400;
    throw error;
  }
  if (password !== passwordConfirm) {
    const error = new Error("Пароли не совпадают.");
    error.statusCode = 400;
    throw error;
  }

  const existing = await findCustomerByEmail(email);
  if (existing) {
    const error = new Error("Пользователь с таким email уже существует.");
    error.statusCode = 409;
    throw error;
  }

  const { firstName, lastName } = splitName(name);
  await directusRequest("/items/customers", {
    method: "POST",
    body: JSON.stringify({
      status: "published",
      email,
      password_hash: hashPassword(password),
      first_name: firstName,
      last_name: lastName,
      is_active: true,
    }),
  });

  const created = await findCustomerByEmail(email);
  const user = serializeCustomer(created);
  return {
    message: "Аккаунт создан.",
    token: signToken(user),
    user,
  };
}

async function loginCustomer(body) {
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  if (!email || !password) {
    const error = new Error("Укажите email и пароль.");
    error.statusCode = 400;
    throw error;
  }

  const customer = await findCustomerByEmail(email);
  if (!customer || !verifyPassword(password, customer.password_hash)) {
    const error = new Error("Неверный email или пароль.");
    error.statusCode = 401;
    throw error;
  }
  if (customer.is_active === false) {
    const error = new Error("Аккаунт отключен.");
    error.statusCode = 403;
    throw error;
  }

  const user = serializeCustomer(customer);
  return {
    message: "Вход выполнен.",
    token: signToken(user),
    user,
  };
}

function serializeCustomer(customer) {
  return {
    id: customer?.id || null,
    email: customer?.email || "",
    firstName: customer?.first_name || "",
    lastName: customer?.last_name || "",
    phone: customer?.phone || "",
    fullName: [customer?.first_name, customer?.last_name].filter(Boolean).join(" ").trim() || customer?.email || "Пользователь",
  };
}

function moneyNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(parsed);
}

function orderStatusLabel(order) {
  const status = String(order?.order_status || "").toLowerCase();
  if (status === "confirmed") return "Подтвержден";
  if (status === "assembling") return "Собирается";
  if (status === "shipped") return "Отправлен";
  if (status === "completed") return "Выполнен";
  if (status === "cancelled") return "Отменен";
  return "Новый";
}

function paymentMethodLabel(value) {
  if (value === "invoice") return "Оплата по счету";
  if (value === "store") return "Оплата в магазине";
  return "Оформить заказ";
}

function paymentStatusLabel(value) {
  const status = String(value || "").toLowerCase();
  if (status === "paid") return "Оплачено";
  if (status === "invoice_sent") return "Счет выставлен";
  if (status === "refunded") return "Возврат";
  return "Ожидает оплаты";
}

function isOrderActive(order) {
  const status = String(order?.order_status || "").toLowerCase();
  return !["completed", "cancelled"].includes(status);
}

function createTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function escapeHtmlForEmail(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendOrderNotifications(order) {
  const transporter = createTransporter();
  if (!transporter) return;

  const itemsHtml = (order.items || [])
    .map((item) => `<li>${escapeHtmlForEmail(item.name)} x${item.qty} - ₽${item.price}</li>`)
    .join("");

  const clientHtml =
    `<p>Здравствуйте, ${escapeHtmlForEmail(order.customerName || order.email)}.</p>` +
    `<p>Ваш заказ <strong>${escapeHtmlForEmail(order.id)}</strong> принят.</p>` +
    `<p>Статус заказа: <strong>${escapeHtmlForEmail(order.statusLabel)}</strong></p>` +
    `<p>Статус оплаты: <strong>${escapeHtmlForEmail(order.paymentStatusLabel)}</strong></p>` +
    `<p>Состав заказа:</p><ul>${itemsHtml}</ul>` +
    `<p>Итого: <strong>₽${order.total}</strong></p>`;

  const managerHtml =
    `<p>Новый заказ <strong>${escapeHtmlForEmail(order.id)}</strong>.</p>` +
    `<p>Клиент: ${escapeHtmlForEmail(order.customerName || "-")}</p>` +
    `<p>Email: ${escapeHtmlForEmail(order.email || "-")}</p>` +
    `<p>Телефон: ${escapeHtmlForEmail(order.phone || "-")}</p>` +
    `<p>Получение: ${escapeHtmlForEmail(order.deliveryType === "delivery" ? "Доставка" : "Самовывоз")}</p>` +
    `<p>Оплата: ${escapeHtmlForEmail(order.paymentLabel)}</p>` +
    `<p>Адрес: ${escapeHtmlForEmail(order.address || "-")}</p>` +
    `<p>Состав заказа:</p><ul>${itemsHtml}</ul>` +
    `<p>Итого: <strong>₽${order.total}</strong></p>`;

  const jobs = [];
  if (order.email) {
    jobs.push(transporter.sendMail({
      from: SMTP_FROM,
      to: order.email,
      subject: `Ваш заказ ${order.id} принят`,
      html: clientHtml,
    }));
  }
  if (MANAGER_EMAILS.length) {
    jobs.push(transporter.sendMail({
      from: SMTP_FROM,
      to: MANAGER_EMAILS.join(", "),
      subject: `Новый заказ ${order.id}`,
      html: managerHtml,
    }));
  }
  await Promise.all(jobs);
}

async function listOrders(auth) {
  const query = new URLSearchParams({
    "filter[customer_email][_eq]": auth.email,
    fields: "order_number,customer_email,customer_name,phone,delivery_type,payment_method,payment_status,order_status,address,total,currency,created_at_external",
    sort: "-created_at_external,-id",
    limit: "50",
  });

  const orders = await directusRequest(`/items/orders?${query.toString()}`, { method: "GET" });
  const list = Array.isArray(orders) ? orders : [];

  const withItems = await Promise.all(
    list.map(async (order) => {
      const itemsQuery = new URLSearchParams({
        "filter[order_number][_eq]": order.order_number,
        fields: "product_sku,product_name,price,qty,line_total",
        limit: "100",
      });
      const items = await directusRequest(`/items/order_items?${itemsQuery.toString()}`, { method: "GET" });
      return {
        id: order.order_number,
        date: order.created_at_external || new Date().toISOString(),
        email: order.customer_email || auth.email,
        customerName: order.customer_name || "",
        phone: order.phone || "",
        address: order.address || "",
        deliveryType: order.delivery_type || "pickup",
        paymentLabel: paymentMethodLabel(order.payment_method),
        paymentStatusLabel: paymentStatusLabel(order.payment_status),
        statusLabel: orderStatusLabel(order),
        isActive: isOrderActive(order),
        total: moneyNumber(order.total),
        items: (Array.isArray(items) ? items : []).map((item) => ({
          sku: item.product_sku || "",
          name: item.product_name || "Товар",
          qty: moneyNumber(item.qty) || 1,
          price: moneyNumber(item.price),
          lineTotal: moneyNumber(item.line_total),
        })),
      };
    })
  );

  return withItems;
}

async function createOrder(auth, body) {
  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length) {
    const error = new Error("Корзина пуста.");
    error.statusCode = 400;
    throw error;
  }

  const email = normalizeEmail(body.email || auth.email);
  const phone = String(body.phone || "").trim();
  const deliveryType = body.deliveryType === "delivery" ? "delivery" : "pickup";
  const paymentMethod = String(body.paymentMethod || "submit");
  const address = String(body.address || "").trim();
  const recipient = String(body.recipient || auth.fullName || "").trim();
  const comment = String(body.comment || "").trim();
  const saveAddressRequested = Boolean(body.saveAddress);
  const addressMeta = body.addressMeta && typeof body.addressMeta === "object" ? body.addressMeta : null;
  const total = items.reduce((sum, item) => sum + moneyNumber(item.price) * Math.max(1, moneyNumber(item.qty) || 1), 0);

  if (!email || !phone) {
    const error = new Error("Заполните email и телефон.");
    error.statusCode = 400;
    throw error;
  }
  if (deliveryType === "delivery" && !address) {
    const error = new Error("Для доставки укажите адрес.");
    error.statusCode = 400;
    throw error;
  }

  const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
  const createdAt = new Date().toISOString();

  await directusRequest("/items/orders", {
    method: "POST",
    body: JSON.stringify({
      status: "published",
      order_number: orderNumber,
      customer_email: email,
      customer_name: recipient || auth.fullName || auth.email,
      phone,
      delivery_type: deliveryType,
      payment_method: paymentMethod,
      payment_status: paymentMethod === "invoice" ? "invoice_sent" : "pending",
      order_status: "new",
      address,
      comment,
      total,
      currency: "RUB",
      created_at_external: createdAt,
    }),
  });

  for (const item of items) {
    const qty = Math.max(1, moneyNumber(item.qty) || 1);
    const price = moneyNumber(item.price);
    await directusRequest("/items/order_items", {
      method: "POST",
      body: JSON.stringify({
        status: "published",
        order_number: orderNumber,
        product_sku: String(item.sku || ""),
        product_name: String(item.name || "Товар"),
        price,
        qty,
        line_total: price * qty,
      }),
    });
  }

  if (deliveryType === "delivery" && saveAddressRequested && addressMeta) {
    await saveAddress(auth, {
      recipientName: addressMeta.recipientName || recipient,
      phone,
      city: addressMeta.city || "",
      addressLine: addressMeta.addressLine || address,
      comment: addressMeta.comment || comment,
      isDefault: Boolean(addressMeta.isDefault),
    });
  }

  const normalizedOrder = {
    id: orderNumber,
    date: createdAt,
    email,
    customerName: recipient || auth.fullName || auth.email,
    phone,
    address,
    deliveryType,
    paymentLabel: paymentMethodLabel(paymentMethod),
    paymentStatusLabel: paymentStatusLabel(paymentMethod === "invoice" ? "invoice_sent" : "pending"),
    statusLabel: orderStatusLabel({ order_status: "new" }),
    total,
    items: items.map((item) => ({
      sku: String(item.sku || ""),
      name: String(item.name || "Товар"),
      qty: Math.max(1, moneyNumber(item.qty) || 1),
      price: moneyNumber(item.price),
    })),
  };
  try {
    await sendOrderNotifications(normalizedOrder);
  } catch (error) {
    console.error("Order notification failed:", error.message || error);
  }
  return normalizedOrder;
}

function serializeAddress(item) {
  const city = String(item?.city || "").trim();
  const addressLine = String(item?.address_line || "").trim();
  const summary = [city, addressLine].filter(Boolean).join(", ");
  return {
    id: item?.id || null,
    recipientName: item?.recipient_name || "",
    phone: item?.phone || "",
    city,
    addressLine,
    comment: item?.comment || "",
    isDefault: Boolean(item?.is_default),
    summary,
    details: [item?.recipient_name, item?.phone].filter(Boolean).join(", ") + (summary ? `\n${summary}` : "") + (item?.comment ? `\n${item.comment}` : ""),
  };
}

async function listAddresses(auth) {
  const query = new URLSearchParams({
    "filter[customer_email][_eq]": auth.email,
    fields: "id,customer_email,recipient_name,phone,city,address_line,comment,is_default",
    sort: "-is_default,-id",
    limit: "100",
  });
  const items = await directusRequest(`/items/customer_addresses?${query.toString()}`, { method: "GET" });
  return (Array.isArray(items) ? items : []).map(serializeAddress);
}

async function getAddressById(auth, id) {
  const query = new URLSearchParams({
    "filter[id][_eq]": String(id),
    "filter[customer_email][_eq]": auth.email,
    fields: "id,customer_email,recipient_name,phone,city,address_line,comment,is_default",
    limit: "1",
  });
  const items = await directusRequest(`/items/customer_addresses?${query.toString()}`, { method: "GET" });
  return Array.isArray(items) ? items[0] || null : null;
}

async function clearDefaultAddress(auth) {
  const addresses = await listAddresses(auth);
  await Promise.all(
    addresses
      .filter((item) => item.isDefault)
      .map((item) =>
        directusRequest(`/items/customer_addresses/${item.id}`, {
          method: "PATCH",
          body: JSON.stringify({ is_default: false }),
        })
      )
  );
}

async function saveAddress(auth, body, id = null) {
  const recipientName = String(body.recipientName || "").trim();
  const phone = String(body.phone || "").trim();
  const city = String(body.city || "").trim();
  const addressLine = String(body.addressLine || "").trim();
  const comment = String(body.comment || "").trim();
  const isDefault = Boolean(body.isDefault);

  if (!recipientName || !phone || !addressLine) {
    const error = new Error("Заполните получателя, телефон и адрес.");
    error.statusCode = 400;
    throw error;
  }

  if (isDefault) {
    await clearDefaultAddress(auth);
  }

  const payload = {
    status: "published",
    customer_email: auth.email,
    recipient_name: recipientName,
    phone,
    city,
    address_line: addressLine,
    comment,
    is_default: isDefault,
  };

  if (id) {
    const current = await getAddressById(auth, id);
    if (!current) {
      const error = new Error("Адрес не найден.");
      error.statusCode = 404;
      throw error;
    }
    await directusRequest(`/items/customer_addresses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const updated = await getAddressById(auth, id);
    return serializeAddress(updated);
  }

  const created = await directusRequest("/items/customer_addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return serializeAddress(created);
}

async function deleteAddress(auth, id) {
  const current = await getAddressById(auth, id);
  if (!current) {
    const error = new Error("Адрес не найден.");
    error.statusCode = 404;
    throw error;
  }
  await directusRequest(`/items/customer_addresses/${id}`, { method: "DELETE" });

  if (current.is_default) {
    const addresses = await listAddresses(auth);
    if (addresses.length) {
      await directusRequest(`/items/customer_addresses/${addresses[0].id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_default: true }),
      });
    }
  }
}

const MAX_BODY_BYTES = 16_384;

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  },
  body: JSON.stringify(body),
});

const clean = (value, maxLength) =>
  typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, maxLength)
    : "";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { ...json(405, { ok: false }), headers: { ...json(405, {}).headers, allow: "POST" } };
  }

  const origin = event.headers.origin;
  const host = event.headers["x-forwarded-host"] || event.headers.host;
  if (!origin || !host) return json(403, { ok: false });

  try {
    if (new URL(origin).host !== host.split(",")[0].trim()) {
      return json(403, { ok: false });
    }
  } catch {
    return json(403, { ok: false });
  }

  if (!event.body || Buffer.byteLength(event.body, "utf8") > MAX_BODY_BYTES) {
    return json(400, { ok: false });
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return json(400, { ok: false });
  }

  if (clean(payload.website, 100)) return json(200, { ok: true });

  const name = clean(payload.name, 100) || "Не вказано";
  const phone = clean(payload.phone, 40);
  const service = clean(payload.service, 120) || "Не вибрано";
  const comment = clean(payload.comment, 1_500) || "Без коментаря";
  const source = clean(payload.source, 500) || "Не вказано";

  if (phone.replace(/\D/g, "").length < 10) {
    return json(422, { ok: false, error: "invalid_phone" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return json(503, { ok: false });

  const message = [
    "🏠 Нова заявка · Comfort Home",
    "",
    `Імʼя: ${name}`,
    `Телефон: ${phone}`,
    `Послуга: ${service}`,
    `Коментар: ${comment}`,
    `Джерело: ${source}`,
  ].join("\n");

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    if (!telegramResponse.ok) return json(502, { ok: false });
    return json(200, { ok: true });
  } catch {
    return json(502, { ok: false });
  }
};

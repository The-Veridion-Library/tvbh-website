import fs from "fs/promises";
import path from "path";

type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  [key: string]: any;
};

const ENV = process.env.ENV || process.env.NODE_ENV || "development";

async function sendViaResend(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");

  const body: any = {
    from: payload.from || "no-reply@yourdomain.com",
    to: payload.to,
    subject: payload.subject,
  };
  if (payload.html) body.html = payload.html;
  if (payload.text) body.text = payload.text;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
}

async function writeEmailFile(payload: EmailPayload) {
  const emailsDir = path.join(process.cwd(), "emails");
  await fs.mkdir(emailsDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const rand = Math.random().toString(36).slice(2, 8);
  const filename = `${ts}-${rand}.json`;
  const filepath = path.join(emailsDir, filename);
  const content = JSON.stringify({ ...payload, _createdAt: new Date().toISOString() }, null, 2);
  await fs.writeFile(filepath, content, "utf8");
}

export async function sendEmail(payload: EmailPayload) {
  try {
    if (ENV === "production" || ENV === "prod") {
      await sendViaResend(payload);
    } else {
      await writeEmailFile(payload);
    }
  } catch (err) {
    // Don't throw to avoid breaking auth flows; log instead
    // eslint-disable-next-line no-console
    console.error("sendEmail error:", err);
  }
}

export default sendEmail;

import nodemailer, { type Transporter } from 'nodemailer';

/**
 * One shared SMTP transporter for the whole app.
 *
 * Previously each mail controller built a fresh transporter per request, which
 * reopened an SMTP connection every time — slow, and enough to get throttled by
 * Gmail under load. A single pooled transporter is created lazily on first use
 * and reused thereafter.
 *
 * Returns null when email isn't configured, so callers can treat mail as a
 * best-effort side effect and never block a submission on it.
 */
let transporter: Transporter | null = null;

export function getTransporter(): Transporter | null {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      pool: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
}

/** The address outgoing mail is sent from (the configured Gmail account). */
export function getMailFrom(): string | undefined {
  return process.env.EMAIL_USER;
}

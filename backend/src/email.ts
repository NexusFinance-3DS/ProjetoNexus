import nodemailer from "nodemailer";
import { config } from "./config";

export async function sendRecoveryCode(email: string, code: string): Promise<void> {
  if (!config.email.user || !config.email.password) {
    console.log(`[RECUPERAÇÃO] Código para ${email}: ${code}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: { user: config.email.user, pass: config.email.password },
  });

  await transporter.sendMail({
    from: config.email.from,
    to: email,
    subject: "Código de recuperação - Nexus Finance",
    text: `Seu código de recuperação é ${code}. Ele expira em 15 minutos.`,
  });
}

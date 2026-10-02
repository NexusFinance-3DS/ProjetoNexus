import nodemailer from 'nodemailer';
import { configuracao } from "../config/configuracao";
export async function enviarCodigoRecuperacao(email: string, codigo: string): Promise<void> {
  if (!configuracao.email.user || !configuracao.email.password) {
    return;
  }
  const transportador = nodemailer.createTransport({
    host: configuracao.email.host,
    port: configuracao.email.port,
    secure: configuracao.email.port === 465,
    auth: {
      user: configuracao.email.user,
      pass: configuracao.email.password
    }
  });
  await transportador.sendMail({
    from: configuracao.email.from,
    to: email,
    subject: 'Código de recuperação - Nexus Finance',
    text: `Seu código de recuperação é ${codigo}. Ele expira em 15 minutos.`
  });
}

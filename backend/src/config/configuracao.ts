import 'dotenv/config';
const segredoConfigurado = process.env.JWT_SECRET?.trim();
if (process.env.NODE_ENV === 'production' && (!segredoConfigurado || segredoConfigurado.length < 32)) {
  throw new Error('Configure JWT_SECRET com pelo menos 32 caracteres antes de iniciar em produção.');
}
function obrigatoria(nome: string, alternativa?: string): string {
  const valor = process.env[nome] || alternativa;
  if (!valor) {
    throw new Error(`Variável de ambiente ${nome} não configurada.`);
  }
  return valor;
}

export const configuracao = {
  porta: Number(process.env.PORT || 3000),
  banco: {
    host: obrigatoria('DB_HOST', 'localhost'),
    port: Number(process.env.DB_PORT || 3306),
    user: obrigatoria('DB_USER', 'root'),
    password: process.env.DB_PASSWORD || '',
    database: obrigatoria('DB_NAME', 'nexus_finance')
  },
  jwt: {
    segredo: obrigatoria('JWT_SECRET'),
    validade: process.env.JWT_EXPIRES_IN || '7d'
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 587),
    user: obrigatoria('EMAIL_USER'),
    password: obrigatoria('EMAIL_APP_PASSWORD'),
    from:
      process.env.EMAIL_FROM ||
      `Nexus Finance <${obrigatoria('EMAIL_USER')}>`
  }
};
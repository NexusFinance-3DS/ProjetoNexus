import 'dotenv/config';
function obrigatoria(nome: string, alternativa?: string): string {
  const valor = process.env[nome] || alternativa;
  if (!valor) throw new Error(`Variável de ambiente ${nome} não configurada.`);
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
  segredoJwt: obrigatoria('JWT_SECRET', 'chave-apenas-para-desenvolvimento'),
  validadeJwt: process.env.JWT_EXPIRES_IN || '7d',
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 587),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'Nexus Finance <noreply@nexusfinance.com>'
  }
};

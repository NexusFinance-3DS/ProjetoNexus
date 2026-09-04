import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Variável de ambiente ${name} não configurada.`);
  return value;
}

export const config = {
  port: Number(process.env.PORT || 3000),
  database: {
    host: required("DB_HOST", "localhost"),
    port: Number(process.env.DB_PORT || 3306),
    user: required("DB_USER", "root"),
    password: process.env.DB_PASSWORD || "",
    database: required("DB_NAME", "nexus_finance"),
  },
  jwtSecret: required("JWT_SECRET", "chave-apenas-para-desenvolvimento"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 587),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || "Nexus Finance <noreply@nexusfinance.com>",
  },
};

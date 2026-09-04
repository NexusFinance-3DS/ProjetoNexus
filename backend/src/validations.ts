export function normalizeEmail(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function onlyNumbers(value: unknown): string {
  return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyNumbers(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index++) {
      sum += Number(cpf[index]) * (length + 1 - index);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return calculateDigit(9) === Number(cpf[9]) && calculateDigit(10) === Number(cpf[10]);
}

export function normalizeDate(value: unknown): string {
  if (typeof value !== "string") return "";
  const date = value.trim();
  const brazilian = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return brazilian ? `${brazilian[3]}-${brazilian[2]}-${brazilian[1]}` : date;
}

export function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function passwordError(password: unknown): string | null {
  if (typeof password !== "string" || password.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
  if (!/[a-z]/.test(password)) return "A senha deve ter uma letra minúscula.";
  if (!/[A-Z]/.test(password)) return "A senha deve ter uma letra maiúscula.";
  if (!/\d/.test(password)) return "A senha deve ter um número.";
  return null;
}

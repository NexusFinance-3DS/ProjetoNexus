export function normalizarEmail(email: unknown): string {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}
export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function somenteNumeros(valor: unknown): string {
  return typeof valor === 'string' ? valor.replace(/\D/g, '') : '';
}
export function cpfValido(valor: string): boolean {
  const cpf = somenteNumeros(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calcularDigito = (comprimento: number) => {
    let soma = 0;
    for (let index = 0; index < comprimento; index++) {
      soma += Number(cpf[index]) * (comprimento + 1 - index);
    }
    const rest = soma * 10 % 11;
    return rest === 10 ? 0 : rest;
  };
  return calcularDigito(9) === Number(cpf[9]) && calcularDigito(10) === Number(cpf[10]);
}
export function normalizarData(valor: unknown): string {
  if (typeof valor !== 'string') return '';
  const data = valor.trim();
  const formatoBrasileiro = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return formatoBrasileiro ? `${formatoBrasileiro[3]}-${formatoBrasileiro[2]}-${formatoBrasileiro[1]}` : data;
}
export function dataNascimentoValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const data = new Date(`${valor}T00:00:00`);
  if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== valor) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return data < hoje;
}
export function erroSenha(senha: unknown): string | null {
  if (typeof senha !== 'string' || senha.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
  if (!/[a-z]/.test(senha)) return 'A senha deve ter uma letra minúscula.';
  if (!/[A-Z]/.test(senha)) return 'A senha deve ter uma letra maiúscula.';
  if (!/\d/.test(senha)) return 'A senha deve ter um número.';
  return null;
}

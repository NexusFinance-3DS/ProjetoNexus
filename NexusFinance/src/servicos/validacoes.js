export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validarDataNascimento(valor) {
  const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const normalizada = brasileira ? `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}` : valor;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizada)) return false;
  const dados = new Date(`${normalizada}T00:00:00`);
  return !Number.isNaN(dados.getTime()) && dados.toISOString().slice(0, 10) === normalizada && dados < new Date();
}
export function erroSenha(senha) {
  if (senha.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
  if (!/[a-z]/.test(senha)) return 'A senha deve ter uma letra minúscula.';
  if (!/[A-Z]/.test(senha)) return 'A senha deve ter uma letra maiúscula.';
  if (!/\d/.test(senha)) return 'A senha deve ter um número.';
  return '';
}

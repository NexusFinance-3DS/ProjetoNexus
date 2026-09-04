export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validarCpf(valor) {
  const cpf = valor.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digito = (tamanho) => {
    let soma = 0;
    for (let indice = 0; indice < tamanho; indice++) {
      soma += Number(cpf[indice]) * (tamanho + 1 - indice);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

export function validarDataNascimento(valor) {
  const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const normalizada = brasileira
    ? `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`
    : valor;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizada)) return false;
  const data = new Date(`${normalizada}T00:00:00`);
  return !Number.isNaN(data.getTime())
    && data.toISOString().slice(0, 10) === normalizada
    && data < new Date();
}

export function erroSenha(senha) {
  if (senha.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
  if (!/[a-z]/.test(senha)) return "A senha deve ter uma letra minúscula.";
  if (!/[A-Z]/.test(senha)) return "A senha deve ter uma letra maiúscula.";
  if (!/\d/.test(senha)) return "A senha deve ter um número.";
  return "";
}

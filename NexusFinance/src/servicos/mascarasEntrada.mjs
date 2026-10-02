function mascararDigitos(valor, comprimentoMaximo) {
  const digitos = String(valor ?? '').replace(/\D/g, '');
  return typeof comprimentoMaximo === 'number' ? digitos.slice(0, comprimentoMaximo) : digitos;
}
function mascararEmail(valor) {
  return String(valor ?? '').replace(/\s/g, '').toLowerCase();
}
function mascararTelefone(valor) {
  const digitos = mascararDigitos(valor, 11);
  if (!digitos) return '';
  if (digitos.length <= 2) return `(${digitos}`;
  const ddd = digitos.slice(0, 2);
  const number = digitos.slice(2);
  if (number.length <= 4) return `(${ddd}) ${number}`;
  if (number.length <= 8) return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
  return `(${ddd}) ${number.slice(0, 5)}-${number.slice(5, 9)}`;
}

function agruparMilhares(digitos) {
  const normalizado = digitos.replace(/^0+(?=\d)/, '') || '0';
  return normalizado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function mascararMoeda(valor) {
  const original = String(valor ?? '');
  const tinhaPrefixo = /^\s*R\$/i.test(original);
  let texto = original.replace(/^\s*R\$\s*/i, '').replace(/\s/g, '');
  if (!texto) return '';
  let digitosInteiros = '';
  let digitosDecimais = '';
  let temDecimal = false;
  if (texto.includes(',')) {
    const [parteInteira, ...partesDecimais] = texto.split(',');
    digitosInteiros = parteInteira.replace(/\D/g, '');
    digitosDecimais = partesDecimais.join('').replace(/\D/g, '').slice(0, 2);
    temDecimal = true;
  } else if (texto.endsWith('.')) {
    digitosInteiros = texto.slice(0, -1).replace(/\D/g, '');
    temDecimal = true;
  } else if (!tinhaPrefixo && (texto.match(/\./g) || []).length === 1) {
    const [parteInteira, parteDecimal] = texto.split('.');
    if (/^\d+$/.test(parteInteira) && /^\d{0,2}$/.test(parteDecimal)) {
      digitosInteiros = parteInteira;
      digitosDecimais = parteDecimal;
      temDecimal = true;
    } else {
      digitosInteiros = texto.replace(/\D/g, '');
    }
  } else {
    digitosInteiros = texto.replace(/\D/g, '');
  }
  digitosInteiros = digitosInteiros.slice(0, 10);
  if (!digitosInteiros && !temDecimal) return '';
  if (!digitosInteiros) digitosInteiros = '0';
  const inteiro = agruparMilhares(digitosInteiros);
  return `R$ ${inteiro}${temDecimal ? `,${digitosDecimais}` : ''}`;
}
export function aplicarMascara(mascara, valor, opcoes = {}) {
  if (!mascara) return valor;
  if (typeof mascara === 'function') return mascara(valor);
  switch (mascara) {
    case 'currency':
      return mascararMoeda(valor);
    case 'phone':
      return mascararTelefone(valor);
    case 'email':
      return mascararEmail(valor);
    case 'digits':
      return mascararDigitos(valor, opcoes.maxDigits);
    default:
      return valor;
  }
}

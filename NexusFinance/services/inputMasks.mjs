export function maskDigits(value, maxLength) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
}

export function maskEmail(value) {
  return String(value ?? '').replace(/\s/g, '').toLowerCase();
}

export function maskPhone(value) {
  const digits = maskDigits(value, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);

  if (number.length <= 4) return `(${ddd}) ${number}`;
  if (number.length <= 8) return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
  return `(${ddd}) ${number.slice(0, 5)}-${number.slice(5, 9)}`;
}

export function maskCpf(value) {
  const digits = maskDigits(value, 11);
  if (!digits) return '';

  let result = digits.slice(0, 3);
  if (digits.length > 3) result += `.${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `.${digits.slice(6, 9)}`;
  if (digits.length > 9) result += `-${digits.slice(9, 11)}`;
  return result;
}

function groupThousands(digits) {
  const normalized = digits.replace(/^0+(?=\d)/, '') || '0';
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function maskCurrency(value) {
  const original = String(value ?? '');
  const hadPrefix = /^\s*R\$/i.test(original);
  let text = original.replace(/^\s*R\$\s*/i, '').replace(/\s/g, '');

  if (!text) return '';

  let integerDigits = '';
  let decimalDigits = '';
  let hasDecimal = false;

  if (text.includes(',')) {
    const [integerPart, ...decimalParts] = text.split(',');
    integerDigits = integerPart.replace(/\D/g, '');
    decimalDigits = decimalParts.join('').replace(/\D/g, '').slice(0, 2);
    hasDecimal = true;
  } else if (text.endsWith('.')) {
    integerDigits = text.slice(0, -1).replace(/\D/g, '');
    hasDecimal = true;
  } else if (!hadPrefix && (text.match(/\./g) || []).length === 1) {
    const [integerPart, decimalPart] = text.split('.');
    if (/^\d+$/.test(integerPart) && /^\d{0,2}$/.test(decimalPart)) {
      integerDigits = integerPart;
      decimalDigits = decimalPart;
      hasDecimal = true;
    } else {
      integerDigits = text.replace(/\D/g, '');
    }
  } else {
    integerDigits = text.replace(/\D/g, '');
  }

  integerDigits = integerDigits.slice(0, 10);
  if (!integerDigits && !hasDecimal) return '';
  if (!integerDigits) integerDigits = '0';

  const integer = groupThousands(integerDigits);
  return `R$ ${integer}${hasDecimal ? `,${decimalDigits}` : ''}`;
}

export function applyInputMask(mask, value, options = {}) {
  if (!mask) return value;
  if (typeof mask === 'function') return mask(value);

  switch (mask) {
    case 'currency':
      return maskCurrency(value);
    case 'phone':
      return maskPhone(value);
    case 'cpf':
      return maskCpf(value);
    case 'email':
      return maskEmail(value);
    case 'digits':
      return maskDigits(value, options.maxDigits);
    default:
      return value;
  }
}

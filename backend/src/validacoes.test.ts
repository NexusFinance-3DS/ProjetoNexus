import { describe, expect, it } from 'vitest';
import { dataNascimentoValida, cpfValido, emailValido, normalizarData, erroSenha } from "./validacoes";
describe('validações da autenticação', () => {
  it('valida e-mail', () => {
    expect(emailValido('aluno@email.com')).toBe(true);
    expect(emailValido('email-invalido')).toBe(false);
  });
  it('valida CPF pelos dígitos verificadores', () => {
    expect(cpfValido('529.982.247-25')).toBe(true);
    expect(cpfValido('111.111.111-11')).toBe(false);
  });
  it('aceita data brasileira e rejeita data impossível', () => {
    expect(normalizarData('31/12/2000')).toBe('2000-12-31');
    expect(dataNascimentoValida('2000-12-31')).toBe(true);
    expect(dataNascimentoValida('2000-02-31')).toBe(false);
  });
  it('exige senha com oito caracteres, letras e número', () => {
    expect(erroSenha('Senha123')).toBeNull();
    expect(erroSenha('senha123')).not.toBeNull();
    expect(erroSenha('SenhaFraca')).not.toBeNull();
  });
});

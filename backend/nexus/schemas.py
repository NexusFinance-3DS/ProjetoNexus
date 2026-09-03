from datetime import date
from decimal import Decimal
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from .clock import today

Money = Annotated[Decimal, Field(gt=0, max_digits=12, decimal_places=2)]
Balance = Annotated[Decimal, Field(max_digits=12, decimal_places=2)]
Name = Annotated[str, Field(min_length=1, max_length=150)]
Password = Annotated[str, Field(min_length=8, max_length=128)]


class Input(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class Register(Input):
    nome: Name
    email: EmailStr
    senha: Password
    cpf: str | None = Field(default=None, max_length=14)
    data_nascimento: date | None = None

    @field_validator("cpf")
    @classmethod
    def cpf_valid(cls, v):
        if not v:
            return None
        v = "".join(c for c in v if c.isdigit())
        if len(v) != 11 or len(set(v)) == 1:
            raise ValueError("CPF inválido")
        for size in (9, 10):
            digit = (sum(int(v[i]) * (size + 1 - i) for i in range(size)) * 10) % 11
            if int(v[size]) != (0 if digit == 10 else digit):
                raise ValueError("CPF inválido")
        return v

    @field_validator("data_nascimento")
    @classmethod
    def born(cls, v):
        if v and v > today():
            raise ValueError("Nascimento não pode ser futuro")
        return v


class Login(Input):
    email: EmailStr
    senha: str = Field(min_length=1, max_length=128)


class Forgot(Input):
    email: EmailStr


class Recovery(Forgot):
    codigo: str = Field(min_length=16, max_length=128)


class Reset(Recovery):
    senha: Password


class ChangePassword(Input):
    senha_atual: str = Field(min_length=1, max_length=128)
    senha: Password


class Profile(Input):
    nome: Name
    telefone: str | None = Field(default=None, max_length=20)
    data_nascimento: date | None = None


class Address(Input):
    cep: str | None = Field(default=None, max_length=9)
    logradouro: str | None = Field(default=None, max_length=150)
    numero: str | None = Field(default=None, max_length=20)
    complemento: str | None = Field(default=None, max_length=100)
    bairro: str | None = Field(default=None, max_length=100)
    cidade: str | None = Field(default=None, max_length=100)
    estado: str | None = Field(default=None, pattern=r"^[A-Z]{2}$")


class Preferences(Input):
    notificacoes_ativas: bool = True
    tema: Literal["claro", "escuro", "sistema"] = "escuro"
    moeda: Literal["BRL"] = "BRL"


class Account(Input):
    nome: str = Field(min_length=1, max_length=100)
    id_tipo_conta: int = Field(gt=0)
    saldo_inicial: Balance = Decimal("0")
    ativa: bool = True


class Category(Input):
    nome: str = Field(min_length=1, max_length=100)
    id_tipo_transacao: int = Field(gt=0)
    icone: str = Field(default="category", max_length=100)
    cor: str = Field(default="#5145FF", pattern=r"^#[0-9A-Fa-f]{6}$")
    ativa: bool = True


class Transaction(Input):
    id_conta: int = Field(gt=0)
    id_categoria: int = Field(gt=0)
    id_tipo_transacao: int = Field(gt=0)
    id_status_transacao: int = Field(gt=0)
    descricao: str = Field(min_length=1, max_length=255)
    valor: Money
    data_transacao: date
    observacao: str | None = Field(default=None, max_length=10000)


class Goal(Input):
    nome: Name
    descricao: str | None = Field(default=None, max_length=10000)
    valor_objetivo: Money
    data_inicio: date = Field(default_factory=today)
    data_prazo: date | None = None
    status: Literal["em_andamento", "concluida", "cancelada"] = "em_andamento"

    @model_validator(mode="after")
    def dates(self):
        if self.data_prazo and self.data_prazo < self.data_inicio:
            raise ValueError("Prazo anterior ao início")
        return self


class GoalCreate(Goal):
    valor_inicial: Annotated[Decimal, Field(ge=0, max_digits=12, decimal_places=2)] = Decimal("0")


class Movement(Input):
    tipo: Literal["deposito", "retirada"]
    valor: Money
    data_movimentacao: date = Field(default_factory=today)
    descricao: str | None = Field(default=None, max_length=255)
    id_transacao: int | None = Field(default=None, gt=0)


class Recurrence(Input):
    id_transacao_origem: int = Field(gt=0)
    frequencia: Literal["diaria", "semanal", "mensal", "anual"]
    data_inicio: date
    data_fim: date | None = None
    ativa: bool = True

    @model_validator(mode="after")
    def dates(self):
        if self.data_fim and self.data_fim < self.data_inicio:
            raise ValueError("Fim anterior ao início")
        return self


class Report(Input):
    data_inicio: date
    data_fim: date
    formato: Literal["csv", "pdf", "xlsx"] = "csv"

    @model_validator(mode="after")
    def dates(self):
        if self.data_fim < self.data_inicio:
            raise ValueError("Período inválido")
        if (self.data_fim - self.data_inicio).days > 3660:
            raise ValueError("Período máximo de 10 anos")
        return self


class NotificationRead(Input):
    lida: bool = True

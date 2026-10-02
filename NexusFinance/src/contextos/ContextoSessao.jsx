import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { requisicaoApi } from "../servicos/api";
import { obterToken, removerToken, salvarToken } from "../servicos/sessao";
const ContextoSessao = createContext(null);
export function ProvedorSessao({
  children: filhos
}) {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    async function restaurarSessao() {
      const tokenSalvo = await obterToken();
      if (!tokenSalvo) {
        setCarregando(false);
        return;
      }
      try {
        const resposta = await requisicaoApi('/auth/sessao', {
          headers: {
            Authorization: `Bearer ${tokenSalvo}`
          }
        });
        setToken(tokenSalvo);
        setUsuario(resposta.usuario);
      } catch {
        await removerToken();
      } finally {
        setCarregando(false);
      }
    }
    restaurarSessao();
  }, []);
  async function iniciarSessao(novoToken, usuarioAuxiliar) {
    await salvarToken(novoToken);
    setToken(novoToken);
    setUsuario(usuarioAuxiliar);
  }
  async function encerrarSessao() {
    await removerToken();
    setToken(null);
    setUsuario(null);
  }
  const valor = useMemo(() => ({
    token,
    usuario,
    carregando,
    autenticado: Boolean(token),
    iniciarSessao,
    encerrarSessao,
    setUsuario
  }), [token, usuario, carregando]);
  return <ContextoSessao.Provider value={valor}>{filhos}</ContextoSessao.Provider>;
}
export function useSessao() {
  const contexto = useContext(ContextoSessao);
  if (!contexto) throw new Error("useSessao deve ser usado dentro de ProvedorSessao.");
  return contexto;
}

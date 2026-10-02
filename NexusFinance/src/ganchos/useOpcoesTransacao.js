import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { apiAutenticada } from "../servicos/financeiro";
export function useOpcoesTransacao(tipo) {
  const [categorias, setCategorias] = useState([]);
  const [tiposConta, setTiposConta] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [tipoContaId, setTipoContaId] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroOpcoes, setErroOpcoes] = useState('');
  const [erroArquivo, setErroArquivo] = useState('');
  const montado = useRef(true);
  const selecionando = useRef(false);
  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroOpcoes('');
    try {
      const resposta = await apiAutenticada(`/financeiro/opcoes?tipo=${tipo}`);
      if (!montado.current) return;
      setCategorias(resposta.categorias);
      setTiposConta(resposta.tiposConta);
      const preferido = tipo === 'Receita' ? 'Salário' : 'Alimentação';
      setCategoriaId(atual => resposta.categorias.some(item => item.id === atual) ? atual : resposta.categorias.find(item => item.nome === preferido)?.id || resposta.categorias[0]?.id || '');
      setTipoContaId(atual => resposta.tiposConta.some(item => item.id === atual) ? atual : resposta.tiposConta[0]?.id || '');
      if (!resposta.tiposConta.length) setErroOpcoes('Não há tipos de conta cadastrados no banco.');
    } catch (falha) {
      if (montado.current) setErroOpcoes(falha.message);
    } finally {
      if (montado.current) setCarregando(false);
    }
  }, [tipo]);
  useEffect(() => {
    montado.current = true;
    carregar();
    return () => {
      montado.current = false;
    };
  }, [carregar]);
  async function criarCategoria(nome) {
    const resposta = await apiAutenticada('/financeiro/categorias', {
      method: 'POST',
      body: JSON.stringify({
        tipo,
        nome
      })
    });
    if (!montado.current) return;
    setCategorias(atual => [...atual.filter(item => item.id !== resposta.categoria.id), resposta.categoria]);
    setCategoriaId(resposta.categoria.id);
  }
  async function selecionarArquivo() {
    if (selecionando.current) return;
    selecionando.current = true;
    setErroArquivo('');
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
        copyToCacheDirectory: true,
        base64: false
      });
      if (resultado.canceled || !montado.current) return;
      const selecionado = resultado.assets[0];
      if (selecionado.size === 0) throw new Error('O arquivo está vazio.');
      if (selecionado.size > 10 * 1024 * 1024) throw new Error('Escolha um arquivo de até 10 MB.');
      setArquivo(selecionado);
    } catch (falha) {
      if (montado.current) setErroArquivo(falha.message || 'Não foi possível abrir o arquivo.');
    } finally {
      selecionando.current = false;
    }
  }
  function prepararEnvio(valores) {
    if (carregando || erroOpcoes || !categoriaId || !tipoContaId) throw new Error('Selecione a categoria e o tipo de conta antes de salvar.');
    const dados = {
      ...valores,
      categoriaId,
      tipoContaId
    };
    if (!arquivo) return {
      method: 'POST',
      body: JSON.stringify(dados)
    };
    const formulario = new FormData();
    Object.entries(dados).forEach(([chave, valor]) => formulario.append(chave, String(valor ?? '')));
    if (Platform.OS === 'web') {
      formulario.append('arquivo', arquivo.file, arquivo.name);
    } else {
      formulario.append('arquivo', {
        uri: arquivo.uri,
        name: arquivo.name,
        type: arquivo.mimeType || 'application/octet-stream'
      });
    }
    return {
      method: 'POST',
      body: formulario
    };
  }
  return {
    categorias,
    tiposConta,
    categoriaId,
    setCategoriaId,
    tipoContaId,
    setTipoContaId,
    arquivo,
    removerArquivo: () => {
      setArquivo(null);
      setErroArquivo('');
    },
    carregando,
    erroOpcoes,
    erroArquivo,
    carregar,
    criarCategoria,
    selecionarArquivo,
    prepararEnvio
  };
}

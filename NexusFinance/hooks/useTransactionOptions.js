import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { apiAutenticada } from '../services/financeiro';

export function useTransactionOptions(tipo) {
  const [categorias, setCategorias] = useState([]);
  const [tiposConta, setTiposConta] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [tipoContaId, setTipoContaId] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroOpcoes, setErroOpcoes] = useState('');
  const [erroArquivo, setErroArquivo] = useState('');
  const mounted = useRef(true);
  const picking = useRef(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroOpcoes('');
    try {
      const response = await apiAutenticada(`/financeiro/opcoes?tipo=${tipo}`);
      if (!mounted.current) return;
      setCategorias(response.categorias);
      setTiposConta(response.tiposConta);
      const preferred = tipo === 'Receita' ? 'Salário' : 'Alimentação';
      setCategoriaId((current) => response.categorias.some((item) => item.id === current) ? current : (response.categorias.find((item) => item.nome === preferred)?.id || response.categorias[0]?.id || ''));
      setTipoContaId((current) => response.tiposConta.some((item) => item.id === current) ? current : (response.tiposConta[0]?.id || ''));
      if (!response.tiposConta.length) setErroOpcoes('Não há tipos de conta cadastrados no banco.');
    } catch (error) {
      if (mounted.current) setErroOpcoes(error.message);
    } finally { if (mounted.current) setCarregando(false); }
  }, [tipo]);

  useEffect(() => { mounted.current = true; carregar(); return () => { mounted.current = false; }; }, [carregar]);

  async function criarCategoria(nome) {
    const response = await apiAutenticada('/financeiro/categorias', { method: 'POST', body: JSON.stringify({ tipo, nome }) });
    if (!mounted.current) return;
    setCategorias((current) => [...current.filter((item) => item.id !== response.categoria.id), response.categoria]);
    setCategoriaId(response.categoria.id);
  }

  async function selecionarArquivo() {
    if (picking.current) return;
    picking.current = true;
    setErroArquivo('');
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: false, copyToCacheDirectory: true, base64: false });
      if (result.canceled || !mounted.current) return;
      const selected = result.assets[0];
      if (selected.size === 0) throw new Error('O arquivo está vazio.');
      if (selected.size > 10 * 1024 * 1024) throw new Error('Escolha um arquivo de até 10 MB.');
      setArquivo(selected);
    } catch (error) { if (mounted.current) setErroArquivo(error.message || 'Não foi possível abrir o arquivo.'); }
    finally { picking.current = false; }
  }

  function prepararEnvio(values) {
    if (carregando || erroOpcoes || !categoriaId || !tipoContaId) throw new Error('Selecione a categoria e o tipo de conta antes de salvar.');
    const data = { ...values, categoriaId, tipoContaId };
    if (!arquivo) return { method: 'POST', body: JSON.stringify(data) };
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => form.append(key, String(value ?? '')));
    if (Platform.OS === 'web') {
      form.append('arquivo', arquivo.file, arquivo.name);
    } else {
      form.append('arquivo', { uri: arquivo.uri, name: arquivo.name, type: arquivo.mimeType || 'application/octet-stream' });
    }
    return { method: 'POST', body: form };
  }

  return { categorias, tiposConta, categoriaId, setCategoriaId, tipoContaId, setTipoContaId, arquivo, removerArquivo: () => { setArquivo(null); setErroArquivo(''); }, carregando, erroOpcoes, erroArquivo, carregar, criarCategoria, selecionarArquivo, prepararEnvio };
}

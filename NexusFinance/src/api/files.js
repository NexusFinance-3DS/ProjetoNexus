import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { API_URL, authHeaders, api } from './client';
export async function download(path, filename) {
  if (Platform.OS === 'web') {
    const response = await fetch(API_URL + path, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Não foi possível baixar o arquivo.');
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else {
    const result = await FileSystem.downloadAsync(API_URL + path, FileSystem.cacheDirectory + filename, {
      headers: authHeaders()
    });
    if (result.status !== 200) throw new Error('Não foi possível baixar o arquivo.');
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(result.uri);else throw new Error('Compartilhamento indisponível neste aparelho.');
  }
}
export async function exportReport(period, format = 'pdf') {
  const report = await api('/relatorios', {
    method: 'POST',
    body: {
      ...period,
      formato: format
    }
  });
  await download(`/relatorios/${report.id_relatorio}/download`, `nexus-relatorio.${format}`);
}
export async function uploadAttachment(id, asset) {
  const body = new FormData();
  if (Platform.OS === 'web') body.append('arquivo', asset.file || (await (await fetch(asset.uri)).blob()), asset.name);else body.append('arquivo', {
    uri: asset.uri,
    name: asset.name,
    type: asset.mimeType || 'application/octet-stream'
  });
  return api(`/transacoes/${id}/anexos`, {
    method: 'POST',
    body
  });
}

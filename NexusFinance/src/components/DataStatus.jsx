import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFinance } from '../data/Finance';
import { apiStyles } from '../styles';
export default function DataStatus() {
  const {
    loading,
    error,
    refresh
  } = useFinance();
  if (loading) return <ActivityIndicator color="#5145FF" accessibilityLabel="Carregando dados" />;
  if (!error) return null;
  return <TouchableOpacity onPress={refresh}><Text style={apiStyles.error}>{error} Toque para tentar novamente.</Text></TouchableOpacity>;
}

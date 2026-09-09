import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { useAppStyles } from '../styles/styles';
import { apiAutenticada } from '../../services/financeiro';
import { exportarCSV } from '../../services/arquivos';
import { useTheme } from '../../contexts/ThemeContext';

export default function Configuracoes() {
  const { tema, alterarTema, salvandoTema, erroTema } = useTheme();
  const { colors, configuracoesStyles: styles, sharedStyles } = useAppStyles();
  const [notificacoes, setNotificacoes] = useState(true);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [erro, setErro] = useState('');
  useFocusEffect(useCallback(() => {
    let active = true;
    setCarregando(true);
    apiAutenticada('/configuracoes').then((data) => { if (active) { setNotificacoes(data.notificacoes); setErro(''); } }).catch((error) => active && setErro(error.message)).finally(() => active && setCarregando(false));
    return () => { active = false; };
  }, []));
  async function alterarNotificacoes(value) {
    if (salvando) return;
    setSalvando(true); setErro('');
    try { const data = await apiAutenticada('/configuracoes', { method: 'PUT', body: JSON.stringify({ notificacoes: value }) }); setNotificacoes(data.notificacoes); }
    catch (error) { setErro(error.message); }
    finally { setSalvando(false); }
  }
  async function exportar() {
    if (exportando) return;
    setExportando(true); setErro('');
    try { const { transacoes } = await apiAutenticada('/financeiro/transacoes'); await exportarCSV(transacoes); }
    catch (error) { setErro(error.message); }
    finally { setExportando(false); }
  }
  function item(icon, label, action, disabled = false) {
    return <TouchableOpacity accessibilityRole="button" style={styles.item} onPress={action} disabled={disabled}><View style={styles.itemLeft}><Icon name={icon} size={26} color={colors.primary} /><Text style={styles.itemText}>{label}</Text></View><Icon name="chevron-right" size={26} color={colors.textSecondary} /></TouchableOpacity>;
  }
  return <AnimatedScreen style={styles.container} delay={60}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sharedStyles.paddingBottom120}>
      {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
      <AnimatedCard style={styles.card} delay={40}>
        <Text style={styles.cardTitle}>Preferências</Text>
        <View style={styles.item}><View style={styles.itemLeft}><Icon name="notifications" size={26} color={colors.primary} /><Text style={styles.itemText}>Avisos financeiros no app</Text></View><Switch accessibilityLabel="Avisos financeiros no app" value={notificacoes} disabled={carregando || salvando} onValueChange={alterarNotificacoes} thumbColor={colors.onPrimary} trackColor={{ false: colors.switchOff, true: colors.primary }} /></View>
        <View style={styles.divider} />
        <View style={styles.item}><View style={styles.itemLeft}><Icon name={tema === 'escuro' ? 'dark-mode' : 'light-mode'} size={26} color={colors.primary} /><Text style={styles.itemText}>Aparência</Text></View></View>
        <View accessibilityRole="radiogroup" accessibilityLabel="Tema do aplicativo" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 18, paddingBottom: 18 }}>
          {[{ value: 'claro', label: 'Claro', icon: 'light-mode' }, { value: 'escuro', label: 'Escuro', icon: 'dark-mode' }].map((option) => <TouchableOpacity key={option.value} accessibilityRole="radio" accessibilityLabel={`Tema ${option.label.toLowerCase()}`} accessibilityState={{ checked: tema === option.value, disabled: salvandoTema }} disabled={salvandoTema} onPress={() => alterarTema(option.value)} style={{ flex: 1, minWidth: 100, minHeight: 50, borderRadius: 12, borderWidth: 1, borderColor: tema === option.value ? colors.primary : colors.border, backgroundColor: tema === option.value ? colors.primary : colors.input, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}><Icon name={option.icon} size={22} color={tema === option.value ? colors.onPrimary : colors.textPrimary} /><Text style={{ color: tema === option.value ? colors.onPrimary : colors.textPrimary, fontSize: 16 }}>{option.label}</Text></TouchableOpacity>)}
        </View>
        {salvandoTema ? <Text style={{ color: colors.textSecondary, marginHorizontal: 18, marginBottom: 12 }}>Salvando tema...</Text> : null}
        {erroTema ? <Text style={[sharedStyles.errorText, { marginHorizontal: 18 }]}>{erroTema}</Text> : null}
        <View style={styles.divider} />
        <View style={styles.item}><View style={styles.itemLeft}><Icon name="language" size={26} color={colors.primary} /><Text style={styles.itemText}>Idioma: Português (Brasil)</Text></View></View>
      </AnimatedCard>
      <AnimatedCard style={styles.card} delay={120}>
        <Text style={styles.cardTitle}>Conta</Text>
        {item('person-outline', 'Meu cadastro', () => router.push('/menus/meuCadastro'))}
        <View style={styles.divider} />
        {item('lock', 'Alterar senha', () => router.push('/auth/recuperarSenha'))}
      </AnimatedCard>
      <AnimatedCard style={styles.card} delay={180}>
        <Text style={styles.cardTitle}>Dados e ajuda</Text>
        {item('download', exportando ? 'Exportando...' : 'Exportar transações (CSV)', exportar, exportando)}
        <View style={styles.divider} />
        {item('picture-as-pdf', 'Relatórios em PDF', () => router.push('/relatorios'))}
        <View style={styles.divider} />
        {item('help-outline', 'Central de ajuda', () => router.push('/menus/centralAjuda'))}
        <View style={styles.divider} />
        {item('info', 'Sobre o aplicativo', () => router.push('/menus/sobreApp'))}
      </AnimatedCard>
    </ScrollView>
    <BarraNavegacao />
  </AnimatedScreen>;
}

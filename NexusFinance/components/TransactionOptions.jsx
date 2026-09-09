import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTheme, useThemedStyles } from '../contexts/ThemeContext';
import { FormInput, FormScrollView, KeyboardArea } from './FormLayout';

function OptionSelector({ label, items, value, onChange, disabled }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Pressable disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, expanded: open }} onPress={() => { Keyboard.dismiss(); setOpen(true); }} style={[styles.select, disabled && styles.disabled]}>
        <Text style={styles.value}>{items.find((item) => item.id === value)?.nome || 'Selecione uma opção'}</Text>
        <Icon name="expand-more" color={colors.textPrimary} size={24} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <View style={styles.heading}><Text style={styles.title}>{label}</Text><Pressable accessibilityRole="button" accessibilityLabel="Fechar opções" onPress={() => setOpen(false)} style={styles.iconButton}><Icon name="close" color={colors.textPrimary} size={24} /></Pressable></View>
            <ScrollView showsVerticalScrollIndicator>
              {items.map((item) => <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ checked: item.id === value }} onPress={() => { onChange(item.id); setOpen(false); }} style={styles.option}><Text style={styles.value}>{item.nome}</Text><Icon name={item.id === value ? 'radio-button-checked' : 'radio-button-unchecked'} color={item.id === value ? colors.textLink : colors.textMuted} size={23} /></Pressable>)}
              {!items.length && <Text style={styles.caption}>Nenhuma opção cadastrada.</Text>}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

export function TransactionSelectors({ options, disabled, showAccountType = true }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [saving, setSaving] = useState(false);
  async function salvarCategoria() {
    if (saving) return;
    if (nome.trim().length < 2) { setErro('Informe pelo menos 2 caracteres.'); return; }
    setSaving(true); setErro('');
    try { await options.criarCategoria(nome); setOpen(false); setNome(''); }
    catch (error) { setErro(error.message); }
    finally { setSaving(false); }
  }
  return (
    <View style={styles.fields}>
      {options.carregando && <ActivityIndicator color={colors.textLink} accessibilityLabel="Carregando opções" />}
      {options.erroOpcoes ? <View><Text style={styles.error}>{options.erroOpcoes}</Text><Pressable accessibilityRole="button" onPress={options.carregar} disabled={options.carregando} style={styles.retry}><Text style={styles.link}>Tentar novamente</Text></Pressable></View> : null}
      {showAccountType && <OptionSelector label="Tipo de conta" items={options.tiposConta} value={options.tipoContaId} onChange={options.setTipoContaId} disabled={disabled || options.carregando} />}
      <OptionSelector label="Categoria" items={options.categorias} value={options.categoriaId} onChange={options.setCategoriaId} disabled={disabled || options.carregando} />
      <Pressable accessibilityRole="button" disabled={disabled || options.carregando || !!options.erroOpcoes} onPress={() => { Keyboard.dismiss(); setErro(''); setNome(''); setOpen(true); }} style={styles.add}><Icon name="add-circle-outline" color={colors.textLink} size={21} /><Text style={styles.link}>Adicionar nova categoria</Text></Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => { if (!saving) setOpen(false); }}>
        <KeyboardArea modal style={styles.modalBackground}>
          <FormScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.categoryDialog}>
              <Text style={styles.title}>Nova categoria</Text>
              <Text style={styles.label}>Nome da categoria</Text>
              <FormInput accessibilityLabel="Nome da categoria" placeholder="Ex.: Trabalho extra" placeholderTextColor={colors.placeholder} value={nome} onChangeText={setNome} maxLength={100} style={styles.nameInput} editable={!saving} />
              <Text style={styles.caption}>Ficará disponível nas suas próximas transações deste tipo.</Text>
              {erro ? <Text style={styles.error}>{erro}</Text> : null}
              <View style={styles.actions}><Pressable disabled={saving} accessibilityRole="button" onPress={() => setOpen(false)} style={styles.secondary}><Text style={styles.value}>Cancelar</Text></Pressable><Pressable disabled={saving} accessibilityRole="button" onPress={salvarCategoria} style={styles.primary}><Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Salvar categoria'}</Text></Pressable></View>
            </View>
          </FormScrollView>
        </KeyboardArea>
      </Modal>
    </View>
  );
}

export function TransactionAttachment({ options, disabled }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return <View style={styles.fields}>
    <Text style={styles.label}>Arquivo (opcional)</Text>
    <View style={styles.attachment}>
      <Pressable accessibilityRole="button" accessibilityLabel={options.arquivo ? 'Trocar arquivo' : 'Adicionar arquivo'} disabled={disabled} onPress={options.selecionarArquivo} style={styles.fileButton}><Icon name="attach-file" size={23} color={colors.textPrimary} /><View style={styles.fileText}><Text style={styles.value}>{options.arquivo?.name || 'Adicionar arquivo'}</Text><Text style={styles.caption}>{options.arquivo ? `${Math.ceil((options.arquivo.size || 0) / 1024)} KB · Toque para trocar` : 'Até 10 MB'}</Text></View></Pressable>
      {options.arquivo && <Pressable accessibilityRole="button" accessibilityLabel="Remover arquivo" disabled={disabled} onPress={options.removerArquivo} style={styles.iconButton}><Icon name="close" color={colors.danger} size={23} /></Pressable>}
    </View>
    {options.erroArquivo ? <Text style={styles.error}>{options.erroArquivo}</Text> : null}
  </View>;
}

const createStyles = (colors) => StyleSheet.create({
  fields: { paddingHorizontal: 16, marginBottom: 12 },
  label: { color: colors.textPrimary, fontSize: 16, marginLeft: 10, marginBottom: 6 },
  select: { minHeight: 50, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.input, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  value: { color: colors.textPrimary, fontSize: 15, flexShrink: 1 },
  disabled: { opacity: 0.5 },
  add: { flexDirection: 'row', gap: 8, alignItems: 'center', minHeight: 44 },
  link: { color: colors.textLink, fontSize: 15, flexShrink: 1 },
  retry: { minHeight: 44, justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 24 },
  dialog: { width: '100%', maxWidth: 520, maxHeight: '80%', alignSelf: 'center', borderRadius: 18, padding: 18, backgroundColor: colors.surface },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { color: colors.textPrimary, fontSize: 21, fontWeight: '600', flexShrink: 1, marginBottom: 14 },
  iconButton: { width: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, minHeight: 52, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.divider },
  modalBackground: { backgroundColor: colors.overlay },
  modalContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  categoryDialog: { width: '100%', maxWidth: 520, alignSelf: 'center', padding: 20, backgroundColor: colors.surface, borderRadius: 18 },
  nameInput: { color: colors.textPrimary, fontSize: 16, backgroundColor: colors.input, borderRadius: 10, paddingHorizontal: 12 },
  caption: { color: colors.textSecondary, fontSize: 12, marginTop: 5, marginBottom: 8 },
  error: { color: colors.danger, fontSize: 14, marginVertical: 10 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  secondary: { flexGrow: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', padding: 10 },
  primary: { flexGrow: 1, minHeight: 48, backgroundColor: colors.primary, borderRadius: 10, padding: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.onPrimary, fontSize: 15, fontWeight: '600' },
  attachment: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.input, borderRadius: 10 },
  fileButton: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, minHeight: 60 },
  fileText: { flex: 1, minWidth: 0 },
});

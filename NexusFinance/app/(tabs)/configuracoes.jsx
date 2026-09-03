import { useFinance } from '../../src/data/Finance';
import { api } from '../../src/api/client';
import { download } from '../../src/api/files';
import { apiStyles, settingsContentStyle, bottomSpacerStyle, configuracoesStyles as styles } from '../../src/styles';
import React, { useState } from "react";
import BarraNavegacao from '../../src/components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
export default function Configuracoes() {
  const finance = useFinance();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  React.useEffect(() => {
    setNotificacoes(finance.configuracoes.notificacoes_ativas ?? true);
    setTemaEscuro(finance.configuracoes.tema !== 'claro');
  }, [finance.configuracoes]);
  const salvar = async changes => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await api('/configuracoes', {
        method: 'PUT',
        body: {
          notificacoes_ativas: notificacoes,
          tema: temaEscuro ? 'escuro' : 'claro',
          moeda: 'BRL',
          ...changes
        }
      });
      await finance.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(true);
  return <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={settingsContentStyle}>
        <AnimatedCard style={styles.card} delay={40}>
          <Text style={styles.cardTitle}>Preferências</Text>

          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="notifications" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Notificações</Text>
            </View>

            <Switch value={notificacoes} disabled={busy} onValueChange={value => salvar({
            notificacoes_ativas: value
          })} thumbColor="#FFF" trackColor={{
            false: "#555",
            true: "#5145FF"
          }} />
          </View>

          <View style={styles.divider} />

          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="dark-mode" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Tema escuro</Text>
            </View>

            <Switch value={temaEscuro} disabled={busy} onValueChange={value => salvar({
            tema: value ? "escuro" : "claro"
          })} thumbColor="#FFF" trackColor={{
            false: "#555",
            true: "#5145FF"
          }} />
          </View>
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={120}>
          <Text style={styles.cardTitle}>Conta</Text><TouchableOpacity style={styles.item} onPress={() => router.push("/contas")}><Text style={styles.itemText}>Contas financeiras</Text></TouchableOpacity><TouchableOpacity style={styles.item} onPress={() => router.push("/recorrencias")}><Text style={styles.itemText}>Recorrências</Text></TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => router.push('/menus/alterarSenha')}>
            <View style={styles.itemLeft}>
              <Icon name="lock" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Alterar senha</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item} onPress={() => setError('O aplicativo está disponível em português.')}>
            <View style={styles.itemLeft}>
              <Icon name="language" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Idioma</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item} onPress={() => setError('Os seus dados são privados e vinculados à sua conta. Você pode exportá-los em Backup dos dados.')}>
            <View style={styles.itemLeft}>
              <Icon name="security" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Privacidade</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={180}>
          <Text style={styles.cardTitle}>Sistema</Text>

          <TouchableOpacity style={styles.item} onPress={() => download('/backup', 'nexus-backup.zip').catch(e => setError(e.message))}>
            <View style={styles.itemLeft}>
              <Icon name="backup" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Backup dos dados</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item} onPress={() => router.push('/relatorios')}>
            <View style={styles.itemLeft}>
              <Icon name="download" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Exportar dados</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item} onPress={() => router.push('/menus/sobreApp')}>
            <View style={styles.itemLeft}>
              <Icon name="info" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Sobre o aplicativo</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item} onPress={() => setError('A avaliação estará disponível quando o aplicativo for publicado na loja.')}>
            <View style={styles.itemLeft}>
              <Icon name="star" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Avaliar aplicativo</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>
        </AnimatedCard>

        {!!error && <Text style={apiStyles.error}>{error}</Text>}<View style={bottomSpacerStyle} />
      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>;
}

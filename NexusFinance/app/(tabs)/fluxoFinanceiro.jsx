import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/fluxoFinanceiro';
import barraNavegacao from '../styles/barraNavegacao';

export default function fluxoFinanceiro() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState('Geral');

  const transacoes = useMemo(
    () => [
      { id: '1', descricao: 'Netflix', categoria: 'Assinatura', tipo: 'Despesas', valor: 29.9, data: '12 Jul' },
      { id: '2', descricao: 'Salário', categoria: 'Renda', tipo: 'Receitas', valor: 4500.0, data: '10 Jul' },
      { id: '3', descricao: 'Conta de luz', categoria: 'Serviços', tipo: 'Despesas', valor: 120.2, data: '08 Jul' },
      { id: '4', descricao: 'Venda de itens', categoria: 'Outros', tipo: 'Receitas', valor: 250.0, data: '06 Jul' },
      { id: '5', descricao: 'Alimentação', categoria: 'Mercado', tipo: 'Despesas', valor: 86.75, data: '04 Jul' },
    ],
    []
  );

  const totalReceitas = useMemo(
    () => transacoes.filter(item => item.tipo === 'Receitas').reduce((sum, item) => sum + item.valor, 0),
    [transacoes]
  );

  const totalDespesas = useMemo(
    () => transacoes.filter(item => item.tipo === 'Despesas').reduce((sum, item) => sum + item.valor, 0),
    [transacoes]
  );

  const transacoesFiltradas = useMemo(
    () =>
      abaSelecionada === 'Geral'
        ? transacoes
        : transacoes.filter(item => item.tipo === abaSelecionada),
    [abaSelecionada, transacoes]
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        <View style={styles.filtroContainer}>
          {['Geral', 'Receitas', 'Despesas'].map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.botaoFiltro, abaSelecionada === option && styles.botaoAtivo]}
              onPress={() => setAbaSelecionada(option)}
            >
              <Text style={[styles.textoFiltro, abaSelecionada === option && styles.textoAtivo]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Saldo</Text>
            <Text style={styles.resumoValue}>R$ {(totalReceitas - totalDespesas).toFixed(2)}</Text>
          </View>
          <View style={styles.resumoCard}> 
            <Text style={styles.resumoLabel}>Receitas</Text>
            <Text style={styles.resumoValue}>R$ {totalReceitas.toFixed(2)}</Text>
          </View>
          <View style={styles.resumoCard}> 
            <Text style={styles.resumoLabel}>Despesas</Text>
            <Text style={styles.resumoValue}>R$ {totalDespesas.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.dados}>
          <Text style={styles.dadosTitulo}>{abaSelecionada === 'Geral' ? 'Transações Recentes' : abaSelecionada}</Text>
          {transacoesFiltradas.map(item => (
            <View key={item.id} style={styles.transacaoItem}>
              <View>
                <Text style={styles.transacaoDescricao}>{item.descricao}</Text>
                <Text style={styles.transacaoCategoria}>{item.categoria}</Text>
              </View>
              <View style={styles.transacaoDireita}>
                <Text style={[styles.transacaoValor, item.tipo === 'Receitas' ? styles.receita : styles.despesa]}>
                  {item.tipo === 'Receitas' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                </Text>
                <Text style={styles.transacaoData}>{item.data}</Text>
              </View>
            </View>
          ))}

          {transacoesFiltradas.length === 0 && (
            <Text style={styles.dadosTexto}>Nenhuma transação encontrada para essa categoria.</Text>
          )}
        </View>
      </ScrollView>

      {/* Menu expandido */}
            {menuAberto && (
              <View style={barraNavegacao.menuExpandido}>
                <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => router.push('/receita/novaReceita')}>
                  <Icon name="attach-money" size={30} color="#fff" />
                  <Text style={barraNavegacao.tabLabel}>Receitas</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => router.push('/despesa/novaDespesa')}>
                  <Icon name="receipt" size={30} color="#fff" />
                  <Text style={barraNavegacao.tabLabel}>Despesas</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={barraNavegacao.itemMenu}>
                  <Icon name="swap-horiz" size={30} color="#fff" />
                  <Text style={barraNavegacao.tabLabel}>Transações</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={barraNavegacao.itemMenu}>
                  <Icon name="category" size={30} color="#fff" />
                  <Text style={barraNavegacao.tabLabel}>Categoria</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={barraNavegacao.itemMenu}>
                  <Icon name="flag" size={30} color="#fff" />
                  <Text style={barraNavegacao.tabLabel}>Metas</Text>
                </TouchableOpacity>
              </View>
            )}
      
            {/* Barra de navegação inferior */}
            <View style={barraNavegacao.tabBar}>
              <TouchableOpacity
                style={barraNavegacao.tabItem}
                onPress={() => router.push('/inicial')}
                activeOpacity={0.8}
              >
                <Icon name="home" size={32} color="#ffffff" />
                <Text style={barraNavegacao.tabLabel}>Início</Text>
              </TouchableOpacity>
      
              <TouchableOpacity
                style={barraNavegacao.tabItem}
                onPress={() => router.push('/fluxoFinanceiro')}
                activeOpacity={0.8}
              >
                <Icon name="swap-horiz" size={32} color="#ffffff" />
                <Text style={barraNavegacao.tabLabel}>Fluxo</Text>
              </TouchableOpacity>
      
              <TouchableOpacity
                style={barraNavegacao.tabItem}
                onPress={() => setMenuAberto(!menuAberto)}
                activeOpacity={0.8}
              >
                <Icon
                  name={menuAberto ? "close" : "add-circle"}
                  size={56}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={barraNavegacao.tabItem}
                onPress={() => router.push('/metas')}
                activeOpacity={0.8}
              >
                <Icon name="radar" size={32} color="#ffffff" />
                <Text style={barraNavegacao.tabLabel}>Metas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={barraNavegacao.tabItem}
                onPress={() => router.push('/dashboard')}
                activeOpacity={0.8}
              >
                <Icon name="menu" size={32} color="#ffffff" />
                <Text style={barraNavegacao.tabLabel}>mais</Text>
              </TouchableOpacity>
            </View>
    </View>
  );
}
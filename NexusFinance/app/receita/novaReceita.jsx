import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Switch, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/novaReceita';
import barraNavegacao from '../styles/barraNavegacao';

export default function novaReceita() {
    const [menuAberto, setMenuAberto] = useState(null);
    const [valor, setValor] = useState("");
    const [descricao, setdescricao] = useState("");
    const [data, setData] = useState('');
    const [categoria, setCategoria] = useState('Salário');
    const [conta, setConta] = useState('Conta Corrente');
    const [receitaFixa, setReceitaFixa] = useState(false);
    const [observacao, setObservacao] = useState('');
    const [anexo, setAnexo] = useState('');

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <View style={styles.addValor}>
                    <Text style={styles.titulo}>Adicione o valor:</Text>
                    <TextInput
                        style={[styles.InputValor, { textAlign: 'right' }]}
                        value={valor}
                        onChangeText={(texto) => setValor(texto)}
                        keyboardType="numeric"
                        placeholder="R$ 0,00"
                        placeholderTextColor="#3f3f3f"
                    />

                </View>
                <View style={styles.inputFull}>
                    <Text style={{ color: "#fff", marginLeft: 10, marginBottom: 5, fontSize: 16, }}>Descrição</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Descrição:"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        value={descricao}
                        onChangeText={setdescricao}
                    />
                </View>

                <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
                    <View style={styles.iconBox}><Icon name="event" size={20} color="#fff" /></View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.listItemText}>Data</Text>
                        <Text style={styles.listItemSub}>{data || 'Selecione a data'}</Text>
                    </View>
                    <Icon name="calendar-today" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
                    <View style={styles.iconBox}><Icon name="label" size={20} color="#fff" /></View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.listItemText}>Categoria</Text>
                        <Text style={styles.listItemSub}>{categoria}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
                    <View style={styles.iconBox}><Icon name="account-balance" size={20} color="#fff" /></View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.listItemText}>Conta</Text>
                        <Text style={styles.listItemSub}>{conta}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

                <View style={styles.listItem}
                >
                    <View style={styles.iconBox}><Icon name="gavel" size={20} color="#fff" /></View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.listItemText}>Receita fixa</Text>
                        <Text style={styles.listItemSub}>Receita recorrente mensal</Text>
                    </View>
                    <Switch value={receitaFixa} onValueChange={setReceitaFixa} />
                </View>

                <View style={styles.inputFull}>
                    <Text style={{ color: "#fff", marginLeft: 10, marginBottom: 5, fontSize: 16, }}>Observação (opcional)</Text>
                    <TextInput
                        style={[styles.input, { height: 90 }]}
                        placeholder="Observação"
                        placeholderTextColor="#999"
                        multiline
                        value={observacao}
                        onChangeText={setObservacao}
                    />
                </View>

                <TouchableOpacity style={styles.listItem} activeOpacity={0.8} onPress={() => Alert.alert('Anexar', 'Funcionalidade de anexar ainda não implementada')}>
                    <View style={styles.iconBox}><Icon name="attach-file" size={20} color="#fff" /></View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.listItemText}>Anexar</Text>
                        <Text style={styles.listItemSub}>{anexo || 'Nenhum arquivo'}</Text>
                    </View>
                    <Icon name="cloud-upload" size={20} color="#999" />
                </TouchableOpacity>

                <View style={styles.saveWrapper}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        activeOpacity={0.8}

                    >
                        <Text style={styles.saveButtonText}>Salvar receita</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Menu expandido */}
            {menuAberto != null && (
                <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
                    <View style={barraNavegacao.overlay} />
                </TouchableWithoutFeedback>
            )}

            {menuAberto === 'add' && (
                <View style={barraNavegacao.menuExpandido}>
                    <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/receita/novaReceita'); }}>
                        <Icon name="attach-money" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Receitas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/despesa/novaDespesa'); }}>
                        <Icon name="receipt" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Despesas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/transacoes'); }}>
                        <Icon name="swap-horiz" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Transações</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/categoria'); }}>
                        <Icon name="category" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Categoria</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/metas'); }}>
                        <Icon name="flag" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Metas</Text>
                    </TouchableOpacity>
                </View>
            )}

            {menuAberto === 'more' && (
                <View style={barraNavegacao.menuExpandido}>
                    <TouchableOpacity
                        style={barraNavegacao.itemMenu}
                        onPress={() => {
                            setMenuAberto(null);
                            router.push('/dashboard');
                        }}
                    >
                        <Icon name="menu" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Dashboard</Text>
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
                    onPress={() => setMenuAberto(menuAberto === 'add' ? null : 'add')}
                    activeOpacity={0.8}
                >
                    <Icon
                        name={menuAberto != null ? "close" : "add-circle"}
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
                    onPress={() => setMenuAberto(menuAberto === 'more' ? null : 'more')}
                    activeOpacity={0.8}
                >
                    <Icon name="menu" size={32} color="#ffffff" />
                    <Text style={barraNavegacao.tabLabel}>mais</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
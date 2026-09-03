import React, { useState } from 'react';
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { keyboardStyles, novaDespesaStyles as styles, sharedStyles } from '../styles/styles';

export default function NovaDespesa() {
    const [valor, setValor] = useState("");
    const [descricao, setdescricao] = useState("");
    const [data, setData] = useState('');
    const [categoria, setCategoria] = useState('Salário');
    const [conta, setConta] = useState('Conta Corrente');
    const [despesaFixa, setDespesaFixa] = useState(false);
    const [status, setStatus] = useState(false);
    const [observacao, setObservacao] = useState('');
    const [anexo, setAnexo] = useState('');

    return (
        <AnimatedScreen style={styles.container} delay={60}>
            <KeyboardAvoidingView
                style={keyboardStyles.avoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
            <ScrollView
                contentContainerStyle={keyboardStyles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.addValor}>
                    <Text style={styles.titulo}>Adicione o valor:</Text>
                    <TextInput
                        style={[styles.InputValor, sharedStyles.textAlignRight]}
                        value={valor}
                        onChangeText={(texto) => setValor(texto)}
                        keyboardType="numeric"
                        placeholder="R$ 0,00"
                        placeholderTextColor="#3f3f3f"
                    />

                </View>
                <View style={styles.inputFull}>

                    <Text style={sharedStyles.formLabel}>Descrição</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Descrição:"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        value={descricao}
                        onChangeText={setdescricao}
                    />
                </View>
                <View style={styles.listItem}
                >
                    <View style={styles.iconBox}><Icon name="gavel" size={20} color="#fff" /></View>
                    <View style={sharedStyles.flex}>
                        <Text style={styles.listItemText}>Status</Text>
                        <Text style={styles.listItemSub}>Não pago</Text>
                    </View>
                    <Switch value={status} onValueChange={setStatus} />
                </View>

                <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
                    <View style={styles.iconBox}><Icon name="event" size={20} color="#fff" /></View>
                    <View style={sharedStyles.flex}>
                        <Text style={styles.listItemText}>Data</Text>
                        <Text style={styles.listItemSub}>{data || 'Selecione a data'}</Text>
                    </View>
                    <Icon name="calendar-today" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
                    <View style={styles.iconBox}><Icon name="label" size={20} color="#fff" /></View>
                    <View style={sharedStyles.flex}>
                        <Text style={styles.listItemText}>Categoria</Text>
                        <Text style={styles.listItemSub}>{categoria}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
                    <View style={styles.iconBox}><Icon name="account-balance" size={20} color="#fff" /></View>
                    <View style={sharedStyles.flex}>
                        <Text style={styles.listItemText}>Conta</Text>
                        <Text style={styles.listItemSub}>{conta}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

                <View style={styles.listItem}
                >
                    <View style={styles.iconBox}><Icon name="gavel" size={20} color="#fff" /></View>
                    <View style={sharedStyles.flex}>
                        <Text style={styles.listItemText}>Despesa fixa</Text>
                        <Text style={styles.listItemSub}>Despesa recorrente mensal</Text>
                    </View>
                    <Switch value={despesaFixa} onValueChange={setDespesaFixa} />
                </View>

                <View style={styles.inputFull}>
                    <Text style={sharedStyles.formLabel}>Observação (opcional)</Text>
                    <TextInput
                        style={[styles.input, sharedStyles.multilineInput]}
                        placeholder="Observação"
                        placeholderTextColor="#999"
                        multiline
                        value={observacao}
                        onChangeText={setObservacao}
                    />
                </View>

                <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
                    <View style={styles.iconBox}><Icon name="attach-file" size={20} color="#fff" /></View>
                    <View style={sharedStyles.flex}>
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
                        <Text style={styles.saveButtonText}>Salvar despesa</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>

      <BarraNavegacao />
        </AnimatedScreen>
    );
}

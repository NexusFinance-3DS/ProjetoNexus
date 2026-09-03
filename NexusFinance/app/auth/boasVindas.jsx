import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { boasVindasStyles as styles } from "../styles/styles";

export default function boasVindas() {

    function criarConta() {
        router.push("/auth/cadastro");
    }

    return (
        <AnimatedScreen style={styles.tela} delay={60}>
            <Image
                source={require("../../assets/images/moedas.png")}
                style={styles.illustration}
            />
            <AnimatedCard style={styles.card} delay={80}>
            <Text style={styles.titulo}>Organize seus gastos de uma maneira mais eficiente!</Text>
            <Text style={styles.subtitulo}>Controle seu orçamento e alcance suas metas financeiras com facilidade.</Text>

            <TouchableOpacity style={styles.botao} onPress={criarConta}>
                <Text style={styles.textoBotao}>Criar Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.link}>Já tenho uma conta</Text>
            </TouchableOpacity>
            </AnimatedCard>
        </AnimatedScreen>
    );
}

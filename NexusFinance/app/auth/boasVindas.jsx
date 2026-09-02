import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import styles from "../styles/boasVindas";

export default function boasVindas() {

    function criarConta() {
        router.push("/auth/cadastro");
    }

    return (
        <AnimatedScreen style={styles.tela} delay={60}>
            <Image
                source={require("../../assets/images/moedas.png")}
                style={{
                    alignSelf: "center",
                    width: 200,
                    height: 180,
                    marginBottom: 60,
                }}
            />
            <AnimatedCard style={{backgroundColor: "#171717a5", borderRadius: 20, alignItems: "center",}} delay={80}>
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
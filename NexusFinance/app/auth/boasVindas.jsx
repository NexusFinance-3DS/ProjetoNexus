import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import styles from "../styles/boasVindas";

export default function boasVindas() {

    function criarConta() {
        router.push("/auth/cadastro");
    }

    return (
        <View style={styles.tela}>
            <Image
                source={require("../../assets/images/moedas.png")}
                style={{
                    alignSelf: "center",
                    width: 200,
                    height: 180,
                    marginBottom: 60,
                }}
            />
            <View style={{backgroundColor: "#171717a5", borderRadius: 20, alignItems: "center",}}>
            <Text style={styles.titulo}>Organize seus gastos de uma maneira mais eficiente!</Text>
            <Text style={styles.subtitulo}>Controle seu orçamento e alcance suas metas financeiras com facilidade.</Text>

            <TouchableOpacity style={styles.botao} onPress={criarConta}>
                <Text style={styles.textoBotao}>Criar Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.link}>Já tenho uma conta</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
}
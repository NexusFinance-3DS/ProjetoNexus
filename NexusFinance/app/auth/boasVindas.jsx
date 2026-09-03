import { welcomeLogoStyle, welcomeCardStyle, boasVindasStyles as styles } from '../../src/styles';
import { Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
export default function BoasVindas() {
  function criarConta() {
    router.push("/auth/cadastro");
  }
  return <AnimatedScreen style={styles.tela} delay={60}>
            <Image source={require("../../assets/images/moedas.png")} style={welcomeLogoStyle} />
            <AnimatedCard style={welcomeCardStyle} delay={80}>
            <Text style={styles.titulo}>Organize seus gastos de uma maneira mais eficiente!</Text>
            <Text style={styles.subtitulo}>Controle seu orçamento e alcance suas metas financeiras com facilidade.</Text>

            <TouchableOpacity style={styles.botao} onPress={criarConta}>
                <Text style={styles.textoBotao}>Criar Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.link}>Já tenho uma conta</Text>
            </TouchableOpacity>
            </AnimatedCard>
        </AnimatedScreen>;
}

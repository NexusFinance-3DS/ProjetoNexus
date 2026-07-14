import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function inicial() {

  const roteador = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Inicio do projeto nexus, que comecem os jogos!</Text>
      
    </View>
  );
}

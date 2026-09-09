import Constants from "expo-constants";
import { Platform } from "react-native";

function getApiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }

  if (Platform.OS === "web") return "http://localhost:3000";

  const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];
  if (expoHost) return `http://${expoHost}:3000`;

  return Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";
}

export const API_URL = getApiUrl();

export async function apiRequest(path, options = {}) {
  let response;
  const multipart = typeof FormData !== "undefined" && options.body instanceof FormData;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(multipart ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(`Não foi possível conectar ao servidor em ${API_URL}. Verifique se o backend está ligado.`);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensagem || "Não foi possível concluir a operação.");
  }

  return data;
}

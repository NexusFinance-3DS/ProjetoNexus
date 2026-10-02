import { Redirect } from 'expo-router';
import { useSessao } from "../contextos/ContextoSessao";
export default function Inicio() {
  const {
    autenticado
  } = useSessao();
  return <Redirect href={autenticado ? '/inicial' : '/auth/boasVindas'} />;
}

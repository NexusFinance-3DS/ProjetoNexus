import { useLocalSearchParams } from 'expo-router';
import TransactionForm from '../../src/components/TransactionForm';
export default function EditarReceita() {
  const {
    id
  } = useLocalSearchParams();
  return <TransactionForm kind="Receita" id={id} />;
}

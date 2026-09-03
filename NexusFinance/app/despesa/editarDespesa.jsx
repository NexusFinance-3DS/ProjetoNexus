import { useLocalSearchParams } from 'expo-router';
import TransactionForm from '../../src/components/TransactionForm';
export default function EditarDespesa() {
  const {
    id
  } = useLocalSearchParams();
  return <TransactionForm kind="Despesa" id={id} />;
}

import { Redirect } from 'expo-router';
import { useSession } from '../src/data/Session';
export default function Index() {
  const {
    user
  } = useSession();
  return <Redirect href={user ? '/inicial' : '/auth/boasVindas'} />;
}

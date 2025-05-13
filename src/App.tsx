import './App.css'
import SignInPage from './login'
import HomePage from './home';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { CounterProvider } from './contexts/CounterContext';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (loading) {
    return <div className='flex min-h-screen w-full flex-col bg-gray-900 to-black text-gray-100 justify-center items-center'>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <CounterProvider>
      {user ? <HomePage /> : <SignInPage />}
    </CounterProvider>
  )
}

export default App

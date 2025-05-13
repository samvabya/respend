import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import  app  from './base';


const SignInPage: React.FC = () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

 const handleGoogleSignIn = async () => {
 
  await signInWithPopup(auth, provider).then(async (result) => {
        const user = result.user;

        const db = getFirestore(app);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
 await setDoc(userRef, {
            userId: user.uid,
            name: user.displayName,
            email: user.email,
            income: 0,
            expense: 0,
 });
        }
        console.log("Signed in with Google:", result.user);
      })
      .catch((error) => {
        console.error("Google Sign-in error:", error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 to-black font-poppins">
      <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Welcome</h2>
        <div className="space-y-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-700 rounded-full shadow-lg text-lg font-medium text-white bg-gray-700 hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/355037/google.svg" alt="Google logo" />
            Sign in with Google
          </button>
        </div>
        <p className="mt-8 text-center text-gray-400 text-sm">
        To continue with Respend sign in with your Google account. <a href="#" className="text-blue-400 hover:underline">Learn more</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
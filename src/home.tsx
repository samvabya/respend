import { Overview } from "./components/overview"
import { RecentTransactions } from "./components/recent-transactions"
import { QuickAddForm } from "./components/quick-add-form"
import { CategoryBreakdown } from "./components/category-breakdown"
import { getAuth, signOut } from "firebase/auth"
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import app from "./base"
import { useCounter } from "./contexts/CounterContext"

export default function HomePage() {
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<number>(0);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const { count } = useCounter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
          const tref = collection(db, `users/${user.uid}/transactions`)
          const snapshot = await getDocs(tref)
          setTransactions(snapshot.size)
        }
        console.log("User data:", userData);
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [count]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Respend
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            
            <button onClick={handleLogout} className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-600/10 rounded-md transition-all">
              Log Out
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-6 px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative rounded-xl bg-gray-900/50 p-5 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-purple-500/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-600/0 opacity-50"></div>
              <div className="absolute inset-0 border border-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-gray-300">Total Balance</h3>
                <div className="rounded-full bg-purple-500/20 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-purple-500"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  $ {userData?.income - userData?.expense}
                </div>
                <p className="text-xs text-gray-400">+0.0% from last month</p>
              </div>
            </div>
            <div className="relative rounded-xl bg-gray-900/50 p-5 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-green-500/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-600/0 opacity-50"></div>
              <div className="absolute inset-0 border border-green-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-gray-300">Income</h3>
                <div className="rounded-full bg-green-500/20 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-green-500"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <div className="text-2xl font-bold text-green-500">$ {userData?.income ?? 0.0}</div>
                <p className="text-xs text-gray-400">+0.0% from last month</p>
              </div>
            </div>
            <div className="relative rounded-xl bg-gray-900/50 p-5 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-rose-500/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 to-rose-600/0 opacity-50"></div>
              <div className="absolute inset-0 border border-rose-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-gray-300">Expenses</h3>
                <div className="rounded-full bg-rose-500/20 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-rose-500"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <div className="text-2xl font-bold text-rose-500">$ {userData?.expense ?? 0.0}</div>
                <p className="text-xs text-gray-400">+0.0% from last month</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7 mt-6">
            <div className="md:col-span-2 lg:col-span-3 relative rounded-xl bg-gray-900/50 p-5 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-purple-500/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-600/0 opacity-50"></div>
              <div className="absolute inset-0 border border-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-row items-center mb-4">
                <div className="grid gap-1">
                  <h2 className="text-lg font-semibold text-white">Quick Add</h2>
                  <p className="text-sm text-gray-400">Add a new transaction quickly</p>
                </div>
                <button className="ml-auto flex items-center gap-1 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Add
                </button>
              </div>
              <div className="relative">
                <QuickAddForm />
              </div>
            </div>
            <div className="md:col-span-1 lg:col-span-4 relative rounded-xl bg-gray-900/50 p-5 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-purple-500/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-600/0 opacity-50"></div>
              <div className="absolute inset-0 border border-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative mb-4">
                <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                <p className="text-sm text-gray-400">You have made {transactions} transactions this month</p>
              </div>
              <div className="relative">
                <RecentTransactions />
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
            <div className="md:col-span-1 lg:col-span-4 relative rounded-xl bg-gray-900/50 p-5 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-purple-500/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-600/0 opacity-50"></div>
              <div className="absolute inset-0 border border-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-row items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Overview</h2>
                  <p className="text-sm text-gray-400">Income vs Expenses for the last 6 months</p>
                </div>
                <button className="flex items-center gap-1 rounded-md border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  <span>Filter</span>
                </button>
              </div>
              <div className="relative">
                <Overview />
              </div>
            </div>
            <div className="md:col-span-1 lg:col-span-3 relative rounded-xl bg-gray-900/50 p-5 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-purple-500/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-600/0 opacity-50"></div>
              <div className="absolute inset-0 border border-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative mb-4">
                <h2 className="text-lg font-semibold text-white">Expense Breakdown</h2>
                <p className="text-sm text-gray-400">Your spending by category</p>
              </div>
              <div className="relative">
                <CategoryBreakdown />
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}

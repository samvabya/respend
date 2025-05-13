import { useEffect, useState } from "react"
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, getDocs, orderBy } from 'firebase/firestore';
import app from '../base'; 
import { useCounter } from "../contexts/CounterContext";

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<any>([])
  const { count } = useCounter();

  const auth = getAuth(app);
  const db = getFirestore(app);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const q = query(collection(db, `users/${user.uid}/transactions`), orderBy("timestamp", "desc"))
        const querySnapshot = await getDocs(q);
       const docs: any[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() })
        });
       setTransactions(docs);
      } else {
        setTransactions([])
      }
    });
    return () => unsubscribe();
  }, [count]);



  return (
    <div className="space-y-4">
      {transactions.map((transaction:any) => (
        <div
          key={transaction?.id}
          className="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-gray-800/50"
        >
          <div className="flex items-center gap-4">
            <div className="relative h-9 w-9">
              <div
                className={`flex h-full w-full items-center justify-center rounded-full ${
                  transaction?.type === "expense"
                    ? "bg-gradient-to-br from-rose-500/30 to-rose-500/10"
                    : "bg-gradient-to-br from-green-500/30 to-green-500/10"
                }`}
                style={{
                  boxShadow:
                    transaction?.type === "expense"
                      ? "0 0 10px rgba(244, 63, 94, 0.3)"
                      : "0 0 10px rgba(16, 185, 129, 0.3)",
                }}
              >
                <div className={`${transaction?.type === "expense" ? "text-rose-400" : "text-green-400"}`}>
                  {transaction?.type === "expense"? (
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
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" x2="6" y1="1" y2="4" />
        <line x1="10" x2="10" y1="1" y2="4" />
        <line x1="14" x2="14" y1="1" y2="4" />
      </svg>
      ): (
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
  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  <polyline points="9 22 9 12 15 12 15 22" />
</svg>
      )}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium leading-none text-white">{transaction?.description}</p>
              <p className="text-xs text-gray-400">{transaction?.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p
              className={`text-sm font-medium ${transaction?.type === "expense" ? "text-rose-400" : "text-green-400"}`}
              style={{
                textShadow:
                  transaction?.type === "expense" ? "0 0 8px rgba(244, 63, 94, 0.3)" : "0 0 8px rgba(16, 185, 129, 0.3)",
              }}
            >
              {transaction?.type === "expense" ? "-" : "+"}${transaction?.amount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">{transaction?.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

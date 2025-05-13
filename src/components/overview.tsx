import { getAuth } from "firebase/auth";
import { getFirestore, query, collection, getDocs, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import app from "../base";
import { useCounter } from "../contexts/CounterContext";

export function Overview() {
  const [data, setData] = useState<{
    name: string;
    income: number;
    expenses: number;
}[]
>([]);
  const { count } = useCounter();

  const auth = getAuth(app);
  const db = getFirestore(app);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const q = query(collection(db, `users/${user.uid}/transactions`), orderBy("timestamp", "desc"))
        const querySnapshot = await getDocs(q);
       const docs: {
        name: string;
        income: number;
        expenses: number;
    }[] = [];
       let currentMon = querySnapshot.docs[0].data().timestamp.toDate().toString().split(' ')[1]
       let currentInc=0;
       let currentExp=0;

        querySnapshot.forEach((doc) => {
          const thisMon = doc.data().timestamp.toDate().toString().split(' ')[1];
          console.log(thisMon);
          if(thisMon===currentMon){
            if(doc.data().type==="income"){
              currentInc+=doc.data().amount
            }else{
              currentExp+=doc.data().amount
            }
          }
          else{
            docs.push({
              name: currentMon,
              income: currentInc,
              expenses: currentExp
            })
            console.log(docs)
            currentMon=thisMon;
            currentInc=0;
            currentExp=0;
          }
        });
        docs.push({
              name: currentMon,
              income: currentInc,
              expenses: currentExp
            });
        setData(docs);
      } else {
        setData([]);
      }
    });
    return () => unsubscribe();
  }, [count]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value) => [`$${value}`, ""]}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{
            backgroundColor: "rgba(17, 17, 19, 0.9)",
            borderColor: "#954CE9",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px" }} />
        <Bar dataKey="income" name="Income" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="url(#expenseGradient)" radius={[4, 4, 0, 0]} />
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.3} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}

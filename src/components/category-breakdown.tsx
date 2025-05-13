import { getAuth } from "firebase/auth";
import { getFirestore, query, collection, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import app from "../base";
import { useCounter } from "../contexts/CounterContext";

const cl = ["#F43F5E", "#10B981", "#3B82F6", "#954CE9", "#F59E0B", "#6B7280"];

export function CategoryBreakdown() {
  const [data, setData] = useState<{
    name: string;
    value: number;
    color: string;
}[]
>([]);
  const { count } = useCounter();

  const auth = getAuth(app);
  const db = getFirestore(app);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const q = query(collection(db, `users/${user.uid}/transactions`), where("type", "==", "expense"));
        const querySnapshot = await getDocs(q);
       const docs: any[] = [];
        querySnapshot.forEach((doc) => {
          const randomIndex = Math.floor(Math.random() * cl.length);
          docs.push({ 
            name: doc.data().category,
            value: doc.data().amount,
            color: cl[randomIndex],
           })
        });
        setData(docs);
      } else {
      }
    });
    return () => unsubscribe();
  }, [count]);


  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="rgba(0,0,0,0.3)"
                style={{
                  filter: "drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3))",
                }}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`$${value}`, "Amount"]}
            contentStyle={{
              backgroundColor: "rgba(17, 17, 19, 0.9)",
              borderColor: "#954CE9",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {data.map((category) => (
          <div key={category.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: category.color,
                boxShadow: `0 0 6px ${category.color}80`,
              }}
            />
            <span className="text-xs text-gray-300">
              {category.name}: ${category.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

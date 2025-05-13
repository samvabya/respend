"use client"

import { useState } from "react"
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, getDoc, doc, updateDoc } from 'firebase/firestore';
import app from '../base'; 
import { useCounter } from "../contexts/CounterContext";

export function QuickAddForm() {
  const [transactionType, setTransactionType] = useState("expense")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const { increment } = useCounter();

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault(); 

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is signed in.");
      return;
    }

    if (!amount || !description || !category) {
        console.error("Please fill in all fields.");
        return;
    }

    const db = getFirestore(app);

    try {
      await addDoc(collection(db, `users/${user.uid}/transactions`), {
        userId: user.uid,
        amount: parseFloat(amount),
        description,
        category,
        type: transactionType,
        timestamp: serverTimestamp(),
      });

      const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          updateDoc(userDocRef, {
            [transactionType === "expense" ? "expense" : "income"]: userDocSnap.data()[transactionType === "expense" ? "expense" : "income"] + parseFloat(amount),
          });
        }
      console.log("Transaction added successfully");
      // Clear form fields
      setAmount("");
      setDescription("");
      setCategory("");
      increment();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };
  return (
    <form onSubmit={handleAddTransaction} className="grid gap-4">
      {/* Transaction Type Selection */}
      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input

              type="radio"
              id="expense"
              name="transactionType"
              value="expense"
              className="peer sr-only"
              checked={transactionType === "expense"}
              onChange={() => setTransactionType("expense")}
            />
            <label
              htmlFor="expense"
              className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-900/50 p-4 cursor-pointer hover:bg-gray-800/50 hover:border-rose-500/50 transition-all peer-checked:border-rose-500 peer-checked:bg-rose-500/10 peer-checked:shadow-[0_0_10px_rgba(244,63,94,0.3)]"

            >
              Expense
            </label>
          </div>
          <div>
            <input
              type="radio"

              id="income"
              name="transactionType"
              value="income"
              className="peer sr-only"
              checked={transactionType === "income"}
              onChange={() => setTransactionType("income")}
            />
            <label
              htmlFor="income"
              className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-900/50 p-4 cursor-pointer hover:bg-gray-800/50 hover:border-green-500/50 transition-all peer-checked:border-green-500 peer-checked:bg-green-500/10 peer-checked:shadow-[0_0_10px_rgba(16,185,129,0.3)]"

            >
              Income
            </label>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="grid gap-2">
        <label htmlFor="amount" className="text-sm font-medium text-gray-300">
          Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            className="w-full rounded-md border border-gray-700 bg-gray-900/50 pl-7 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      {/* Description Input */}
      <div className="grid gap-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-300">
          Description
        </label>
        <input
          id="description"
          placeholder="What was this for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-700 bg-gray-900/50 py-2 px-3 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
        />
      </div>

      {/* Category Select */}
      <div className="grid gap-2">
        <label htmlFor="category" className="text-sm font-medium text-gray-300">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-gray-700 bg-gray-900/50 py-2 px-3 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
        >
          <option value="" disabled selected>
            Select category
          </option>
          {transactionType === "expense" ? (
            <>
              <option value="food">Food & Dining</option>
              <option value="housing">Housing</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="healthcare">Healthcare</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </>
          ) : (
            <>
              <option value="salary">Salary</option>
              <option value="freelance">Freelance</option>
              <option value="investments">Investments</option>
              <option value="gifts">Gifts</option>
              <option value="other">Other</option>
            </>
          )}
        </select>
      </div>

      {/* Submit Button */}
      <button
        className={
          transactionType === "expense"
            ? "w-full rounded-md bg-gradient-to-r from-rose-600 to-rose-500 py-2 px-4 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            : "w-full rounded-md bg-gradient-to-r from-green-600 to-green-500 py-2 px-4 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        }
      >
        Add {transactionType === "expense" ? "Expense" : "Income"}
      </button>
    </form>
  )
}

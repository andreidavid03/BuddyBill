import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../data/api";
import ExpenseForm from "../components/expense/ExpenseForm";
import ExpenseList from "../components/expense/ExpenseList";
import BalanceSummary from "../components/common/BalanceSummary";

interface Expense {
  id: string;
  amount: number;
  description: string;
  isPaid: boolean;
  groupId: string;
  createdAt: string;
}

const Group = () => {
  const { id } = useParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/transactions/${id}`);
      setExpenses(res.data.userExpenses);
      setBalance(res.data.userTotalSpent);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [id]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Group Details</h1>
      <BalanceSummary balance={balance} />
      <ExpenseForm groupId={id!} onSuccess={fetchExpenses} />
      <ExpenseList expenses={expenses} />
    </div>
  );
};

export default Group;

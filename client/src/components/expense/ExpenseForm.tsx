import { useState } from "react";
import api from "../../data/api";

interface ExpenseFormProps {
  groupId: string;
  onSuccess: () => Promise<void>;
}

const ExpenseForm = ({ groupId, onSuccess }: ExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/expenses", {
        amount: parseFloat(amount),
        description,
        groupId,
      });
      setAmount("");
      setDescription("");
      await onSuccess();
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="input"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="input"
      />
      <button type="submit" className="btn btn-primary">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;

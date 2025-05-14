import axios from "axios";

interface ExpenseItemProps {
  id: string;
  amount: number;
  description: string;
  onDelete: () => void;
}

const ExpenseItem = ({ id, amount, description, onDelete }: ExpenseItemProps) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onDelete();
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  return (
    <div className="flex justify-between items-center p-2 border-b">
      <div>
        <p>{description}</p>
        <p className="text-sm text-gray-500">{amount} RON</p>
      </div>
      <button onClick={handleDelete} className="text-red-500 hover:underline">
        Delete
      </button>
    </div>
  );
};

export default ExpenseItem;

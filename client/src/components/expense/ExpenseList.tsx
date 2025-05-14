import { Expense } from "../../data/types";

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList = ({ expenses }: ExpenseListProps) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="border-b py-1">
            {expense.description} - ${expense.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;

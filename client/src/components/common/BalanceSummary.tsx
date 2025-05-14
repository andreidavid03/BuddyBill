interface BalanceSummaryProps {
  balance: number;
}

const BalanceSummary = ({ balance }: BalanceSummaryProps) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold">Your Total</h2>
      <p className="text-2xl text-green-600">${balance.toFixed(2)}</p>
    </div>
  );
};

export default BalanceSummary;

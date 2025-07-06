interface Balance {
  username: string;
  amount: number;
}

const BalanceList = ({ balances }: { balances: Balance[] }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Balances</h3>
      {balances.length === 0 ? (
        <p className="text-gray-500">No balances yet.</p>
      ) : (
        <ul className="list-disc list-inside">
          {balances.map((bal, i) => (
            <li key={i}>
              {bal.username} {bal.amount < 0 ? 'owes' : 'is owed'} ₹
              {Math.abs(bal.amount).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BalanceList;

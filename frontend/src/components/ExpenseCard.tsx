interface Props {
  description: string;
  amount: number;
  category: string;
  paidBy: string;
  canDelete: boolean;
  onDelete?: () => void;
}

const ExpenseCard = ({ description, amount, category, paidBy, canDelete, onDelete }: Props) => {
  return (
    <div className="p-3 bg-white shadow rounded flex justify-between items-center">
      <div>
        <p className="font-semibold">{description}</p>
        <p className="text-sm text-gray-600">
          ₹{amount} · {category} · Paid by {paidBy}
        </p>
      </div>
      {canDelete && (
        <button onClick={onDelete} className="text-red-500 hover:underline">
          Delete
        </button>
      )}
    </div>
  );
};

export default ExpenseCard;

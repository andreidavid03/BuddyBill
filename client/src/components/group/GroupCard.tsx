import { Link } from "react-router-dom";

interface GroupCardProps {
  id: string;
  name: string;
}

const GroupCard = ({ id, name }: GroupCardProps) => {
  return (
    <Link to={`/group/${id}`}>
      <div className="border p-4 shadow rounded hover:bg-gray-50">
        <h2 className="text-lg font-bold">{name}</h2>
      </div>
    </Link>
  );
};

export default GroupCard;

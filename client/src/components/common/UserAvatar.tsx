const UserAvatar = ({ name }: { name: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">
        {name[0].toUpperCase()}
      </div>
      <span>{name}</span>
    </div>
  );
};

export default UserAvatar;

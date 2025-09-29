interface ThreadBox {
  name: string;
  unreadCount: number;
  lastMessage: string;
  isActive?: boolean;
}

export function ThreadBox({
  name,
  unreadCount,
  lastMessage,
  isActive = false,
}: ThreadBox) {
  return (
    <div
      className={`flex flex-col items-left py-[15px] px-[18px] gap-1.5 border rounded-[9px] cursor-pointer transition-all duration-300 ease-in-out
    ${
      isActive
        ? "border-[#368FFF] bg-[#F7FAFF] shadow-sm"
        : "border-[#DBDBDB] hover:border-[#368FFF] hover:shadow-md hover:bg-[#F9FBFF]"
    }`}
    >
      <div className="flex flex-col rounded-[9px] w-full">
        <div className="flex flex-row justify-between">
          <p className="font-medium text-gray-800">{name}</p>
          <div className="flex flex-row justify-center items-center w-[20px] h-[20px] rounded-full bg-[#368FFF]">
            <p className="text-[#FDFDFD] text-[11px]">{unreadCount}</p>
          </div>
        </div>
      </div>
      <p className="text-[#717171] text-sm font-normal text-left truncate">
        {lastMessage}
      </p>
    </div>
  );
}

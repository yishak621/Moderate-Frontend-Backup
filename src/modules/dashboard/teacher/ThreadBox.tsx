"use client";
import PopupCard from "@/components/PopCard";
import { Ban, MoreVertical, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ThreadBox {
  chatId?: string;
  name: string;
  unreadCount: number;
  lastMessage: string;
  isActive?: boolean;
  isOnline?: boolean;
  profilePictureUrl?: string | null;
  onSelect?: (id: string) => void;
}

export function ThreadBox({
  chatId,
  name,
  unreadCount,
  lastMessage,
  isActive = false,
  isOnline = false,
  profilePictureUrl,
  onSelect,
}: ThreadBox) {
  const router = useRouter();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const menuItems = [
    {
      label: "Delete Thread",
      icon: <Trash2 size={16} />,
      onClick: () => console.log("Delete thread"),
    },
    {
      label: "Block User",
      icon: <Ban size={16} />,
      onClick: () => console.log("Block user"),
    },
  ];

  const handleClick = () => {
    if (onSelect) onSelect(chatId || "");
    router.push(`?chatId=${chatId}`);
  };
  console.log(isOnline);
  return (
    <div
      onClick={handleClick}
      className={`relative flex flex-col items-left py-[15px] px-[18px] gap-1.5 border rounded-[9px] bg-[#FDFDFD] cursor-pointer transition-all duration-300 ease-in-out
        ${
          isActive
            ? "border-[#368FFF] bg-[#F7FAFF] shadow-sm"
            : "border-[#DBDBDB] hover:border-[#368FFF] hover:shadow-md hover:bg-[#F9FBFF]"
        }`}
    >
      {/* Top row */}
      <div className="flex flex-row justify-between items-start">
        <div className="flex-1 min-w-0 flex flex-row gap-3">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {profilePictureUrl ? (
              <Image
                src={profilePictureUrl}
                alt={name || "Profile"}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#368FFF]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#90BDFD] border-2 border-[#368FFF] flex items-center justify-center">
                {name ? (
                  <span className="text-white text-lg font-semibold">
                    {name[0]?.toUpperCase()}
                  </span>
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
            )}
          </div>
          {/* Name and Message */}
          <div className="flex-1 min-w-0">
            <div className=" flex flex-row gap-1 items-center">
              {" "}
              {isOnline && (
                <span className="inline-block h-2 w-2 bg-green-500 rounded-full"></span>
              )}
              <p className="font-medium text-gray-800 truncate">{name}</p>
            </div>
            <p className="text-[#717171] text-sm font-normal truncate">
              {lastMessage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {unreadCount > 0 && (
            <div className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-[#368FFF]">
              <p className="text-[#FDFDFD] text-[11px]">{unreadCount}</p>
            </div>
          )}
          <MoreVertical
            size={18}
            className="text-gray-500 hover:text-blue-600 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsPopUpOpen(!isPopUpOpen);
            }}
          />
        </div>
      </div>

      {/* Dropdown Card */}
      <PopupCard
        isOpen={isPopUpOpen}
        onClose={() => setIsPopUpOpen(false)}
        align="right"
        className="mt-2"
      >
        <div className="flex flex-col">
          {menuItems.map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                item.onClick();
                setIsPopUpOpen(false);
              }}
              className="flex flex-row items-center gap-3 px-5 py-3 text-left text-[15px] text-gray-800 font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-blue-600 group"
            >
              <span className="text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </PopupCard>
    </div>
  );
}

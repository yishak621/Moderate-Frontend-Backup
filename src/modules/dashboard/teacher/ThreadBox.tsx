"use client";
import PopupCard from "@/components/PopCard";
import { Ban, LogOut, MoreVertical, Trash2, User, Users, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ThreadBox {
  chatId?: string;
  conversationId?: string;
  name: string;
  unreadCount: number;
  lastMessage: string;
  isActive?: boolean;
  isOnline?: boolean;
  profilePictureUrl?: string | null;
  isGroup?: boolean;
  isBlocked?: boolean; // You blocked them
  isBlockedByThem?: boolean; // They blocked you
  onSelect?: (id: string, isGroup?: boolean) => void;
  onLeaveGroup?: (conversationId: string) => void;
  onDeleteThread?: (chatId: string, name: string) => void;
  onBlockUser?: (chatId: string, name: string) => void;
  onUnblockUser?: (chatId: string, name: string) => void;
}

export function ThreadBox({
  chatId,
  conversationId,
  name,
  unreadCount,
  lastMessage,
  isActive = false,
  isOnline = false,
  profilePictureUrl,
  isGroup = false,
  isBlocked = false,
  isBlockedByThem = false,
  onSelect,
  onLeaveGroup,
  onDeleteThread,
  onBlockUser,
  onUnblockUser,
}: ThreadBox) {
  const router = useRouter();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const handleLeaveGroup = () => {
    if (conversationId && onLeaveGroup) {
      onLeaveGroup(conversationId);
    }
  };

  const handleDeleteThread = () => {
    if (chatId && onDeleteThread) {
      onDeleteThread(chatId, name);
    }
  };

  const handleBlockUser = () => {
    if (chatId && onBlockUser) {
      onBlockUser(chatId, name);
    }
  };

  const handleUnblockUser = () => {
    if (chatId && onUnblockUser) {
      onUnblockUser(chatId, name);
    }
  };

  const menuItems = isGroup
    ? [
        {
          label: "Leave Group",
          icon: <LogOut size={16} />,
          onClick: handleLeaveGroup,
        },
      ]
    : [
        {
          label: "Delete Thread",
          icon: <Trash2 size={16} />,
          onClick: handleDeleteThread,
        },
        isBlocked
          ? {
              label: "Unblock User",
              icon: <UserCheck size={16} />,
              onClick: handleUnblockUser,
              className: "text-green-600 hover:text-green-700 hover:bg-green-50",
            }
          : {
              label: "Block User",
              icon: <Ban size={16} />,
              onClick: handleBlockUser,
              className: "text-red-600 hover:text-red-700 hover:bg-red-50",
            },
      ];

  const handleClick = () => {
    const id = isGroup ? conversationId : chatId;
    if (onSelect) onSelect(id || "", isGroup);
    if (isGroup) {
      router.push(`?conversationId=${conversationId}`);
    } else {
      router.push(`?chatId=${chatId}`);
    }
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
      <div className="flex flex-row items-center gap-3">
        {/* Profile Picture / Group Icon - Fixed size, never shrinks */}
        <div 
          className="rounded-full"
          style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', flexShrink: 0 }}
        >
          {isGroup ? (
            <div 
              className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-[#368FFF] flex items-center justify-center"
              style={{ width: '48px', height: '48px' }}
            >
              <Users className="w-6 h-6 text-white" />
            </div>
          ) : profilePictureUrl ? (
            <Image
              src={profilePictureUrl}
              alt={name || "Profile"}
              width={48}
              height={48}
              className={`rounded-full object-cover border-2 ${
                isBlocked || isBlockedByThem
                  ? "border-gray-300 grayscale opacity-70"
                  : "border-[#368FFF]"
              }`}
              style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px' }}
            />
          ) : (
            <div 
              className={`rounded-full flex items-center justify-center border-2 ${
                isBlocked || isBlockedByThem
                  ? "bg-gray-400 border-gray-300"
                  : "bg-[#90BDFD] border-[#368FFF]"
              }`}
              style={{ width: '48px', height: '48px' }}
            >
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
        
        {/* Name and Message - Takes remaining space, truncates text */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex flex-row gap-1 items-center">
            {!isGroup && isOnline && !isBlocked && !isBlockedByThem && (
              <span className="inline-block h-2 w-2 bg-green-500 rounded-full flex-shrink-0"></span>
            )}
            {isGroup && (
              <Users className="w-3 h-3 text-blue-600 flex-shrink-0" />
            )}
            {!isGroup && (isBlocked || isBlockedByThem) && (
              <Ban className="w-3 h-3 text-red-500 flex-shrink-0" />
            )}
            <p className={`font-medium truncate ${isBlocked || isBlockedByThem ? "text-gray-500" : "text-gray-800"}`}>
              {name}
            </p>
            {isBlocked && (
              <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                Blocked
              </span>
            )}
          </div>
          <p className={`text-sm font-normal truncate ${isBlocked || isBlockedByThem ? "text-gray-400" : "text-[#717171]"}`}>
            {isBlockedByThem && !isBlocked
              ? "This user has restricted messages"
              : lastMessage}
          </p>
        </div>

        {/* Right side actions - Fixed, never shrinks */}
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
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
              className={`flex flex-row items-center gap-3 px-5 py-3 text-left text-[15px] font-medium rounded-lg transition-all duration-200 group ${
                item.className || "text-gray-800 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <span className={`transition-colors duration-200 ${
                item.className ? "" : "text-gray-500 group-hover:text-blue-500"
              }`}>
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

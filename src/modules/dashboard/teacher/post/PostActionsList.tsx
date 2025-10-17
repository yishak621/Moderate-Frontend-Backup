"use client";

import { Edit3, BarChart3, Share2, Bookmark, Trash2 } from "lucide-react";

const PostActionsList = ({
  onSelect,
}: {
  onSelect: (action: string) => void;
}) => {


    
  const actions = [
    { label: "Edit Post", icon: <Edit3 size={18} />, action: "edit" },
    { label: "View Stats", icon: <BarChart3 size={18} />, action: "stats" },
    { label: "Share Post", icon: <Share2 size={18} />, action: "share" },
    {
      label: "Save to Collection",
      icon: <Bookmark size={18} />,
      action: "save",
    },
    {
      label: "Delete Post",
      icon: <Trash2 size={18} />,
      action: "delete",
      danger: true,
    },
  ];

  return (
    <div className="flex flex-col   ">
      {actions.map((item, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(item.action)}
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors
            ${
              item.danger
                ? "text-red-500 hover:bg-red-50 "
                : "text-gray-700  hover:bg-gray-100 "
            }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default PostActionsList;

import Image from "next/image";
import { User } from "lucide-react";

interface UserAvatarProps {
  profilePictureUrl?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  containerClassName?: string;
}

const sizeMap = {
  sm: {
    container: "w-8 h-8",
    image: "w-8 h-8",
    text: "text-sm",
    border: "border",
  },
  md: {
    container: "w-11 h-11",
    image: "w-11 h-11",
    text: "text-lg",
    border: "border-2",
  },
  lg: {
    container: "w-[120px] h-[120px]",
    image: "w-[120px] h-[120px]",
    text: "text-4xl",
    border: "border-4",
  },
  xl: {
    container: "w-[160px] h-[160px]",
    image: "w-[160px] h-[160px]",
    text: "text-5xl",
    border: "border-4",
  },
};

export default function UserAvatar({
  profilePictureUrl = "",
  name,
  size = "md",
  className = "",
  showDeleteButton = false,
  onDelete,
  isDeleting = false,
  containerClassName = "",
}: UserAvatarProps) {
  const sizeConfig = sizeMap[size];
  const firstLetter = name?.[0]?.toUpperCase() || "";

  // For small sizes, use simplified styling from dashboard
  const isSmallSize = size === "sm" || size === "md";

  if (profilePictureUrl) {
    return (
      <div className={`relative ${containerClassName}`}>
        {isSmallSize ? (
          <Image
            className={`${sizeConfig.image} rounded-full ${sizeConfig.border} border-[#368FFF] object-cover ${className}`}
            src={profilePictureUrl}
            alt={name ? `${name}'s profile picture` : "Profile picture"}
            width={size === "sm" ? 32 : 44}
            height={size === "sm" ? 32 : 44}
          />
        ) : (
          <div className="relative">
            <Image
              className={`${sizeConfig.image} rounded-full ${sizeConfig.border} border-gray-200 object-cover ${className}`}
              src={profilePictureUrl}
              alt={name ? `${name}'s profile picture` : "Profile picture"}
              width={size === "lg" ? 120 : 160}
              height={size === "lg" ? 120 : 160}
            />
            {showDeleteButton && onDelete && (
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="absolute -bottom-2 -right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors disabled:opacity-50 z-10"
                title="Delete profile picture"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback to initials or icon
  if (isSmallSize) {
    return (
      <div
        className={`${sizeConfig.container} rounded-full ${sizeConfig.border} border-[#368FFF] bg-[#90BDFD] flex items-center justify-center ${containerClassName} ${className}`}
      >
        {firstLetter ? (
          <span className={`text-white ${sizeConfig.text} font-semibold`}>
            {firstLetter}
          </span>
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>
    );
  }

  // Large size fallback
  return (
    <div
      className={`${sizeConfig.container} rounded-full ${sizeConfig.border} border-gray-300 bg-gray-200 flex items-center justify-center ${containerClassName} ${className}`}
    >
      <User
        className={`${size === "lg" ? "w-12 h-12" : "w-16 h-16"} text-gray-400`}
      />
    </div>
  );
}

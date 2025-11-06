import Image from "next/image";
import { User } from "lucide-react";
import React from "react";

interface UserAvatarProps {
  profilePictureUrl?: string | null;
  name?: string;
  email?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  containerClassName?: string;
  // Optional text rendering below the avatar
  withText?: boolean;
  nameFontSizePx?: number; // default 15
  nameColor?: string; // default #0C0C0C
  emailFontSizePx?: number; // default 14
  emailColor?: string; // default #717171
  nameClassName?: string;
  emailClassName?: string;
  // Optional white ring around the avatar
  whiteRingPx?: number; // e.g., 7 for 7px
  whiteRingColor?: string; // default '#FFFFFF'
  // Optional overlay rendered at the bottom-right of the avatar circle
  overlay?: React.ReactNode;
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
  email,
  size = "md",
  className = "",
  showDeleteButton = false,
  onDelete,
  isDeleting = false,
  containerClassName = "",
  withText = false,
  nameFontSizePx = 15,
  nameColor = "#0C0C0C",
  emailFontSizePx = 14,
  emailColor = "#717171",
  nameClassName = "font-medium",
  emailClassName = "",
  whiteRingPx = 0,
  whiteRingColor = "#FFFFFF",
  overlay,
}: UserAvatarProps) {
  const sizeConfig = sizeMap[size];
  const firstLetter = name?.[0]?.toUpperCase() || "";

  // For small sizes, use simplified styling from dashboard
  const isSmallSize = size === "sm" || size === "md";

  const renderAvatarImage = () => {
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
    // Fallback to initials or icon (small sizes use blue border)
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
    // Large size fallback (gray)
    return (
      <div
        className={`${sizeConfig.container} rounded-full ${sizeConfig.border} border-gray-300 bg-gray-200 flex items-center justify-center ${containerClassName} ${className}`}
      >
        <User
          className={`${
            size === "lg" ? "w-12 h-12" : "w-16 h-16"
          } text-gray-400`}
        />
      </div>
    );
  };

  const baseAvatar = renderAvatarImage();

  const avatarElement =
    whiteRingPx > 0 ? (
      <div
        className="rounded-full inline-block"
        style={
          {
            padding: `${whiteRingPx}px`,
            backgroundColor: whiteRingColor,
          } as React.CSSProperties
        }
      >
        {baseAvatar}
      </div>
    ) : (
      baseAvatar
    );

  // Wrap avatar with overlay if provided
  const avatarWithOverlay = overlay ? (
    <div className="relative inline-block">
      {avatarElement}
      <div className="absolute bottom-2.5 right-0">{overlay}</div>
    </div>
  ) : (
    avatarElement
  );

  if (!withText) {
    return avatarWithOverlay;
  }

  return (
    <div className="flex flex-col items-center">
      {avatarWithOverlay}
      <div className="flex flex-col items-center gap-1 mt-2">
        <h3
          className={nameClassName}
          style={
            {
              fontSize: `${nameFontSizePx}px`,
              color: nameColor,
            } as React.CSSProperties
          }
        >
          {name || "User"}
        </h3>
        {email && (
          <p
            className={emailClassName}
            style={
              {
                fontSize: `${emailFontSizePx}px`,
                color: emailColor,
              } as React.CSSProperties
            }
          >
            {email}
          </p>
        )}
      </div>
    </div>
  );
}

import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  iconSize?: number;
  compact?: boolean; // true = smaller version
}

export const EmptyState = ({
  title = "No items to show",
  description = "It looks a bit empty here. Try adding something new!",
  iconSize = 48,
  compact = false,
}: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "py-6" : "py-20"
      }`}
    >
      <FileQuestion
        className="text-gray-400 dark:text-gray-500"
        size={iconSize}
      />
      <h3 className="text-gray-700 dark:text-gray-300 font-semibold mt-3">
        {title}
      </h3>
      <p
        className={`text-gray-500 dark:text-gray-400 ${
          compact ? "text-xs mt-1" : "text-sm mt-2"
        } max-w-sm`}
      >
        {description}
      </p>
    </div>
  );
};

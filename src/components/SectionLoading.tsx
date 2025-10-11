import { Loader } from "lucide-react";

export default function SectionLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <Loader className="w-6 h-6 animate-spin mb-2" />
      <p className="text-sm">Loading section...</p>
    </div>
  );
}

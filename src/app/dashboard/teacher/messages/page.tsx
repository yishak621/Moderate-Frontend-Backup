import { Suspense } from "react";
import MessagesClientTeachers from "./messagesClientTeachers";

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-3 text-center">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-sm md:text-base font-medium">
        Loading messages, please wait...
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MessagesClientTeachers />
    </Suspense>
  );
}

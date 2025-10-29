"use client";

export default function TicketMessage({
  message,
  sender,
}: {
  message: string;
  sender?: string;
}) {
  return (
    <div
      className={`flex mt-1 ${
        sender === "user" ? "justify-end" : "justify-start"
      } w-full `}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
          sender === "user"
            ? "bg-[#368FFF] text-white rounded-br-none"
            : "bg-gray-200  rounded-bl-none"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

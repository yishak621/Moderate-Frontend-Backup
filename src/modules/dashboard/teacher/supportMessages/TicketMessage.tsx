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
        className={`max-w-[85%] md:max-w-[70%] px-3 md:px-4 py-1.5 md:py-2 rounded-2xl text-[13px] md:text-sm leading-relaxed ${
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

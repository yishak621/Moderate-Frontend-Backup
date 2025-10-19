// import { useSendMessageAPI } from "@/hooks/useMessage";

// // Fallback HTTP message send
// export default function FallbackHttpSend({
//   chatId,
//   postId,
//   receiverId,
//   content,
//   tempId,
//   setMessagesState,
// }: {
//   chatId: string | null;
//   postId: string | null;
//   receiverId: string;
//   content: string;
//   tempId: string;
// }) {
//   const { sendMessageAPI, data, sendMessageAPIAsync, sendMessageAPIError } =
//     useSendMessageAPI();

//   try {
//     setMessagesState((prev) =>
//       prev.map((m) => (m.id === tempId ? data?.message : m))
//     );
//   } catch (err) {
//     console.log(err);
//   } finally {
//     setSending(false);
//   }
// }

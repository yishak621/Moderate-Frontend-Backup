// import { AxiosRequestConfig } from "axios";
// import { axiosInstance } from "./axiosInstance"; // adjust path

// type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

// interface ApiRequestProps<TBody = unknown, TParams = unknown> {
//   method: HttpMethod;
//   url: string;
//   data?: TBody;
//   params?: TParams;
// }

// export const apiRequest = async <
//   TResponse,
//   TBody = unknown,
//   TParams = unknown
// >({
//   method,
//   url,
//   data,
//   params,
// }: ApiRequestProps<TBody, TParams>): Promise<TResponse> => {
//   try {
//     const config: AxiosRequestConfig<TBody> = {
//       method,
//       url,
//       data,
//       params,
//     };

//     const res = await axiosInstance.request<TResponse>(config);

//     if (!res) {
//       throw new Error("No response from server");
//     }

//     return res.data;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(
//         // @ts-expect-error - Axios error may have response
//         (error as any)?.response?.data?.message ||
//           error.message ||
//           "Something went wrong"
//       );
//     }
//     throw new Error("Unknown error");
//   }
// };

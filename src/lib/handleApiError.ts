import { AxiosError } from "axios";

//------------------- Helper Function
export const handleApiError = (error: unknown) => {
  if (isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  } else if (error instanceof Error) {
    console.error("General Error:", error.message);
    throw new Error(error.message || "Something went wrong");
  } else {
    console.error("Unknown error:", error);
    throw new Error("Something went wrong");
  }
};

//------------------- Type Guard for AxiosError
const isAxiosError = (error: unknown): error is AxiosError<any> => {
  return (error as AxiosError)?.isAxiosError === true;
};

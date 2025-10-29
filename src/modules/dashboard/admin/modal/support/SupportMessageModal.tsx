import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import CustomSelect from "@/components/ui/CustomSelect";
import { useForm } from "react-hook-form";
import { Support } from "@/app/types/support";
import toast from "react-hot-toast";
import { useCreateSupportTicketAdmin } from "@/hooks/useSupportTickets";
import { CreateTicketInput } from "@/app/types/support_tickets";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function SupportMessageModal() {
  const { close } = useModal();
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };

  const {
    createTicket,
    createTicketAsync,
    isCreatingTicketLoading,
    isCreatingTicketSuccess,
  } = useCreateSupportTicketAdmin();

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
  } = useForm<CreateTicketInput>();

  const onSubmit = async (data: CreateTicketInput) => {
    try {
      await createTicketAsync(data);

      toast.success("Support ticket created successfully!");
      close();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message);
      } else {
        console.error("Unknown error", err);
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" bg-[#FDFDFD] max-h-screen overflow-y-scroll scrollbar-hide min-w-[551px] p-10 rounded-[27px] flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">
            Send Support Message
          </p>
          <p className=" text-base font-normal text-[#717171]">
            Send a direct message to a user or broadcast to multiple users
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
      {/* main section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        {/* <div>
          <p className="text-[#0c0c0c] text-base font-normal mb-1">Recipient</p>
          <CustomSelect
            options={options}
            placeholder="Select Recipient or type email"
          />
        </div> */}
        <Input
          label="Recipient"
          type="text"
          placeholder="Enter recipient email"
          {...register("email", {
            required: "Email is required!",
          })}
          error={errors?.email?.message}
        />{" "}
        <Input
          label="Subject"
          type="text"
          placeholder="Enter message subject"
          {...register("subject", {
            required: "Subject is required!",
          })}
          error={errors?.subject?.message}
        />
        <Textarea
          label="Message"
          placeholder="Type your message here..."
          {...register("message", {
            required: "Message is required!",
          })}
          error={errors?.message?.message}
        />
      </div>

      <div className=" flex justify-center gap-3 items-center w-full ">
        <div className="w-1/3 ">
          <Button className="w-full" variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="w-2/3">
          {/* Update Button */}
          <Button
            type="submit"
            className={`justify-center text-base cursor-pointer w-full transition 
        ${isCreatingTicketLoading && "opacity-70 cursor-not-allowed"}`}
            disabled={isCreatingTicketLoading}
          >
            {isCreatingTicketLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

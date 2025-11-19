import Image from "next/image";

export default function LoginScreen() {
  return (
    <div className=" p-8 h-screen max-h-screen overflow-hidden flex items-center justify-center">
      <div
        className="relative w-full max-w-[750px] h-[95vh] max-h-[850px] 2xl:h-[70vh]
        mx-auto rounded-[37px] overflow-hidden p-[8px]
        bg-gradient-to-br from-blue-500 to-cyan-500"
      >
        <div
          className="relative flex flex-col items-center justify-between
          w-full h-full rounded-[29px]
          bg-[url('/images/logo/logo-screen-new.png')] bg-center bg-contain bg-no-repeat"
        ></div>
      </div>
    </div>
  );
}

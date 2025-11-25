export default function LoginScreen() {
  return (
    <div className="p-8 h-screen max-h-screen overflow-hidden flex items-center justify-center">
      <div
        className="relative w-full max-w-[750px] h-[95vh] max-h-[850px] 2xl:h-[70vh]
        mx-auto rounded-[32px] overflow-hidden border-[8px] border-blue-500"
      >
        <div
          className="relative flex flex-col items-center justify-between
          w-full h-full rounded-[24px]
          bg-[url('/images/logo/logo-screen-new.png')] bg-center bg-cover bg-no-repeat"
        ></div>
      </div>
    </div>
  );
}

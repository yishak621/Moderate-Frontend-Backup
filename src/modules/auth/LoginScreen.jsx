import Image from "next/image";

export default function LoginScreen() {
  return (
    <div
      className="flex flex-col items-center justify-center border border-green-600 relative  "
      style={{
        borderRadius: "37px",
        background:
          "url(/images/login-background.png) lightgray -23.246px 0px / 109.143% 100% no-repeat",
        mixBlendMode: "soft-light",
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(180deg, #1072FF 0%, #3398FF 50%, #3C8AFF 100%)",
          opacity: 0.8,
          borderRadius: "37px",
          zIndex: 1,
        }}
      />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Logo and title */}
        <div className="flex flex-col gap-2 text-left ">
          <h4 className="text-2xl font-medium text-[#FDFDFD]">Moderate</h4>
          <p className="text-base font-normal text-[#F1F1F1]">
            Management Portal System
          </p>
        </div>

        {/* Brand Image */}
        <div
          className="w-[465px] h-[609px] border border-red-600"
          style={{
            background: `
      linear-gradient(rgba(16, 114, 255, 0.4), rgba(16, 114, 255, 0.4)),
      url('/images/brand.svg') center / contain no-repeat
    `,
            mixBlendMode: "soft-light",
          }}
        ></div>
      </div>
    </div>
  );
}

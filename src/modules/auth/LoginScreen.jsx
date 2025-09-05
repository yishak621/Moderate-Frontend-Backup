import Image from "next/image";

export default function LoginScreen() {
  return (
    <div className="flex flex-col items-center justify-center border border-green-600">
      {/* Logo and title */}
      <div className="flex flex-col gap-4 text-left">
        <h4>Moderate</h4>
        <p>Management Portal System</p>
      </div>

      {/* Brand Image */}
      <div className="border border-red-600">
        <Image src="/images/brand.svg" alt="brand" width={465} height={609} />
      </div>
    </div>
  );
}

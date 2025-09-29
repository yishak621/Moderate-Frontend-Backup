interface StatusCircleProps {
  size?: number; // default size if not provided
  color?: string; // tailwind color class or hex
}

export default function StatusCircle({
  size = 7,
  color = "#368FFF",
}: StatusCircleProps) {
  return (
    <div
      className={` rounded-full ${color}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}

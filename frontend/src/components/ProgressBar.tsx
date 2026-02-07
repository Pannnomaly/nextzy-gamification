type ProgressBarProps = {
  current: number;
  max: number;
};

export default function ProgressBar({ current, max }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="mb-7">
      <div className="h-[9]"
        style={{
          background: "#eee",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          className="h-full bg-[#FF8158] transition duration-300 ease-in-out"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

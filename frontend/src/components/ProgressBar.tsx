type ProgressBarProps = {
  current: number;
  max: number;
};

export default function ProgressBar({ current, max }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          height: 12,
          background: "#eee",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "#f97316",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

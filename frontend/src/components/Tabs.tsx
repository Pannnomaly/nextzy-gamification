type TabKey = "play" | "reward";

type TabsProps = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <button
        onClick={() => onChange("play")}
        style={{
          padding: "8px 12px",
          borderBottom:
            active === "play" ? "2px solid #f97316" : "2px solid transparent",
          fontWeight: active === "play" ? "bold" : "normal",
        }}
      >
        Play History
      </button>

      <button
        onClick={() => onChange("reward")}
        style={{
          padding: "8px 12px",
          borderBottom:
            active === "reward" ? "2px solid #f97316" : "2px solid transparent",
          fontWeight: active === "reward" ? "bold" : "normal",
        }}
      >
        Reward History
      </button>
    </div>
  );
}

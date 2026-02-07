type TabKey = "play" | "reward";

type TabsProps = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <div className="flex gap-4 pl-5 transition duration-300 ease-in-out">
      <button
        onClick={() => onChange("play")}
        className={`
          px-4 py-1.5 font-[400] text-[13px] rounded-full border transition duration-300 ease-in-out
          ${
            active === "play"
              ? "border-[#FF383C] text-[#FF383C]"
              : "border-[#979797] text-[#979797]"
          }
        `}
      >
        ประวัติการเล่น
      </button>

      <button
        onClick={() => onChange("reward")}
        className={`
          px-4 py-1.5 text-sm rounded-full border transition
          ${
            active === "reward"
              ? "border-[#FF383C] text-[#FF383C]"
              : "border-[#979797] text-[#979797]"
          }
        `}
      >
        ประวัติรางวัล
      </button>
    </div>
  );
}

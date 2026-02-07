type PrimaryActionButtonProps = {
  label: string;
  onClick: () => void;
};

export default function PrimaryActionButton({
  label,
  onClick,
}: PrimaryActionButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <button
        onClick={onClick}
        className="
          w-full
          py-4
          rounded-full
          bg-[#FFC124]
          hover:bg-[#cc9a1b]
          text-white
          font-semibold
          text-lg
          active:scale-[0.98]
          transition
          duration-300
          ease-in-out
        "
      >
        {label}
      </button>
    </div>
  );
}

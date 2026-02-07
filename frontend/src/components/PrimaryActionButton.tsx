type PrimaryActionButtonProps = {
  label: string;
  onClick: () => void;
};

export default function PrimaryActionButton({
  label,
  onClick,
}: PrimaryActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-yellow-400 text-white py-4 rounded-full text-lg font-bold"
    >
      {label}
    </button>
  );
}

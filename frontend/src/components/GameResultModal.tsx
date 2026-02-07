type GameResultModalProps = {
  open: boolean;
  earnedScore: number;
  onClose: () => void;
};

export default function GameResultModal({
  open,
  earnedScore,
  onClose,
}: GameResultModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl p-6 w-[300px] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-[24px] font-[500] mb-2">ได้รับ</h2>

        <p className="text-[16px] font-[400] mb-6">{earnedScore.toLocaleString()} คะแนน</p>

        <button
          onClick={onClose}
          className="bg-[#FFC124] hover:bg-[#cc9a1b] text-white text-[16px] font-[600] px-6 py-2 rounded-full w-full transition duration-300 ease-in-out"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}

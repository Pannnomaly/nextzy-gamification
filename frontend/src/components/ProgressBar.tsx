type Checkpoint = {
  percent: number;
  value: number;
  claimed: boolean;
};

type ProgressBarProps = {
  current: number;
  max: number;
  checkpoints: Checkpoint[];
};

export default function ProgressBar({
  current,
  max,
  checkpoints,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="relative mt-10">
      <div className="absolute -top-8 left-0 right-0 mx-2">
        {checkpoints.map((cp) => (
          <span
            key={cp.value}
            className="absolute text-sm text-gray-500"
            style={{
              left: `${cp.percent}%`,
              transform: "translateX(-50%)",
            }}
          >
            {cp.value.toLocaleString()}
          </span>
        ))}
      </div>

      <div className="relative h-3 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="
            absolute
            top-[-6px]
            w-6 h-6
            bg-gradient-to-b from-[#FF0004] to-[#FC8625]
            rounded-full
            shadow
            border-2 border-white
            z-10
          "
          style={{
            left: `${percentage}%`,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      <div className="absolute left-0 right-0 top-1/2 mx-3 z-20">
        {checkpoints.map((cp) => {
          const reached = current >= cp.value;
          const claimed = cp.claimed;

          return (
            <div
              key={cp.value}
              className="absolute"
              style={{
                left: `${cp.percent}%`,
                transform: "translateX(-50%) translateY(-50%)",
              }}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold
                  ${
                    claimed
                      ? "bg-green-600 text-white"
                      : reached
                        ? "bg-gray-400 text-white"
                        : "bg-gray-400 text-white"
                  }
                `}
              >
                ✓
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

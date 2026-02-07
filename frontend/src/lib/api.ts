const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined!");
}

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

async function request<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed!");
  }

  return res.json();
}

export type PlayGameResponse = {
  earnedScore: number;
  totalScore: number;
  isMaxScoreReached: boolean;
};

export const api = {
  getUserSummary: () =>
    request<{
      totalScore: number;
      rewards: {
        id: string;
        name: string;
        checkpoint: number;
        claimed: boolean;
      }[];
    }>("/user/summary"),

  getPlayHistory: () =>
    request<{
      items: {
        id: string;
        score: number;
        playedAt: string;
      }[];
    }>("/game/history"),

  getRewardHistory: () =>
    request<{
      items: {
        id: string;
        rewardName: string;
        checkPoint: number;
        claimedAt: string;
      }[];
    }>("/reward/history"),

  claimReward: (rewardId: string) =>
    request("/reward/claim/" + rewardId, {
      method: "POST",
    }),

  resetGame: () =>
    request("/reset", {
      method: "POST",
    }),

  playGame: () =>
  request<PlayGameResponse>("/game/play", {
    method: "POST",
  }),
};

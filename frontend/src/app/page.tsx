import { api } from "@/src/lib/api";

export default async function HomePage() {
  const summary = await api.getUserSummary();

  return (
    <main style={{ padding: 24 }}>
      <h1>Nextzy Gamification</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Total Score</h2>
        <p style={{ fontSize: 24, fontWeight: 'bold' }}>
          {summary.totalScore.toLocaleString()} / 10,000
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Rewards</h2>
        <ul>
          {summary.rewards.map((reward) => (
            <li key={reward.id}>
              {reward.name} – {reward.checkpoint}{' '}
              {reward.claimed ? 'Claimed' : 'Not claimed'}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

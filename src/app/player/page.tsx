import { PageShell } from "@/components/page-shell";
import { PlayerAuthPanel } from "@/components/player-auth-panel";
import { PlayerDashboard } from "@/components/player-dashboard";

export default function PlayerPage() {
  return (
    <PageShell
      eyebrow="Terminal de acesso"
      title="Login"
      subtitle="Entrada online via Supabase para os perfis player1 e player2."
    >
      <PlayerAuthPanel />
      <PlayerDashboard />
    </PageShell>
  );
}

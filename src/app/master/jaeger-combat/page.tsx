import { LoginRequired } from "@/components/game/login-required";
import { MasterJaegerCombatCenter, type MasterJaegerCombatBundle } from "@/components/master/MasterJaegerCombatCenter";
import { PageShell } from "@/components/page-shell";
import { jaegers } from "@/data";
import { getAllJaegerCombatContent } from "@/lib/jaeger-combat/content";

export default function MasterJaegerCombatPage() {
  const bundles: MasterJaegerCombatBundle[] = getAllJaegerCombatContent().map((bundle) => {
    const jaeger = jaegers.find((item) => item.id === bundle.entry.jaegerId);
    return {
      entry: bundle.entry,
      jaegerName: jaeger?.nome ?? bundle.entry.title,
      jaegerFunction: jaeger?.funcao ?? "Função não cadastrada no dossiê.",
      jaegerContent: bundle.jaegerContent,
      blocks: bundle.blocks,
    };
  });

  return (
    <PageShell
      eyebrow="Mesa de controle"
      title="Fichas de Combate dos Jaegers"
      subtitle="Central mecânica do mestre: texto integral preservado, cards por categoria, diagnóstico atual e vínculos de pilotos."
      showHero={false}
    >
      <LoginRequired>
        <MasterJaegerCombatCenter bundles={bundles} />
      </LoginRequired>
    </PageShell>
  );
}

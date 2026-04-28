"use client";

import { ClassifiedBlock, PublicBlock } from "@/components/blocks";
import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { Tag } from "@/components/tag";
import { useMode } from "@/context/mode-context";
import { weapons } from "@/data";

export default function WeaponsPage() {
  const { isMaster } = useMode();

  if (!isMaster) {
    return (
      <PageShell
        eyebrow="Área de mestre"
        title="Armas Enumeradas"
        subtitle="Esta pesquisa não aparece para players na era jogável de 2006."
      >
        <PublicBlock title="Acesso restrito">
          <p>Em 2006, não existe nenhuma Arma Enumerada operacional ou pública. Este arquivo fica disponível apenas no Modo Mestre.</p>
        </PublicBlock>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Arquivo classificado / 2006"
      title="Armas Enumeradas - Pesquisa Não Operacional"
      subtitle="Estudos secretos sobre tecidos, ossos, nucleos e propriedades biologicas de Kaijus mortos."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {weapons.map((weapon) => (
          <Card
            key={weapon.id}
            title={`${weapon.numero} - ${weapon.nome}`}
            subtitle={weapon.origem}
            description={weapon.descricao}
            tags={weapon.tags}
            status={weapon.status}
          />
        ))}
      </section>

      <section className="space-y-6">
        {weapons.map((weapon) => (
          <PublicBlock key={weapon.id} title={`${weapon.numero} / ${weapon.nome}`}>
            <div className="mb-4 flex flex-wrap gap-2">
              {weapon.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <p>
              <strong>Origem Kaiju:</strong> {weapon.origem}
            </p>
            <p>
              <strong>Tipo:</strong> {weapon.tipo}
            </p>
            <p>
              <strong>Status:</strong> {weapon.status}
            </p>
            <p>{weapon.descricao}</p>
            <h3>Pesquisa registrada</h3>
            <ul>
              {weapon.habilidades.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {weapon.efeitosColaterais ? (
              <ClassifiedBlock title="Riscos">
                <p>{weapon.efeitosColaterais}</p>
              </ClassifiedBlock>
            ) : null}
            {weapon.notasSecretas ? (
              <ClassifiedBlock title="Dados secretos">
                <p>{weapon.notasSecretas}</p>
              </ClassifiedBlock>
            ) : null}
          </PublicBlock>
        ))}
      </section>
    </PageShell>
  );
}

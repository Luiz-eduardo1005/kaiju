"use client";

import { ClassifiedBlock, PublicBlock } from "@/components/blocks";
import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { Tag } from "@/components/tag";
import { weapons } from "@/data";

export default function WeaponsPage() {
  return (
    <PageShell
      eyebrow="Arsenal enumerado"
      title="Armas Enumeradas"
      subtitle="Sistemas vivos domesticados, criados apenas apos decadas de pesquisa, falhas, mortes e contencao biologica."
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
            <h3>Habilidades</h3>
            <ul>
              {weapon.habilidades.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {weapon.efeitosColaterais ? (
              <ClassifiedBlock title="Efeitos colaterais">
                <p>{weapon.efeitosColaterais}</p>
              </ClassifiedBlock>
            ) : null}
            {weapon.historicoCriacao ? (
              <ClassifiedBlock title="Historico de criacao">
                <p>{weapon.historicoCriacao}</p>
              </ClassifiedBlock>
            ) : null}
          </PublicBlock>
        ))}
      </section>
    </PageShell>
  );
}

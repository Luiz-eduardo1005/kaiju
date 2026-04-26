"use client";

import { Card } from "./card";

const playerModules = [
  {
    title: "Ficha",
    description: "Atributos, historico, compatibilidades, condicao fisica e anotacoes do personagem.",
    status: "Em breve",
  },
  {
    title: "Inventario",
    description: "Itens pessoais, suprimentos, equipamentos taticos e compras realizadas.",
    status: "Em breve",
  },
  {
    title: "Banco",
    description: "Creditos, pagamentos, debitos, recompensas e historico financeiro.",
    status: "Em breve",
  },
  {
    title: "Loja",
    description: "Catalogo de itens civis e militares para comprar e enviar ao inventario.",
    status: "Em breve",
  },
];

export function PlayerDashboard() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {playerModules.map((module) => (
        <Card key={module.title} title={module.title} description={module.description} status={module.status} tags={["Campanha"]} />
      ))}
    </section>
  );
}

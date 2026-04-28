"use client";

import { Card } from "./card";

const playerModules = [
  {
    title: "Ficha",
    description: "Atributos, histórico, compatibilidades, condição física e anotações do personagem.",
    status: "Em breve",
  },
  {
    title: "Inventário",
    description: "Itens pessoais, suprimentos, equipamentos de campo e compras realizadas.",
    status: "Em breve",
  },
  {
    title: "Banco",
    description: "Créditos, pagamentos, débitos, recompensas e histórico financeiro.",
    status: "Em breve",
  },
  {
    title: "Loja",
    description: "Catálogo de itens civis e militares para comprar e enviar ao inventário.",
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

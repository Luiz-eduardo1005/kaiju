import { ClassifiedBlock, PublicBlock, TextContent } from "./blocks";
import { Tag } from "./tag";

type DetailPageProps = {
  title: string;
  subtitle?: string;
  image?: string;
  tags?: string[];
  facts: Record<string, string | undefined>;
  publicText?: string;
  secretText?: string;
  sections?: { title: string; content?: string | string[]; classified?: boolean }[];
};

export function DetailPage({ title, subtitle, image, tags = [], facts, publicText, secretText, sections = [] }: DetailPageProps) {
  return (
    <article className="space-y-6">
      <section className="relative min-h-[340px] overflow-hidden rounded-3xl border border-cyan-300/25 bg-slate-950">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: image
              ? `linear-gradient(90deg,rgba(2,6,23,0.96),rgba(2,6,23,0.64),rgba(2,6,23,0.92)), url(${image})`
              : "radial-gradient(circle at 70% 30%, rgba(34,211,238,.35), transparent 35%), linear-gradient(135deg, rgba(14,165,233,.2), rgba(124,58,237,.14))",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="relative flex min-h-[340px] flex-col justify-end p-6 md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300">Dossie individual</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-lg text-slate-300">{subtitle}</p> : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5">
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Ficha tecnica</h2>
          <dl className="space-y-4">
            {Object.entries(facts)
              .filter(([, value]) => value)
              .map(([key, value]) => (
                <div key={key} className="border-b border-white/10 pb-3">
                  <dt className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{key}</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-100">{value}</dd>
                </div>
              ))}
          </dl>
        </aside>

        <div className="space-y-6">
          {publicText ? (
            <PublicBlock title="Arquivo publico">
              <TextContent text={publicText} />
            </PublicBlock>
          ) : null}
          {secretText ? (
            <ClassifiedBlock title="Arquivo classificado">
              <TextContent text={secretText} />
            </ClassifiedBlock>
          ) : null}
          {sections.map((section) =>
            section.classified ? (
              <ClassifiedBlock key={section.title} title={section.title}>
                {Array.isArray(section.content) ? (
                  <ul>
                    {section.content.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <TextContent text={section.content ?? ""} />
                )}
              </ClassifiedBlock>
            ) : (
              <PublicBlock key={section.title} title={section.title}>
                {Array.isArray(section.content) ? (
                  <ul>
                    {section.content.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <TextContent text={section.content ?? ""} />
                )}
              </PublicBlock>
            ),
          )}
        </div>
      </div>
    </article>
  );
}

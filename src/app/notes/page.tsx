"use client";

import { useEffect, useState } from "react";
import { LoginRequired } from "@/components/game/login-required";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/context/auth-context";
import { bootstrapPlayer } from "@/lib/game/profile";
import { supabase } from "@/lib/supabase";
import type { PlayerNote, Profile } from "@/types/game";

export default function NotesPage() {
  return (
    <PageShell
      eyebrow="Caderno pessoal"
      title="Anotações"
      subtitle="Registre pistas, teorias e lembretes da campanha. Cada player vê apenas as próprias anotações."
    >
      <LoginRequired>
        <NotesPanel />
      </LoginRequired>
    </PageShell>
  );
}

function NotesPanel() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notes, setNotes] = useState<PlayerNote[]>([]);
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadNotes(userId: string) {
    const { data, error } = await supabase
      .from("player_notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    setNotes((data as PlayerNote[]) ?? []);
  }

  useEffect(() => {
    if (!user) return;

    bootstrapPlayer(user)
      .then(async ({ profile }) => {
        setProfile(profile);
        await loadNotes(user.id);
      })
      .catch((error) => setMessage(error.message));
  }, [user]);

  async function saveNote() {
    if (!user || busy) return;
    const trimmed = content.trim();
    if (!trimmed) {
      setMessage("Escreva alguma coisa antes de salvar a anotação.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const { error } = await supabase.from("player_notes").insert({
        user_id: user.id,
        content: trimmed,
      });

      if (error) throw error;
      setContent("");
      setMessage("Anotação salva no seu caderno pessoal.");
      await loadNotes(user.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao salvar anotação.");
    } finally {
      setBusy(false);
    }
  }

  function startEditing(note: PlayerNote) {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
    setMessage("");
  }

  function cancelEditing() {
    setEditingNoteId("");
    setEditingContent("");
  }

  async function updateNote(noteId: string) {
    if (!user || busy) return;
    const trimmed = editingContent.trim();
    if (!trimmed) {
      setMessage("A anotação editada não pode ficar vazia.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("player_notes")
        .update({ content: trimmed, updated_at: new Date().toISOString() })
        .eq("id", noteId)
        .eq("user_id", user.id);

      if (error) throw error;
      setEditingNoteId("");
      setEditingContent("");
      setMessage("Anotação atualizada.");
      await loadNotes(user.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao editar anotação.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/80 p-5 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-300">Nova anotação</p>
        <h2 className="mt-2 text-2xl font-black uppercase text-white">{profile?.display_name ?? profile?.username ?? "Player"}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Use este espaço para guardar pistas, teorias, nomes importantes, suspeitas e objetivos pessoais do seu personagem.
        </p>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escreva sua anotação aqui..."
          rows={9}
          className="mt-5 w-full rounded-2xl border border-cyan-300/20 bg-black/45 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">{content.trim().length} caracteres</p>
          <button
            type="button"
            onClick={() => void saveNote()}
            disabled={busy || !content.trim()}
            className="rounded-2xl border border-cyan-300/45 bg-cyan-300/10 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Salvando..." : "Salvar anotação"}
          </button>
        </div>

        {message ? <p className="mt-4 rounded-xl border border-cyan-300/25 bg-cyan-500/10 p-3 text-sm text-cyan-100">{message}</p> : null}
      </div>

      <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/70 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-300">Notas salvas</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">Seu caderno</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">
            {notes.length} anotação{notes.length === 1 ? "" : "ões"}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {notes.length ? (
            notes.map((note) => {
              const isEditing = editingNoteId === note.id;

              return (
              <article key={note.id} className="rounded-2xl border border-cyan-300/15 bg-black/35 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300">
                      {new Date(note.created_at).toLocaleString("pt-BR")}
                    </p>
                    {note.updated_at && note.updated_at !== note.created_at ? (
                      <p className="mt-1 text-[11px] text-slate-500">Editada em {new Date(note.updated_at).toLocaleString("pt-BR")}</p>
                    ) : null}
                  </div>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => startEditing(note)}
                      className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-300/20"
                    >
                      Editar
                    </button>
                  ) : null}
                </div>

                {isEditing ? (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={editingContent}
                      onChange={(event) => setEditingContent(event.target.value)}
                      rows={7}
                      className="w-full rounded-2xl border border-cyan-300/25 bg-black/50 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-cyan-300/60"
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={busy}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => void updateNote(note.id)}
                        disabled={busy || !editingContent.trim()}
                        className="rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50 transition hover:bg-cyan-300/20 disabled:opacity-50"
                      >
                        {busy ? "Salvando..." : "Salvar edição"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-100">{note.content}</p>
                )}
              </article>
            );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300">Caderno vazio</p>
              <h3 className="mt-2 text-2xl font-black text-white">Nenhuma anotação salva.</h3>
              <p className="mt-2 text-sm text-slate-400">Quando você salvar uma anotação, ela aparece aqui embaixo.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

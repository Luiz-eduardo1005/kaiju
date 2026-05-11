# 14_MARK-VI_FICHAS_DE_COMBATE_JAEGERS

# CÍRCULO DE FOGO — FICHAS DE COMBATE DOS JAEGERS MARK-VI

Arquivo-fonte para Codex/site, sistema de combate e consulta do mestre.

Este arquivo consolida os **Mark-VI** da Parte 2 como fichas jogáveis de mesa. A função dele não é substituir o catálogo narrativo dos Jaegers, mas transformar cada máquina em material prático de combate: atributos, função, marcadores, ataques, custos, avarias, riscos de Fluxo, relação com os atributos dos pilotos e notas de uso.

## Escala Mark-VI

```text
+5  = ponto fraco claro para sexta geração
+6  = funcional, mas abaixo do padrão Mark-VI
+7  = bom
+8  = muito alto
+9  = excelência operacional
+10 = especialidade absoluta
```

## Atributos de Jaeger

```text
Potência   = força bruta, impacto, empurrão, tração e armas físicas.
Estrutura  = resistência, blindagem, sustentação, estabilidade e durabilidade.
Mobilidade = deslocamento, reação, velocidade, giro, escalada, evasão e reposicionamento.
Precisão   = acerto fino, mira, corte, ponto fraco, controle de força e ângulo.
Sensores   = leitura de ameaça, alvo, ambiente, pressão, calor, vibração, rota e risco.
Fluxo      = profundidade neural/Drift, resposta emocional, sincronia e sistemas especiais.
Interface  = coordenação de sistemas, armas, módulos, IA embarcada, segurança e calibragem.
```

## Atributos pessoais dos pilotos

```text
Força        = sustentar movimento físico, impacto, cabo, agarrão, peso e força no comando.
Constituição = aguentar calor, impacto, vertigem, pressão, dor, vibração e esforço prolongado.
Vontade      = resistir pânico, culpa, impulso, medo, protocolo, vaidade e custo moral.
Habilidade   = timing corporal, manobra, passo, reflexo, luta, controle fino e uso técnico do corpo.
Mente        = leitura tática, cálculo, prioridade, risco, interpretação de sensores e decisão.
Drift        = sincronia, Fluxo, conexão com parceiro, resposta neural e uso seguro dos sistemas especiais.
```

## Regra geral de Calor e Estresse

```text
Calor 0–2  = normal / aquecimento.
Calor 3–4  = uso intenso; falhas começam a custar.
Calor 5    = limite seguro.
Calor 6+   = crítico; avarias, travamentos ou risco neural.

Estresse 0–2 = tensão normal de combate.
Estresse 3–4 = limite seguro de Fluxo.
Estresse 5   = risco psicológico/neural.
Estresse 6+  = Quebra de Fluxo, colapso, trauma ou falha específica.
```

---

# 1. GUARDIAN BRAVO — MARK-VI

## Identidade

```text
Nome: Guardian Bravo
ID: guardian-bravo
Geração: Mark-VI / Proteção integrada pós-Fenda
Função: proteção de zona, interposição, suporte tático e controle defensivo de área
```

## Conceito

O Guardian Bravo é o Jaeger que transforma defesa em doutrina de sexta geração. Ele não existe para matar mais rápido, mas para impedir que o Kaiju execute seu plano. Entra entre a ameaça e aquilo que precisa sobreviver: ponte, cidade, aliado, rota de evacuação, Jaeger carregando arma pesada ou civis ainda dentro da zona.

```text
O Guardian Bravo entra na linha. E não deixa passar.
```

## Atributos

```text
Potência: +7
Estrutura: +10
Mobilidade: +7
Precisão: +8
Sensores: +10
Fluxo: +9
Interface: +10
```

## Combate

```text
Integridade Estrutural: 300
Defesa: 17
Defesa em Campo Protegido: 20 contra ataques destinados à zona, aliado, estrutura ou rota
Defesa em Interposição Bravo: 19 ao entrar na frente de ataque direcionado
Defesa fora de posição/sem leitura: 14
Defesa se sensores de ameaça falharem: 13
Blindagem: 9 frontal / 9 antebraços / 8 peito / 8 ombros / 8 pernas / 7 lateral / 5 traseira / 7 juntas / 8 Conn-Pod
Deslocamento: 3 zonas; defensivo 4 zonas; ancorado 1 zona
Reações: 3 por rodada; 4 em Campo Protegido se forem defensivas
Dano base: 2d10 + Potência
Punho Guardião: 3d10 + Potência
Pulso Defensivo: 3d8 + Interface
Contenção Bravo: 3d8 + Estrutura por rodada
Defesa Integrada: redução 2d10 + Estrutura
Barreira Cinética Localizada: redução 3d8 + Interface
```

## Marcadores

- Campo Protegido: 0 sem zona / 1 zona marcada / 2 ameaça lida / 3 proteção ativa / 4 domínio defensivo / 5 escudo vivo
- Sobrecarga Defensiva: sobe ao repetir bloqueios pesados, barreira cinética ou interposição sob dano
- Peso da Zona: sobe quando civis, aliados ou estruturas dependem diretamente do Guardian

## Ataques e manobras

- Leitura de Ameaça — d20 + Sensores/Interface/Mente/Drift; revela intenção provável do Kaiju e pode gerar Campo +1.
- Interposição Bravo — d20 + Mobilidade/Estrutura/Vontade/Drift; entra na frente de ataque destinado a aliado, civil, rota ou estrutura.
- Defesa Integrada — d20 + Estrutura/Interface/Fluxo; reduz 2d10 + Estrutura ao redistribuir impacto por antebraço, ombro, torso, quadril e pés.
- Campo de Proteção Tática — d20 + Interface/Sensores/Vontade/Drift; concede bônus defensivo a aliados dentro da zona protegida.
- Pulso Defensivo — d20 + Interface/Potência/Sensores; dano 3d8 + Interface; empurra, redireciona, quebra agarrão ou cria espaço.
- Barreira Cinética Localizada — d20 + Interface/Estrutura/Drift; defesa limitada, não escudo infinito; reduz impacto crítico por um instante.

## Avarias específicas

- Sensor de Ameaça Mudo — Leitura de Ameaça -1; os pilotos deixam de sentir o ataque chegando.
- Placa Móvel Travada — Defesa Integrada perde 1d.
- Quadril sem Estabilidade — Campo máximo 3; quedas/empurrões ficam mais perigosos.
- Conflito de Proteção — CD 18 Mente/Vontade/Drift; falha causa hesitação entre atacar e proteger.

## Nota do mestre

Recompensa leitura, presença, defesa e responsabilidade. Puna tentativas de jogar como Striker, Saber ou Valor. Ele brilha quando existe uma linha para proteger.

---

# 2. TITAN REDEEMER — MARK-VI

## Identidade

```text
Nome: Titan Redeemer
ID: titan-redeemer
Geração: Mark-VI / Sustentação redentora e resgate absoluto
Função: resgate pesado, contenção absoluta, sustentação estrutural e contraofensiva de massa
```

## Conceito

O Titan Redeemer chega quando tudo está ruindo. Segura pontes, levanta Jaegers caídos, prende Kaijus, sustenta estruturas e transforma culpa histórica em ação mecânica. Ele não é apenas tanque: é um Jaeger de dilema, porque segurar pode destruir o braço e soltar pode matar civis.

```text
O Titan Redeemer não existe para chegar bonito. Ele existe para chegar quando tudo está ruindo — e segurar.
```

## Atributos

```text
Potência: +10
Estrutura: +10
Mobilidade: +4
Precisão: +6
Sensores: +8
Fluxo: +9
Interface: +8
```

## Combate

```text
Integridade Estrutural: 330
Defesa: 12
Defesa em Ancoragem Titânica: 17 contra empurrão, queda, tração e esmagamento
Defesa em Sustentação Redentora: 16 protegendo estrutura, aliado ou zona crítica
Blindagem: 10 frontal / 10 antebraços / 10 ombros / 9 torso / 9 pernas / 8 lateral / 6 traseira / 7 juntas / 9 Conn-Pod
Deslocamento: 1 zona; pesado 2 zonas se não sustenta carga; resgate 2 zonas com custo se sob ataque
Reações: 1; 2 se ancorado; 3 em resgate com sensores limpos e custo
Dano base: 3d10 + Potência
Punho Redentor: 4d10 + Potência
Compressão Pesada: 4d8 + Estrutura por rodada
Pulso Redentor: 3d10 + Interface ou Potência
Golpe de Massa Absoluta: 5d10 + Potência
Guarda Redentora: redução 2d12 + Estrutura
```

## Marcadores

- Carga Redentora: 0 livre / 1 peso assumido / 2 sustentação ativa / 3 carga controlada / 4 limite perigoso / 5 estrutura sob redenção / 6 colapso provável / 7 sacrifício mecânico
- Pressão de Sustentação: 0 livre / 1 articulações carregadas / 2 ombros e coluna / 3 quadril e pernas / 4 limite / 5 falha estrutural / 6 ruptura iminente
- Culpa de Fluxo: 0 missão clara / 1 peso leve / 2 responsabilidade / 3 carga moral / 4 limite / 5 culpa amplificada / 6 colapso emocional

## Ataques e manobras

- Sustentar o Impossível — d20 + Estrutura/Potência/Vontade/Drift; Carga +1 por rodada; segura estrutura, Jaeger, Kaiju ou zona.
- Punho Redentor — d20 + Potência/Estrutura; 4d10 + Potência; causa recuo, placa amassada ou desbalanceamento.
- Ancoragem Titânica — d20 + Estrutura/Potência/Interface/Fluxo; impede avanço ou estabiliza carga.
- Resgate de Ferro — d20 + Potência/Sensores/Interface/Mente; estabiliza, levanta, remove destroço ou salva Conn-Pod.
- Compressão Pesada — d20 + Potência/Estrutura/Fluxo; dano inicial 3d8 + Potência, mantido 4d8 + Estrutura.
- Não Soltar — d20 + Vontade/Estrutura/Potência/Drift; Estresse +1, Carga +1, Pressão +1; mantém carga impossível por mais uma rodada.

## Avarias específicas

- Ombro em Pressão — próxima sustentação com esse lado sofre -1.
- Pé Afundando — Ancoragem Titânica -2 em terreno ruim.
- Coluna Redentora Rachada — Carga máxima segura reduzida para 3.
- Colapso Parcial de Sustentação — Sustentar o Impossível bloqueado até Redistribuição CD 18.
- Peso Fantasma — após missão, pilotos ainda sentem a carga; Estresse +2 até Confirmar Missão.

## Nota do mestre

Forte demais para segurar, lento demais para resolver tudo. A pergunta é o que vale a pena carregar e quando carregar mais deixa de ser salvação.

---

# 3. SABER ATHENA — MARK-VI

## Identidade

```text
Nome: Saber Athena
ID: saber-athena
Geração: Mark-VI / Lâmina, velocidade e precisão neural
Função: duelo avançado, corte de movimento, abertura de blindagem e finalização cirúrgica
```

## Conceito

O Saber Athena é uma plataforma de combate corpo a corpo construída para que lâmina, piloto e Jaeger sejam uma única intenção. Ele corta movimento, abre blindagem, pune velocidade e transforma o corpo em arma de precisão.

```text
O Saber Athena não segura o Kaiju. Ele corta o movimento que permitiria ao Kaiju vencer.
```

## Atributos

```text
Potência: +7
Estrutura: +7
Mobilidade: +10
Precisão: +10
Sensores: +9
Fluxo: +9
Interface: +9
```

## Combate

```text
Integridade Estrutural: 268
Defesa: 19
Defesa em Dança de Lâminas: 20 contra ataques corpo a corpo previstos
Defesa contra ataque pesado frontal direto: 16
Defesa se lâmina estiver presa: 14
Blindagem: 7 frontal / 6 lateral / 5 traseira / 6 ombros / 7 antebraços-lâmina / 6 torso / 6 pernas / 5 juntas / 7 Conn-Pod
Deslocamento: 4 zonas; dança 4 zonas + mudança de ângulo; forçado 5 zonas com custo
Reações: 3; 4 em Dança de Lâminas por até 2 rodadas
Dano físico: 2d10 + Potência
Lâmina simples: 3d10 + Precisão
Corte Simétrico: 4d8 + Precisão
Corte de Movimento: 4d8 + Mobilidade ou Precisão
Execução Athena: 5d10 + Precisão
Bloqueio de Fio: redução 2d8 + Precisão
```

## Marcadores

- Ritmo de Lâmina: 0 corpo armado sem fluxo / 1 guarda / 2 alinhamento / 3 dança ativa / 4 simetria / 5 corte absoluto
- Tensão de Borda: 0 fio limpo / 1 operação / 2 aquecida / 3 repetição / 4 limite / 5 instável / 6 falha iminente
- Lâmina Fantasma: 0 sem resíduo / 1 sensação / 2 cuidado excessivo / 3 borda fora do cockpit / 4 limite clínico / 5 confusão braço-lâmina / 6 colapso

## Ataques e manobras

- Dança de Lâminas — d20 + Mobilidade/Precisão/Fluxo/Drift; gera Ritmo +1.
- Corte Simétrico — d20 + Precisão/Mobilidade/Fluxo; 4d8 + Precisão; requer Ritmo 2+.
- Corte de Movimento — d20 + Precisão/Mobilidade/Mente; reduz deslocamento, salto ou avanço do Kaiju.
- Bloqueio de Fio — d20 + Precisão/Interface/Mobilidade; reduz 2d8 + Precisão; Tensão +1 se bloquear ataque pesado.
- Confirmação de Borda — d20 + Sensores/Interface/Mente/Drift; confirma alcance, energia e risco de aliado/cenário.
- Execução Athena — d20 + Precisão/Fluxo/Mobilidade; 5d10 + Precisão; requer Ritmo 4+, janela real e linha limpa.

## Avarias específicas

- Fio Tremendo — próximo Corte Simétrico -1.
- Sensor de Borda Falso — Confirmação de Borda obrigatória antes de Execução Athena.
- Lâmina Presa — Defesa -2, Mobilidade -2, Ritmo zera; soltar CD 17.
- Falha de Borda — Tensão vai para 6; recolher ou quebrar/travar.

## Nota do mestre

Letal, mas não corta tudo. Precisa de ritmo, ângulo, linha limpa e controle de Tensão. Puna spam de Execução Athena e cortes em zona cheia de aliados sem confirmação.

---

# 4. GIPSY AVENGER — MARK-VI

## Identidade

```text
Nome: Gipsy Avenger
ID: gipsy-avenger
Geração: Mark-VI / Herança, equilíbrio e lenda reconstruída
Função: plataforma híbrida de combate, plasma, lâmina, punho, defesa e continuidade sob dano
```

## Conceito

O Gipsy Avenger não é cópia do Gipsy Danger. É uma máquina de sexta geração tentando preservar equilíbrio, resiliência, resposta de Fluxo, versatilidade e capacidade de continuar lutando quando máquinas especializadas colapsariam.

```text
O Gipsy Avenger não existe para apagar o Gipsy Danger. Ele existe para provar que algumas lendas não terminam quando viram monumentos.
```

## Atributos

```text
Potência: +8
Estrutura: +8
Mobilidade: +8
Precisão: +8
Sensores: +8
Fluxo: +9
Interface: +9
```

## Combate

```text
Integridade Estrutural: 285
Defesa: 17
Defesa em Resposta Avenger: 18
Defesa em Peito de Legado: 19 contra impacto frontal único, com custo
Defesa se lâmina presa: 15
Defesa se plasma superaquecido: 16
Blindagem: 8 frontal / 8 peito / 7 antebraços / 7 ombros / 7 pernas / 6 lateral / 5 traseira / 6 juntas / 8 Conn-Pod
Deslocamento: 3 zonas; continuidade 4 zonas com Ritmo
Reações: 3; 4 em Resposta Avenger por 1 rodada
Punho Avenger: 3d10 + Potência
Plasma Integrado: 4d10 + Interface ou Precisão
Lâmina de Retaliação: 4d8 + Precisão
Sequência Avenger: 4d10 + Potência ou Precisão
Finalização Gipsy: 5d10 + Fluxo ou Precisão
```

## Marcadores

- Ritmo Avenger: 0 sem continuidade / 1 postura / 2 arma e corpo / 3 sequência híbrida / 4 integração lendária / 5 lenda respirando
- Tensão de Integração: 0 limpa / 1 alternância / 2 sistemas ativos / 3 alta carga / 4 limite / 5 sobreposição / 6 falha iminente
- Eco de Lenda: 0 nome / 1 reconhecimento / 2 propósito / 3 lenda ativa / 4 limite / 5 memória e missão se misturam / 6 Sangramento de Memória

## Ataques e manobras

- Resposta Avenger — d20 + Interface/Fluxo/Mobilidade/Drift; gera Ritmo +1 ou mantém sequência.
- Punho Avenger — d20 + Potência/Fluxo; 3d10 + Potência; recuo, placa amassada ou Ritmo +1.
- Plasma Integrado — d20 + Interface/Precisão/Fluxo; 4d10 + Interface/Precisão; Calor +1; abre placa ou janela de lâmina.
- Lâmina de Retaliação — d20 + Precisão/Potência/Fluxo; 4d8 + Precisão; ideal após abertura.
- Sequência Avenger — d20 + Interface/Fluxo/Precisão/Potência; 4d10 + Potência/Precisão; requer Ritmo 2+.
- Eco de Lenda — d20 + Drift/Vontade/Fluxo; custo emocional; próxima ação +2/+3 em momento real.
- Finalização Gipsy — d20 + Fluxo/Precisão/Potência; 5d10 + Fluxo/Precisão; requer Ritmo 4+ e abertura real.

## Avarias específicas

- Retorno de Plasma — próximo Plasma Integrado -1.
- Caster Instável — Plasma gera Calor +1 em falha.
- Integração Quebrada — não combina plasma + lâmina + corpo na mesma rodada.
- Sangramento de Memória — Eco 6; CD 18 Mente/Vontade/Drift.

## Nota do mestre

Versatilidade com alma, mas não o melhor em tudo. Recompensa sequência lógica e pune spam de ferramentas. O perigo é tentar corresponder ao nome em vez de cumprir a missão.

---

# 5. NOVEMBER AJAX — MARK-VI

## Identidade

```text
Nome: November Ajax
ID: november-ajax
Geração: Mark-VI / Patrulha, contenção urbana e controle de perímetro
Função: contenção urbana, evacuação, perímetro, neutralização e captura de ameaças tecnológicas
```

## Conceito

O November Ajax é autoridade mecânica. Ele impede que uma crise vire massacre em cidade, porto, ferro-velho, laboratório clandestino, zona contaminada ou perímetro cheio de civis.

```text
O November Ajax não vence porque destrói primeiro. Ele vence porque coloca uma linha no chão e garante que nada passe.
```

## Atributos

```text
Potência: +7
Estrutura: +8
Mobilidade: +7
Precisão: +8
Sensores: +10
Fluxo: +8
Interface: +10
```

## Combate

```text
Integridade Estrutural: 276
Defesa: 16
Defesa em Linha de Contenção: 19 contra avanço, travessia, fuga ou ameaça ao perímetro
Defesa em Protocolo Urbano: 18 protegendo civis, rota ou estrutura
Defesa contra ataque pesado frontal: 15
Defesa se Laço Ajax estiver preso/invertido: 14
Blindagem: 8 frontal / 8 antebraços / 7 ombros / 7 torso / 7 pernas / 6 lateral / 5 traseira / 6 juntas / 8 Conn-Pod
Deslocamento: 3 zonas; interceptação 4 zonas com custo; ancorado 1 zona
Reações: 3; 4 em Linha de Contenção se forem conter, bloquear, puxar ou proteger
Punho Ajax: 3d8 + Potência
Pulso de Interdição: 3d8 + Interface
Laço Ajax: 2d10 + Precisão ou Interface
Contenção Forçada: 3d8 + Potência por rodada
Queda Controlada: 4d8 + Interface ou Potência
```

## Marcadores

- Linha de Contenção: 0 sem linha / 1 perímetro marcado / 2 ameaça direcionada / 3 contenção ativa / 4 perímetro sob controle / 5 contenção absoluta
- Pressão de Protocolo: 0 limpo / 1 leitura / 2 múltiplas rotas / 3 civis e ameaça / 4 limite / 5 excesso / 6 paralisia
- Contenção Invertida: 0 limpo / 1 cabo sob tensão / 2 vetor instável / 3 Ajax puxado / 4 risco de queda/dano / 5 colapso

## Ataques e manobras

- Leitura Urbana — d20 + Sensores/Interface/Mente/Drift; Linha +1 ou revela risco urbano.
- Linha de Contenção — d20 + Interface/Estrutura/Mente/Drift; protege rota/perímetro.
- Laço Ajax — d20 + Precisão/Interface/Sensores/Potência; 2d10 + Precisão/Interface; prende, puxa, freia ou redireciona.
- Pulso de Interdição — d20 + Interface/Sensores/Precisão; 3d8 + Interface; Calor +1; interrompe mordida, avanço ou agarrão.
- Fechar Avenida — d20 + Estrutura/Interface/Mente/Vontade; bloqueia rua, ponte, doca, portão ou corredor.
- Neutralização Não Letal — d20 + Interface/Sensores/Precisão/Mente; 2d8 + Interface contra sistemas; captura drones/mechas sem explosão.

## Avarias específicas

- Mapa Piscando — próxima Leitura Urbana -1.
- Sensor Urbano Cego — Linha máxima 3 até recalibrar.
- Contenção Invertida — Ajax é puxado, cabo prende ou vetor ameaça cenário.
- Paralisia de Protocolo — Pressão 6; perde 1 reação até Simplificar Protocolo.

## Nota do mestre

Ganha segundos, fecha rotas, reduz dano colateral e captura ameaça. Não é finalizador. Puna força bruta em área civil e cabo mantido em vetor ruim.

---

# 6. VALOR OMEGA — MARK-VI

## Identidade

```text
Nome: Valor Omega
ID: valor-omega
Geração: Mark-VI / Protocolo final de ruptura
Função: ruptura final, golpe de encerramento e combate contra ameaças críticas
```

## Conceito

O Valor Omega entra quando a batalha passou do ponto crítico. Ele não prolonga combate. Ele encerra — se os pilotos aceitarem o custo, se houver linha limpa e se a autorização neural permitir.

```text
O Valor Omega não entra em campo para prolongar a batalha. Ele entra para decidir se ainda existe batalha depois do próximo golpe.
```

## Atributos

```text
Potência: +10
Estrutura: +9
Mobilidade: +5
Precisão: +7
Sensores: +8
Fluxo: +10
Interface: +9
```

## Combate

```text
Integridade Estrutural: 310
Defesa: 14
Defesa em Ancoragem Omega: 18 contra empurrão, recuo, tração e impacto frontal
Defesa em Autoridade Final: 17 assumindo linha crítica
Defesa durante Estado Omega: 16 base / 19 contra impacto frontal previsto
Defesa se aterramento comprometido: 12
Defesa se coluna desalinhada: 13
Blindagem: 9 frontal / 9 peito Omega / 8 ombros / 8 antebraços / 8 pernas / 7 lateral / 5 traseira / 6 juntas / 9 Conn-Pod
Deslocamento: 2 zonas; estratégico 3; ancorado 1; Estado Omega 2
Reações: 2; 3 em Autoridade Final; 3 em Estado Omega por até 2 rodadas
Punho de Valor: 5d10 + Potência
Lance Omega: 6d10 + Interface ou Fluxo
Ruptura Omega: 7d8 + Fluxo ou Potência
Descarga Final: 8d8 + Fluxo
```

## Marcadores

- Autorização Omega: 0 normal / 1 propósito / 2 custo aceito / 3 carga liberada / 4 ruptura autorizada / 5 decisão final
- Carga Omega: 0 normal / 1 pré-carga / 2 distribuída / 3 combate / 4 limite / 5 sobreposição / 6 ruptura interna / 7 ponto Omega
- Estado Omega: 0 desligado / 1 limiar / 2 ruptura controlada / 3 potência segura / 4 limite / 5 colapso provável
- Peso da Última Ordem: 0 claro / 1 responsabilidade / 2 ordem crítica / 3 custo / 4 limite / 5 fardo / 6 colapso moral

## Ataques e manobras

- Confirmar Custo — d20 + Mente/Vontade/Drift/Fluxo; Autorização +1 ou Peso -1.
- Ancoragem Omega — d20 + Estrutura/Interface/Potência/Drift; trava pés, coluna, quadril e ombros para arma pesada.
- Punho de Valor — d20 + Potência/Fluxo/Estrutura; 5d10 + Potência; requer Autorização 2+ ou Carga 3+.
- Lance Omega — d20 + Interface/Fluxo/Precisão; 6d10 + Interface/Fluxo; requer Autorização 3+, Ancoragem, linha limpa e Carga 3+.
- Ativar Estado Omega — d20 + Drift/Vontade/Fluxo/Interface; requer Autorização 4+, Carga 3+, ameaça crítica e custo aceito.
- Ruptura Omega — d20 + Fluxo/Potência/Interface; 7d8 + Fluxo/Potência; requer Estado Omega e janela.
- Descarga de Ruptura Final — d20 + Fluxo/Vontade/Interface; 8d8 + Fluxo; requer Estado Omega, Autorização 5 e consequência obrigatória.

## Avarias específicas

- Banco Instável — próxima ação de Carga Omega -1.
- Autorização Oscilante — Autorização não passa de 4 até Confirmar Custo.
- Coluna Desalinhada — Lance Omega bloqueado; Estado Omega CD +2.
- Negação Omega — Lance e Estado Omega indisponíveis até Recentrar/Confirmar Custo.
- Banco de Potência em Colapso — Carga 7; próxima ação pesada pode causar explosão interna ou travamento.

## Nota do mestre

É clímax. Forte demais, mas nunca casual. Exige autorização, ancoragem, linha limpa, custo aceito e consequência.

---

# 7. MURDER WITCH — MARK-VI

## Identidade

```text
Nome: Murder Witch
ID: murder-witch
Geração: Mark-VI / Predação sensorial e guerra psicológica
Função: caça noturna, emboscada, confusão sensorial, execução rápida e operações sem transmissão
```

## Conceito

O Murder Witch é horror militar em escala Jaeger. Ele não consola o mundo; ele assombra o monstro. Entra quando sensores convencionais estão cegos e o Kaiju precisa errar o mundo por um segundo.

```text
O Murder Witch não vence porque é mais forte. Ele vence porque faz o monstro errar o mundo por um segundo.
```

## Atributos

```text
Potência: +7
Estrutura: +6
Mobilidade: +9
Precisão: +9
Sensores: +10
Fluxo: +9
Interface: +8
```

## Combate

```text
Integridade Estrutural: 255
Defesa: 18
Defesa em Caça na Sombra: 20 contra alvo desorientado ou sem leitura
Defesa em campo aberto sem cobertura: 15
Defesa após Pulso de Assombro: 19 por 1 rodada
Defesa com revestimento danificado: 16
Defesa em Ruído Neural crítico: 14
Blindagem: 7 frontal / 6 lateral / 5 traseira / 6 ombros / 6 antebraços / 5 torso inferior / 6 pernas / 5 juntas / 6 Conn-Pod / 4 sistemas sensoriais
Deslocamento: 4 zonas; sombra 5 zonas; silencioso 3 zonas
Reações: 3; 4 em Caça na Sombra por até 2 rodadas
Garra de Perfuração: 3d8 + Potência
Lâmina de Necropsia: 4d8 + Precisão
Corte de Sombra: 3d10 + Precisão
Execução Bruxa: 5d8 + Precisão ou Fluxo
Pulso de Assombro: 2d8 + Interface
Ruptura Sensorial: 4d8 + Sensores ou Precisão
```

## Marcadores

- Sombra Predatória: 0 visível / 1 assinatura reduzida / 2 alvo confuso / 3 caça ativa / 4 predador dominante / 5 assombro total
- Ruído Neural: 0 limpo / 1 ecos leves / 2 camadas densas / 3 mistura / 4 limite / 5 ecos falsos / 6 colapso
- Eco Sensorial: 0 sem eco / 1 movimento duvidoso / 2 contorno falso / 3 alvo duplicado / 4 ameaça falsa / 5 predador invertido
- Hipervigilância: 0 normal / 1 atenção / 2 dificuldade de relaxar / 3 ameaça em todo ruído / 4 clínico / 5 paranoia / 6 colapso pós-Drift

## Ataques e manobras

- Leitura Passiva — d20 + Sensores/Mente/Interface/Drift; Sombra +1 ou revela posição provável.
- Caça na Sombra — d20 + Mobilidade/Sensores/Interface/Drift; Sombra +1; falha revela posição.
- Pulso de Assombro — d20 + Interface/Sensores/Mente/Drift; 2d8 + Interface; Ruído +1; desorienta ou abre janela.
- Eco Falso — d20 + Sensores/Interface/Mente/Drift; cria alvo/direção/vibração falsa; pode voltar contra cockpit.
- Garra de Perfuração — d20 + Potência/Precisão/Mobilidade; prende e abre janela para lâmina.
- Lâmina de Necropsia — d20 + Precisão/Sensores/Fluxo; 4d8 + Precisão; atinge ponto vulnerável identificado.
- Ruptura Sensorial — d20 + Sensores/Precisão/Mente; remove percepção, camuflagem ou órgão sensorial.
- Execução Bruxa — d20 + Precisão/Fluxo/Sensores; 5d8 + Precisão/Fluxo; requer Sombra 4+ e alvo desorientado.

## Avarias específicas

- Sussurro de Sensor — próxima Leitura Passiva -1.
- Eco Preso — Eco Sensorial não desce abaixo de 1 até Filtrar Ruído.
- Revestimento Rasgado — Caça na Sombra não passa de Sombra 3.
- Colapso de Percepção — Ruído 6; ataques exigem Confirmar Alvo.
- Predador Invertido — Eco 5; o Kaiju usa a lógica de caça contra o Murder Witch.

## Nota do mestre

Poderoso em ambiente certo e perigoso em campo aberto. Recompensa paciência, cenário e confirmação. Puna crueldade, spam de pulso e ataque sem confirmar alvo.

---

# 8. HUNTER VERTIGO — MARK-VI

## Identidade

```text
Nome: Hunter Vertigo
ID: hunter-vertigo
Geração: Mark-VI / Caça tridimensional e perseguição vertical
Função: perseguir Kaijus em altura, fendas, cavernas, cânions, crateras e Terra Oca
```

## Conceito

O Hunter Vertigo existe porque alguns Kaijus pararam de respeitar o chão. Ele escala, prende cabo, usa queda como arma, rouba trajetória e caça quando o campo vira parede, fenda, abismo ou caverna.

```text
O Hunter Vertigo não domina o chão. Ele persegue quando o chão acaba.
```

## Atributos

```text
Potência: +8
Estrutura: +7
Mobilidade: +10
Precisão: +8
Sensores: +9
Fluxo: +9
Interface: +9
```

## Combate

```text
Integridade Estrutural: 275
Defesa: 17
Defesa em Caça Tridimensional: 20
Defesa em chão plano sem verticalidade: 15
Defesa pendurado/ancorado: 18 contra ataque previsto / 14 contra ataque no cabo
Defesa após falha de orientação: 13
Defesa se cabo principal rompido: 15
Blindagem: 7 frontal / 7 peito / 7 ombros / 8 antebraços / 6 lateral / 5 traseira / 7 pernas / 8 joelhos / 7 pés-garra / 6 juntas / 7 Conn-Pod
Deslocamento: 4 zonas; vertical 5; queda controlada 6 com teste e Tensão +1; ancorado 2; chão plano 3
Reações: 3; 4 em Caça Tridimensional; 2 pendurado por cabo único
Punho Vetorial: 3d10 + Potência
Queda Predatória: 5d8 + Mobilidade ou Potência
Impacto de Pêndulo: 4d10 + Potência
Arpão de Antebraço: 3d8 + Precisão
Tração Assimétrica: 3d10 + Interface ou Potência
Roubar Trajetória: 4d8 + Interface ou Mobilidade
```

## Marcadores

- Orientação Vetorial: 0 chão / 1 ancoragem reconhecida / 2 eixo vertical / 3 caça 3D / 4 domínio vetorial / 5 vertigem como arma
- Tensão de Cabo: 0 livres / 1 ancoragem leve / 2 tração / 3 carga pesada / 4 limite / 5 vermelho / 6 ruptura
- Vertigem Neural: 0 limpa / 1 inclinação / 2 alerta / 3 queda sentida / 4 limite / 5 mundo girando / 6 colapso
- Fadiga de Pouso: 0 limpo / 1 impacto / 2 joelhos / 3 limite / 4 perigo / 5 perna em vermelho / 6 colapso

## Ataques e manobras

- Leitura Vetorial — d20 + Sensores/Interface/Mente/Drift; Orientação +1 ou revela ponto seguro.
- Ancoragem Vetorial — d20 + Interface/Precisão/Mobilidade/Drift; prende cabo em estrutura, rocha, Kaiju ou terreno.
- Caça Tridimensional — d20 + Mobilidade/Interface/Sensores/Drift; Orientação +1 e deslocamento vertical liberado.
- Queda Predatória — d20 + Mobilidade/Potência/Fluxo/Drift; 5d8 + Mobilidade/Potência; requer altura/cabo/parede/fenda.
- Impacto de Pêndulo — d20 + Mobilidade/Interface/Potência; 4d10 + Potência; requer cabo e arco.
- Tração Assimétrica — d20 + Interface/Potência/Precisão/Drift; vira, derruba ou expõe ponto fraco.
- Roubar Trajetória — d20 + Interface/Mobilidade/Mente/Drift; altera salto, queda, escalada, investida ou fuga do Kaiju.
- Confirmar Horizonte — d20 + Mente/Vontade/Drift/Interface; reduz Vertigem ou libera ataque especial.

## Avarias específicas

- Horizonte Piscando — próxima Leitura Vetorial -1.
- Joelho em Sobrecarga — Fadiga +1 em toda queda/pouso forte.
- Cabo Rompido — Orientação -2, Vertigem +2 e risco de queda.
- Colapso de Orientação — Vertigem 6; ataques especiais exigem Confirmar Horizonte.
- Pânico Vetorial — CD 18 Mente/Vontade/Drift; falha causa Estresse +2, Orientação zera e próxima ação vertical -2.

## Nota do mestre

Absurdo em ambiente vertical e limitado em chão plano. Recompensa ponto de ancoragem, queda controlada e confirmação de horizonte. Pune manobra bonita sem rota de pouso.

---

# TABELA RESUMIDA DOS MARK-VI

```text
Guardian Bravo  — proteção de zona, interposição, defesa integrada.
Titan Redeemer  — resgate pesado, sustentação, peso moral e ancoragem.
Saber Athena    — lâmina, velocidade, corte de movimento e precisão.
Gipsy Avenger   — equilíbrio, legado, plasma, lâmina e sequência híbrida.
November Ajax   — contenção urbana, perímetro, captura e protocolo.
Valor Omega     — protocolo final, autorização, ruptura e clímax.
Murder Witch    — caça sombria, guerra sensorial, emboscada e medo.
Hunter Vertigo  — verticalidade, cabos, queda, tração e perseguição 3D.
```

# REGRAS DE BALANCEAMENTO ENTRE MARK-VI

```text
Guardian protege, mas não finaliza rápido.
Titan sustenta, mas é lento.
Saber corta, mas sofre agarrão e impacto bruto.
Avenger faz de tudo, mas paga tensão e peso simbólico.
Ajax contém, mas não é executador.
Valor destrói, mas exige autorização e custo.
Murder caça, mas sofre em campo aberto e ruído neural.
Hunter persegue em 3D, mas depende de ancoragem e orientação.
```

# QUANDO PERMITIR ACESSO AOS PLAYERS

```text
Guardian Bravo: bom primeiro Mark-VI de resposta na Parte 2.
Titan Redeemer: acesso condicional para missão de resgate/dilema.
Saber Athena: acesso condicional para dupla precisa e técnica.
Gipsy Avenger: acesso alto para protagonistas/veteranos.
November Ajax: acesso médio em missões urbanas, submundo e contenção.
Valor Omega: acesso muito baixo, clímax ou autorização extrema.
Murder Witch: acesso raro, operações secretas, Terra Oca ou Kaiju furtivo.
Hunter Vertigo: acesso condicional em fendas, cavernas e Terra Oca.
```

# COMO USAR NO CODEX/SITE

Cada ficha pode virar:

```text
- Card de Jaeger
- Aba de atributos
- Aba de ataques
- Aba de marcadores
- Aba de avarias
- Aba de riscos de Fluxo
- Aba de notas do mestre
- Botões de rolagem de d20 + atributo
- Rastreador de Calor, Estresse e marcador especial
- Rastreador de Integridade Estrutural
- Tabela de local de impacto
```

# REGRA DE OURO

```text
Quanto mais poderoso o Jaeger,
mais específica deve ser a condição para ele brilhar
e mais caro deve ser forçar esse brilho fora de hora.
```

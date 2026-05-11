# FICHAS DOS JAEGERS MARK-4 — CÍRCULO DE FOGO RPG

**Arquivo-fonte consolidado para Codex / sistema de combate / consulta do mestre**  
**Geração:** Mark-4  
**Uso:** fichas jogáveis de Jaegers, balanceamento de combate, referência de narrativa, missões paralelas, testes de compatibilidade e combates de mesa.

---

## NOTA GERAL DOS MARK-4

Os **Mark-4** representam uma virada na guerra contra os Kaijus. Os Mark-1 ensinaram a humanidade a ficar de pé. Os Mark-2 ensinaram especialização. Os Mark-3 amadureceram o combate, tornando os Jaegers mais capazes de enfrentar Kaijus variados em missões reais. Os Mark-4, porém, começam a transformar cada Jaeger em uma doutrina de guerra completa.

Essa geração não é apenas “mais forte”. Ela é mais complexa, mais sensível, mais cara e mais perigosa para os pilotos. Cada Mark-4 resolve um problema específico do campo de batalha, mas também cobra um preço claro em **Calor**, **Estresse**, **Sobrecarga**, **instabilidade neural**, **risco de falha sistêmica** ou **dificuldade tática**.

A regra de ouro para esta geração é:

> **Um Mark-4 nunca deve ser só um bônus maior. Ele deve entregar uma vantagem clara e cobrar um risco claro.**

### Escala padrão de atributos Mark-4

A escala recomendada dos Mark-4 fica normalmente entre `+4` e `+8`, sendo `+8` reservado para a especialidade real do Jaeger.

Atributos usados nas fichas:

- **Potência:** força física, impacto, dano bruto, empurrão, compressão.
- **Estrutura:** resistência, blindagem, sustentação, tolerância a dano, estabilidade física.
- **Mobilidade:** deslocamento, giro, reposicionamento, resposta corporal.
- **Precisão:** mira, corte, ataque localizado, controle fino, timing.
- **Sensores:** leitura de campo, alvo, terreno, aliados, frequência, energia ou ameaça.
- **Fluxo:** sincronia neural, Drift, aceitação corporal do Jaeger, ações especiais ligadas ao sistema neural.
- **Interface:** controle técnico, estabilização, sistemas internos, armas especiais, filtros, comando e leitura operacional.

### Interação com atributos dos players

Os atributos pessoais dos players podem entrar como modificadores quando a ação depende mais do piloto do que da máquina. Como regra simples:

- **Força do player:** sustentar comando físico pesado, resistir retorno corporal, manter agarrão.
- **Constituição:** resistir impacto, calor, zumbido, pressão, fadiga, dor neural.
- **Vontade:** continuar, parar, não entrar em pânico, resistir impulso, manter decisão.
- **Habilidade:** timing, reposicionamento, controle fino, manobras rápidas.
- **Mente:** leitura tática, cálculo, priorização, entendimento de sistema, interpretação de sensores.
- **Drift/Fluxo pessoal:** sincronia, conexão dupla, estabilidade emocional e neural dentro do Conn-Pod.

---

# 1. CRIMSON TYPHOON — MARK-4

## Identidade

**Nome:** Crimson Typhoon  
**ID:** `crimson-typhoon`  
**Geração:** Mark-4  
**Doutrina:** coordenação multivetorial  
**Função:** pressão simultânea, defesa e ataque em camadas, combate corpo a corpo técnico com três braços.  
**Risco central:** sobrecarga anatômica por aceitar um corpo com mais braços do que a mente humana deveria ter.

O **Crimson Typhoon** não é apenas um Jaeger com um braço extra. Ele é uma máquina feita para agir em **mais de um vetor ao mesmo tempo**. Um braço pode bloquear, outro pode prender, e o terceiro pode atacar. Um braço pode abrir a guarda, outro pode puxar a placa, e o terceiro pode finalizar a abertura. Isso muda completamente o ritmo de combate.

A frase central dele é:

> **O Crimson Typhoon não vence por bater mais forte. Ele vence porque faz o Kaiju responder a três problemas ao mesmo tempo.**

## Atributos

```text
Potência:   +6
Estrutura:  +6
Mobilidade: +6
Precisão:   +7
Sensores:   +7
Fluxo:      +8
Interface:  +7
```

## Combate

```text
Integridade Estrutural: 245
Defesa: 16
Blindagem: 7 frontal / 6 lateral / 5 traseira / 6 ombros / 6 braços / 5 juntas / 6 Conn-Pod / 7 anel torácico
Deslocamento: 2 zonas
Deslocamento de compensação: 3 zonas
Deslocamento forçado: 3 zonas, com Calor +1
Reações: 2 por rodada; 3 com Guarda Multivetorial estável
Dano base: 2d10 + Potência
Dano de sequência: 3d8 + Precisão
Dano multivetorial: 3d10 + Precisão
Dano de Tempestade Carmesim: 4d8 + Precisão ou Fluxo
Calor máximo seguro: 6
Estresse seguro: até 4
Sincronia mínima: 66%
Sincronia ideal: 80%–92%
```

## Marcador especial — Coordenação Multivetorial

```text
0 — corpo comum tentando pilotar corpo impossível
1 — três braços reconhecidos
2 — vetores funcionais
3 — tempestade controlada
4 — sincronia multivetorial extrema
5 — sobrecarga anatômica iminente
```

### Ganho de Coordenação

- +1 ao completar sequência com dois braços.
- +1 ao bloquear e atacar na mesma rodada sem falha.
- +1 ao usar Sequência Tríplice com sucesso.
- +1 ao passar em teste de Fluxo de Coordenação Multivetorial.
- +1 quando os pilotos aceitam o terceiro braço sem hesitação neural.

### Perda de Coordenação

- -1 se um braço sofre avaria.
- -1 se o anel torácico sofre dano.
- -1 se sensores de posição falham.
- -1 se os pilotos discordam sobre qual braço deve agir.
- Zera se o Crimson cai, sofre travamento de dois braços ou entra em colapso neural.

## Marcador secundário — Sobrecarga Anatômica

```text
0 — anatomia aceita
1 — presença estranha do terceiro braço
2 — reflexo involuntário leve
3 — dor fantasma ou confusão de membro
4 — limite perigoso
5 — colapso anatômico neural
```

A Sobrecarga sobe quando o Crimson usa três braços na mesma rodada, executa Tempestade Carmesim, sofre dano em um braço que os pilotos continuam sentindo no Fluxo ou quando a Coordenação chega a níveis extremos.

## Sistemas principais

### FC-4A — Fluxo de Coordenação Multivetorial

Permite ações multivetoriais, Sequência Tríplice, Guarda Multivetorial e Tempestade Carmesim. O risco é a mente aceitar rápido demais um corpo não humano.

### Anel Torácico Multivetorial

Sustenta três ombros, distribui torque e impede que um braço puxe o torso para fora do eixo. Se danificado, todos os braços sofrem.

### Corpo Trivectorial

Permite combinar uma ação principal com uma ação auxiliar de braço quando a Coordenação está estável.

## Ataques e manobras

### Punho Carmesim

```text
d20 + Potência ou Precisão
Dano: 2d10 + Potência
Sucesso forte: +1d10 ou Desbalanceado
Crítico: cria Janela de Sequência
```

Ataque físico básico. Confiável, útil para abrir guarda e iniciar combos.

### Braço de Interceptação

```text
d20 + Interface ou Estrutura
Redução: 1d10 + Estrutura
Custo: Coordenação 1 ou Calor +1
Crítico: pode abrir Sequência Tríplice
```

Um braço bloqueia enquanto outro prepara resposta.

### Garra de Vetor

```text
d20 + Potência, Precisão ou Fluxo
Dano: 1d8 + Potência
Efeito: Parcialmente Preso / Preso / Flanco Aberto
```

Agarrão rápido usado para abrir ataque de outro braço.

### Sequência Tríplice

```text
d20 + Fluxo ou Interface
Dano: 3d8 + Precisão
Requisito: três braços funcionais
Custo: Coordenação 2 e Sobrecarga +1
```

A habilidade central do Crimson. Um braço bloqueia, outro prende, outro ataca. Em crítico, pode abrir Janela de Finalização ou retirar ação do Kaiju.

### Guarda Multivetorial

```text
d20 + Interface, Sensores ou Fluxo
Custo: Coordenação 2 ou Calor +1
Efeito: +1/+2 Defesa contra múltiplos ataques
Crítico: Coordenação +1
```

Defesa em camadas, excelente contra Kaijus de múltiplos membros.

### Tempestade Carmesim

```text
d20 + Fluxo
Dano: 4d8 + Fluxo ou Precisão
Requisito: Coordenação 3+ e três braços funcionais
Custo: Coordenação 2, Sobrecarga +2 e Estresse +1
Falha crítica: Colapso Multivetorial
```

Ataque extremo. Forte, cinematográfico e perigoso. Nunca deve ser usado sem custo.

### Lâmina Rotativa Carmesim — opcional

```text
d20 + Precisão ou Fluxo
Dano: 3d8 + Precisão
Custo: Calor +1
Efeito: Corte Profundo, Tendão Cortado ou Placa Aberta
```

Módulo de curto alcance, usado como complemento de combo, não como arma principal gratuita.

## Avarias específicas

```text
Braço Atrasado — próxima ação multivetorial -1.
Ruído de Terceiro Membro — ações com o terceiro braço -1.
Sensor de Coordenação Falhando — Percepção Multivetorial -2.
Anel Torácico em Tensão — Sequência Tríplice e Guarda Multivetorial -1.
Terceiro Braço Travado — Tempestade Carmesim indisponível, Coordenação máxima 2.
Anel Torácico Comprometido — todos os braços -2 em ações simultâneas.
Colapso Multivetorial — Coordenação zera, Sobrecarga +2, Estresse +2.
Membro Fantasma Pós-Drift — risco neural após missão.
Anel Partido — ações simultâneas indisponíveis.
```

## Tabela rápida de impacto

```text
1–2   Cabeça / Conn-Pod / FC-4A
3–4   Torso / anel torácico
5–6   Coluna axial / compensação de torque
7–8   Ombro superior / terceiro braço
9–10  Ombro lateral direito
11–12 Ombro lateral esquerdo
13–14 Antebraços
15    Mãos
16    Quadril
17    Pernas
18    Pés
19    Sensores distribuídos
20    Colapso Multivetorial / Membro Fantasma / Anel Partido
```

## Nota do mestre

Recompense players que pensam em sequência, dividem funções entre braços, preparam Coordenação e respeitam Sobrecarga Anatômica. Puna spam de Tempestade Carmesim, uso de três braços sem leitura, terreno ruim ignorado e dano em anel torácico tratado como se fosse simples.

---

# 2. HYDRA CORINTHIAN — MARK-4

## Identidade

**Nome:** Hydra Corinthian  
**ID:** `hydra-corinthian`  
**Geração:** Mark-4  
**Doutrina:** redundância adaptativa  
**Função:** sobreviver a dano, adaptar abordagem, manter função parcial e continuar lutando em combate degradado.  
**Risco central:** excesso de alertas, corpo remendado em tempo real e falha cruzada.

O Hydra não promete perfeição. Ele promete continuidade. Ele foi construído assumindo que sistemas vão falhar, membros vão ser danificados e sensores vão apagar. O diferencial é que ele ainda encontra algum modo de seguir.

> **O Hydra Corinthian não pergunta como voltamos ao normal. Ele pergunta: o que ainda funciona — e como usamos isso para vencer?**

## Atributos

```text
Potência:   +5
Estrutura:  +7
Mobilidade: +5
Precisão:   +5
Sensores:   +7
Fluxo:      +7
Interface:  +8
```

## Combate

```text
Integridade Estrutural: 240
Defesa: 15
Blindagem: 7 frontal modular / 6 lateral / 5 traseira / 6 ombros / 6 antebraços / 6 pernas / 5 juntas / 6 Conn-Pod / 7 torso segmentado
Deslocamento: 2 zonas
Deslocamento degradado: 1 zona
Deslocamento compensado: 2 zonas com Marcha Degradada bem-sucedida
Deslocamento forçado: 3 zonas, com Calor +1
Reações: 2 por rodada; 1 em modo degradado pesado; 3 se módulo defensivo equipado
Dano base: 2d10 + Potência
Dano modular: 3d8 + Precisão
Dano de impacto adaptativo: 3d10 + Potência
Dano de contenção com módulo: 2d8 + Potência
Calor máximo seguro: 6
Estresse seguro: até 4
Sincronia mínima: 64%
Sincronia ideal: 78%–90%
```

## Marcador especial — Redundância

```text
0 — sem reserva útil
1 — uma rota auxiliar
2 — reservas funcionais
3 — rede redundante estável
4 — múltiplas camadas ativas
5 — emergência complexa
```

A Redundância é recurso de sobrevivência. Ela reduz avaria, mantém membro funcionando parcialmente, ativa sensor secundário ou impede queda. Não deve ser tratada como “vida extra infinita”.

### Custo recomendado

```text
Gastar 1: reduzir avaria grave para média, ativar sensor secundário, manter membro parcial.
Gastar 2: evitar colapso de membro, manter Jaeger de pé após dano crítico.
Gastar 3: momento extremo de sobrevivência; sempre gera Estresse +1 ou +2.
```

## Marcador secundário — Degradação Operacional

```text
0 — operação limpa
1 — um setor em modo auxiliar
2 — múltiplos alertas leves
3 — corpo remendado em combate
4 — risco alto de falha cruzada
5 — colapso operacional próximo
```

A Degradação sobe sempre que a Redundância é usada ou quando setores entram em modo auxiliar. Quanto mais o Hydra se recusa a cair, mais difícil fica pilotar.

## Configuração de missão

O Hydra possui **3 slots modulares**:

```text
Slot 1 — Antebraço direito
Slot 2 — Antebraço esquerdo
Slot 3 — Módulo dorsal ou suporte interno
```

Módulos possíveis:

```text
Lâmina Curta Modular
Gancho de Contenção
Carga de Impacto
Cabo de Emergência
Placa Defensiva Expansível
Sensor Secundário Especializado
Kit de Microreparo de Campo
Filtro Anti-Corrosão Parcial
Estabilizador de Marcha Degradada
```

## Sistemas principais

### FC-4B — Fluxo de Redundância Adaptativa

Permite aceitar um corpo que muda de estado durante a luta. O braço não morreu: entrou em meia potência. A perna não quebrou: está em marcha degradada. O sensor não apagou: foi substituído por leitura secundária.

### Rede Redundante

Conecta coluna principal, espinhas auxiliares, torso e quadril. Uma vez por combate, pode reduzir avaria estrutural grave para média se ainda estiver íntegra.

### Braços Independentes

Dano em um braço não derruba automaticamente o outro.

### Marcha Degradada

Permite continuar andando mesmo com perna, tornozelo ou quadril danificado.

## Ataques e manobras

### Punho Adaptativo

```text
d20 + Potência ou Interface
Dano: 2d10 + Potência
Sucesso forte: +1d8 ou Desbalanceado leve
Crítico: ativa módulo como ação auxiliar, se equipado
```

### Sistema Secundário Ativado

```text
d20 + Interface, Sensores ou Fluxo
Custo: Redundância 1
Efeito: reduz avaria em 1 nível ou mantém função parcial
Falha crítica: Falha Cruzada
```

### Não Cai Ainda

```text
d20 + Estrutura, Fluxo ou Vontade
Custo: Redundância 2 e Estresse +1
Efeito: continua de pé ou mantém função parcial
Crítico: abre ação de resposta
```

### Lâmina Curta Modular

```text
d20 + Precisão ou Interface
Dano: 3d8 + Precisão
Efeito: Tendão Cortado, Placa Aberta ou Mobilidade Reduzida
```

### Gancho de Contenção

```text
d20 + Potência, Precisão ou Interface
Dano: 1d8 + Potência
Efeito: Parcialmente Preso / Preso / direção controlada
```

### Carga de Impacto

```text
d20 + Precisão ou Interface
Dano: 3d10 + Precisão
Uso limitado por missão
Efeito: Placa Rachada ou Articulação Comprometida
```

### Cabo de Emergência

```text
d20 + Precisão, Sensores ou Interface
Uso: prender, puxar, resgatar ou impedir queda
Crítico: salva aliado, interrompe avanço ou muda o campo
```

### Placa Defensiva Expansível

```text
d20 + Interface ou Estrutura
Redução: 1d10 + Estrutura
Custo: Calor +1 se ativada após dano
Crítico: Redundância não precisa ser gasta
```

### Marcha Degradada

```text
d20 + Interface, Mobilidade ou Fluxo
Custo: Redundância 1 se dano grave
Efeito: move mesmo danificado
Crítico: próxima ação +1 pela surpresa tática
```

## Avarias específicas

```text
Alerta Âmbar Persistente — próxima Interface -1.
Sensor Secundário Sujo — leitura secundária -1.
Linha Auxiliar Assumindo — Degradação +1, penalidade principal reduzida.
Módulo Travado — módulo indisponível até Interface CD 15.
Marcha Irregular — deslocamento -1.
Setor em Isolamento — função principal perdida; parcial com Redundância 1.
Falha Cruzada — uma avaria ameaça outro setor.
Corpo Remendado — Degradação mínima 3 até fim do combate.
Redundância Saturada — Redundância bloqueada por 1 rodada.
Colapso Adaptativo — Redundância zera temporariamente, Degradação +2.
```

## Tabela rápida de impacto

```text
1–2   Cabeça / Conn-Pod / FC-4B
3–4   Torso / carapaça modular
5–6   Coluna principal / Rede Redundante
7–8   Espinhas auxiliares
9–10  Ombro direito / central independente
11–12 Ombro esquerdo / central independente
13–14 Antebraços / módulos configuráveis
15    Mãos
16    Quadril
17    Perna direita
18    Perna esquerda
19    Sensores distribuídos
20    Falha Cruzada / Redundância Saturada / Colapso Adaptativo
```

## Nota do mestre

O Hydra é forte quando tudo está dando errado, mas não deve ser especialista em tudo. Recompense preparação modular, leitura de diagnóstico, isolamento de setor e uso inteligente de Redundância. Puna gasto precipitado, ignorar Degradação e usar sistema degradado como se estivesse normal.

---

# 3. NOVA HYPERION — MARK-4

## Identidade

**Nome:** Nova Hyperion  
**ID:** `nova-hyperion`  
**Geração:** Mark-4  
**Doutrina:** superioridade energética dirigida  
**Função:** dano à distância, controle de zona, disparos concentrados, contenção energética e atordoamento por descarga.  
**Risco central:** instabilidade energética, retorno eletro-neural, colapso de condução e dano colateral.

O Nova Hyperion não carrega uma arma de energia. Ele é construído como uma arma de energia tentando continuar sendo um Jaeger. O peito acumula, bancos distribuem, braços conduzem, punhos descarregam e pés aterram.

> **O Nova Hyperion não carrega uma arma de energia. Ele é a arma de energia tentando continuar sendo um Jaeger.**

## Atributos

```text
Potência:   +5
Estrutura:  +6
Mobilidade: +5
Precisão:   +7
Sensores:   +6
Fluxo:      +7
Interface:  +8
```

## Combate

```text
Integridade Estrutural: 238
Defesa: 15
Blindagem: 7 frontal / 6 lateral / 5 traseira / 6 ombros / 6 braços / 5 juntas / 7 torso-núcleo / 6 Conn-Pod / 7 pés de aterramento
Deslocamento: 2 zonas
Deslocamento de reposicionamento: 3 zonas se Carga menor que 3
Deslocamento forçado: 3 zonas, com Calor +1
Reações: 2 por rodada; 1 em Carga 4+; 3 se aterrado e sensores limpos
Dano físico: 2d8 + Potência
Dano de punho energético: 3d8 + Potência ou Precisão
Dano de Disparo Hyperion: 3d10 + Precisão
Dano de Disparo Hyperion carregado: 4d10 + Precisão ou Interface
Dano de Emissão Solar de Emergência: 5d10 + Fluxo ou Interface
Calor máximo seguro: 6
Instabilidade máxima segura: 4
Estresse seguro: até 4
Sincronia mínima: 66%
Sincronia ideal: 80%–92%
```

## Marcador especial — Carga Energética

```text
0 — operação limpa
1 — bancos energizados
2 — braços em condução
3 — disparo ideal
4 — carga alta perigosa
5 — núcleo em pressão
6 — colapso energético iminente
```

Carga 3 é o ponto ideal. Carga 4 ou mais aumenta dano, mas exige teste e pode gerar Instabilidade, Calor ou avarias.

## Marcador secundário — Estabilidade de Condução

```text
0 — condução limpa
1 — ruído leve
2 — linhas aquecidas
3 — condução instável
4 — risco de retorno
5 — descarga interna provável
6 — colapso de condução
```

A Estabilidade piora ao disparar sem aterramento, conduzir com braço danificado, sofrer dano em linha de condução ou falhar em Disparo Hyperion.

## Sistemas principais

### FC-4C — Fluxo de Condução Energética

Transforma intenção em carga. O risco é emoção virar descarga precoce ou medo virar atraso de liberação.

### Núcleo Hyperion

Permite Carga alta, Disparo Hyperion carregado e Emissão Solar de Emergência. Se danificado, o Jaeger vira risco estratégico.

### Bancos de Carga Setorial

Distribuem energia pelo corpo para evitar explosão única.

### Placas de Aterramento

Descarregam energia no solo, estabilizando Carga e Estabilidade.

## Ataques e manobras

### Disparo Hyperion

```text
d20 + Precisão ou Interface
Dano: 3d10 + Precisão
Dano carregado: 4d10 + Precisão ou Interface
Custo: Carga -2
Sucesso forte: ignora 1 carapaça/blindagem ou Placa Queimada
Falha crítica: recuo energético, Estabilidade +1, Calor +1 ou avaria em braço/ombro
```

### Rajada de Condução

```text
d20 + Precisão
Dano: 2d10 + Precisão
Custo: Carga -1
Efeito: interrompe ataque menor, reduz avanço ou muda rota
```

### Punho de Nova

```text
d20 + Potência, Precisão ou Fluxo
Dano: 3d8 + Potência ou Precisão
Custo: Carga -1 ou Calor +1 se sem carga
Efeito: Choque Leve / Atordoado Breve / Membro Tensionado
```

### Impacto Ionizado

```text
d20 + Fluxo ou Potência
Dano: 3d10 + Potência
Requisito: Carga 2+
Custo: Carga -2 e Estresse +1
Falha crítica: Arco Reverso
```

### Feixe de Contenção Energética

```text
d20 + Interface ou Precisão
Dano: 2d8 + Precisão por rodada sustentada
Custo: Carga -1 por rodada
Efeito: reduz avanço, segura rota ou prende alvo em zona de tiro
```

### Aterramento de Emergência

```text
d20 + Interface, Estrutura ou Sensores
Sucesso: Carga -2 ou Estabilidade -2
Sucesso extremo: reduz risco crítico, limpa retorno e mantém Defesa
Falha crítica: pé perde terra, solo racha ou descarga sobe pelo corpo
```

### Emissão Solar de Emergência

```text
d20 + Interface ou Fluxo
Dano: 5d10 + Interface ou Fluxo
Requisito: Carga 4+, núcleo funcional, emissor operacional
Custo: Carga zera, Calor +2, Estresse +1, Estabilidade +2
Falha crítica: Colapso de Condução, Núcleo em Pressão ou Arco no Conn-Pod
```

## Avarias específicas

```text
Zumbido de Condução — próxima Interface energética -1.
Banco Lateral Instável — ataque com braço correspondente -1.
Linha de Condução Aquecida — ataques carregados -2.
Aterramento Irregular — Aterramento -2.
Isolador Neural Falhando — teste Vontade em Carga 4+.
Banco em Arco — Estabilidade +1 por rodada até isolar/aterrar.
Núcleo em Pressão — Carga máxima segura 3.
Braço em Descarga Interna — sem Disparo carregado no braço.
Arco no Conn-Pod — Estresse +2 e teste de Constituição/Vontade.
Colapso de Condução — Estabilidade 6; disparos fortes bloqueados.
Sol Preso — Carga travada em 5; Calor/Estresse por rodada.
```

## Tabela rápida de impacto

```text
1–2   Cabeça / Conn-Pod / isolamento neural
3–4   Torso / Núcleo de Condução Estelar
5–6   Bancos internos de energia
7–8   Linhas de condução
9–10  Ombro direito
11–12 Ombro esquerdo
13–14 Braço direito / canhão
15–16 Braço esquerdo / canhão
17    Punhos
18    Peito / emissor torácico
19    Pernas e pés / aterramento
20    Arco no Conn-Pod / Colapso de Condução / Sol Preso
```

## Nota do mestre

O Nova é alto dano, mas não é canhão infinito. Recompense carga preparada, aterramento, linha de tiro segura e decisão de não disparar. Puna spam de Disparo Hyperion, uso de Carga 4+ sem teste, braço danificado conduzindo energia e Emissão Solar usada como ataque comum.

---

# 4. ECHO SABER — MARK-4

## Identidade

**Nome:** Echo Saber  
**ID:** `echo-saber`  
**Geração:** Mark-4  
**Doutrina:** ressonância cortante  
**Função:** cortar carapaças, abrir placas, romper tendões, causar ruptura interna e criar janelas contra Kaijus blindados.  
**Risco central:** ruído vibracional, eco neural, lâmina presa e colapso de ressonância.

O Echo Saber não vence por força bruta. Ele lê a frequência de falha do alvo e faz a lâmina vibrar no ponto onde a carapaça deixa de querer ficar inteira.

> **O Echo Saber não corta o Kaiju. Ele encontra a nota errada dentro do corpo do Kaiju e força essa nota a quebrar.**

## Atributos

```text
Potência:   +5
Estrutura:  +5
Mobilidade: +7
Precisão:   +8
Sensores:   +7
Fluxo:      +7
Interface:  +7
```

## Combate

```text
Integridade Estrutural: 232
Defesa: 16
Blindagem: 6 frontal / 5 lateral / 5 traseira / 5 juntas / 6 braços / 7 antebraços-lâmina / 6 torso-reguladores / 6 Conn-Pod
Deslocamento: 3 zonas
Deslocamento técnico: 2 zonas + leitura/preparação
Deslocamento forçado: 4 zonas, com Calor +1
Reações: 2 por rodada; 3 em Guarda de Lâmina com sensores limpos
Dano físico: 2d8 + Potência
Dano de lâmina simples: 3d8 + Precisão
Dano de Corte Ressonante: 3d10 + Precisão
Dano de Ruptura Interna: 4d8 + Precisão ou Fluxo
Dano de Nota Final: 4d10 + Precisão
Calor máximo seguro: 6
Ruído Neural seguro: até 4
Estresse seguro: até 4
Sincronia mínima: 66%
Sincronia ideal: 80%–92%
```

## Marcador especial — Frequência Ressonante

```text
0 — alvo não lido
1 — retorno superficial
2 — padrão parcial
3 — frequência útil encontrada
4 — frequência profunda
5 — risco de excesso vibracional
```

A Frequência é por região do Kaiju, não pelo Kaiju inteiro. Frequência 3 no ombro não significa Frequência 3 na cauda.

## Marcador secundário — Ruído Vibracional

```text
0 — silêncio controlado
1 — zumbido leve
2 — vibração nos braços
3 — pressão auditiva e neural
4 — limite perigoso
5 — eco neural severo
6 — colapso de ressonância
```

## Sistemas principais

### FC-4D — Fluxo de Ressonância Cortante

Conecta os pilotos à leitura vibracional da lâmina. Permite sentir a rigidez da placa como pressão na mente, mas também pode gerar ruído neural e silêncio insuportável pós-Drift.

### Matriz de Ressonância

Transforma corte superficial em ameaça interna. Se danificada, o Echo ainda corta, mas deixa de cortar por dentro.

### Reguladores de Frequência

Calculam resistência do alvo e ajustam vibração.

### Sensores de Retorno

Permitem “ouvir” densidade, rigidez e microfratura pelo toque.

## Ataques e manobras

### Leitura de Frequência

```text
d20 + Sensores, Interface ou Mente
Efeito: Frequência +1 na região tocada
Sucesso extremo: Frequência +2 ou revela fraqueza estrutural
Crítico: próximo Corte Ressonante +2 e não gera Ruído em sucesso
```

### Corte Simples de Lâmina

```text
d20 + Precisão ou Mobilidade
Dano: 3d8 + Precisão
Efeito: corte seguro, baixo risco
Crítico: Frequência +1 se atingir região já lida
```

### Corte Ressonante

```text
d20 + Precisão ou Fluxo
Dano: 3d10 + Precisão
Custo: Frequência 1+ ou Ruído +1 se sem leitura
Sucesso forte: ignora 1 carapaça/blindagem ou aplica Placa Vibrando
Falha crítica: lâmina ricocheteia, trava, Ruído +1 ou avaria leve
```

### Corte de Tendão

```text
d20 + Precisão
Dano: 3d8 + Precisão
Custo: Frequência 2+ ou Estresse +1
Efeito: reduz movimento, compromete membro ou cancela avanço
```

### Desafinar Carapaça

```text
d20 + Sensores, Interface ou Precisão
Dano: 2d8 + Precisão
Custo: Frequência 1
Efeito: próximo ataque contra a região recebe +1 ou ignora 1 blindagem
```

### Ruptura Interna

```text
d20 + Fluxo, Precisão ou Interface
Dano: 4d8 + Precisão ou Fluxo
Requisito: Frequência 3+ na região
Custo: Frequência -2 e Ruído +1
Crítico: abre Janela de Finalização ou derruba parcialmente
```

### Guarda de Lâmina

```text
d20 + Precisão, Mobilidade ou Interface
Redução: 1d8 + Precisão
Sucesso extremo: reduz dano e cria abertura para Leitura de Frequência
```

### Nota Final

```text
d20 + Precisão ou Fluxo
Dano: 4d10 + Precisão
Requisito: Frequência 4+, alvo vulnerável, janela real
Custo: Frequência zera, Ruído +2, Estresse +1
Falha crítica: lâmina trava/racha, Ruído +2, Estresse +2 ou avaria grave
```

## Avarias específicas

```text
Zumbido Residual — próxima Leitura -1.
Fio Descalibrado — próximo Corte Ressonante -1.
Sensor de Retorno Surdo — Frequência não passa de 2 sem teste extra.
Regulador Desafinado — Ruptura Interna -2.
Amortecedor Saturado — falhas em Corte Ressonante geram Ruído +1 adicional.
Lâmina Rachada — Nota Final indisponível.
Matriz Desalinhada — Frequência máxima segura 2; sem Ruptura Interna.
Eco Neural Persistente — Estresse +1 em ação de lâmina pesada.
Lâmina Presa em Frequência — precisa Potência/Interface/Precisão CD 17.
Colapso de Ressonância — Ruído 6; lâminas bloqueadas.
Quebra de Silêncio — Estresse +2, Fluxo -1 e teste dos pilotos.
```

## Tabela rápida de impacto

```text
1–2   Cabeça / Conn-Pod / filtros neurais
3–4   Torso / reguladores de frequência
5–6   Matriz de Ressonância
7–8   Coluna axial / isolamento
9–10  Ombro direito
11–12 Ombro esquerdo
13    Cotovelo direito
14    Cotovelo esquerdo
15    Antebraço direito / lâmina
16    Antebraço esquerdo / lâmina
17    Lâminas
18    Punhos / sensores de retorno
19    Pernas e pés
20    Lâmina Presa / Colapso de Ressonância / Quebra de Silêncio
```

## Nota do mestre

O Echo é devastador quando prepara leitura e insiste na região certa. Puna jogadores que usam ele como Chrome, trocam de região toda hora, usam Nota Final sem janela ou ignoram Ruído. Recompense paciência, leitura, coordenação com aliados e silenciar a lâmina no momento certo.

---

# 5. MAMMOTH APOSTLE — MARK-4

## Identidade

**Nome:** Mammoth Apostle  
**ID:** `mammoth-apostle`  
**Geração:** Mark-4  
**Doutrina:** avanço de cerco e contenção frontal  
**Função:** avançar sob ataque, empurrar Kaijus, proteger evacuações, abrir caminho e manter linha impossível.  
**Risco central:** lentidão, direção errada, pressão hidráulica, queda catastrófica e exposição lateral.

O Mammoth não nasceu para duelar. Ele nasceu para avançar quando todos recuam.

> **O Mammoth Apostle não vence porque é rápido. Ele vence porque escolhe uma direção — e o mundo precisa aceitar que ele vai chegar lá.**

## Atributos

```text
Potência:   +7
Estrutura:  +8
Mobilidade: +3
Precisão:   +4
Sensores:   +5
Fluxo:      +6
Interface:  +6
```

## Combate

```text
Integridade Estrutural: 260
Defesa: 11
Defesa em Muralha/Ancoragem: 15 contra impacto frontal, empurrão, queda ou avanço
Blindagem: 9 frontal / 8 antebraços / 8 ombros / 8 pernas / 7 torso / 6 lateral / 5 traseira / 6 juntas / 7 Conn-Pod
Deslocamento normal: 1 zona
Deslocamento de marcha: 2 zonas com Marcha Inevitável ativa
Deslocamento forçado: 2 zonas, com Calor +1
Reações: 1 por rodada; 2 se Ancorado e sem mudar direção
Dano base: 2d10 + Potência
Dano de avanço: 3d8 + Potência
Dano de ombro/aríete: 3d10 + Potência
Dano de compressão: 3d8 + Estrutura por rodada mantida
Dano de colisão: 4d8 + Potência, se houver cenário adequado
Calor máximo seguro: 6
Pressão Hidráulica segura: até 4
Estresse seguro: até 4
Sincronia mínima: 64%
Sincronia ideal: 76%–88%
```

## Marcador especial — Marcha Profunda

```text
0 — parado / sem ritmo
1 — primeiro passo aceito
2 — avanço funcional
3 — marcha inevitável
4 — cerco total
5 — inércia perigosa
```

A Marcha sempre tem uma direção declarada. Mudar direção exige teste e pode custar Marcha, Calor ou avaria.

## Marcador secundário — Pressão de Cerco

```text
0 — sem pressão sustentada
1 — contato pesado
2 — empurrão constante
3 — esmagamento progressivo
4 — limite perigoso
5 — sobrepressão estrutural
6 — falha hidráulica iminente
```

## Sistemas principais

### FC-4E — Fluxo de Marcha Profunda

Faz os pilotos sentirem chão antes dos braços, peso antes da força e estabilidade antes do ataque. Pune ansiedade.

### Marcha de Carga Contínua

Permite avanço sob impacto, com três eixos internos de sustentação.

### Pressão de Maré

Força contínua em braços e pernas. Não explode: empurra.

### Muralha Frontal Integrada

Usa torso e antebraços para proteger aliados, civis e rotas.

## Ataques e manobras

### Marcha Inevitável

```text
d20 + Estrutura, Potência ou Fluxo
Dano: 2d10 + Potência se houver colisão/esmagamento
Efeito: avança, mantém linha e pode empurrar Kaiju
Custo: Marcha +1; Calor +1 se terreno ruim
```

### Muralha Apostólica

```text
d20 + Estrutura, Interface ou Vontade
Redução: 1d12 + Estrutura contra ataques frontais
Efeito: protege aliados, comboios, civis ou estrutura atrás
Custo: Marcha 1 ou Pressão +1
```

### Ancoragem de Cerco

```text
d20 + Estrutura, Interface ou Fluxo
Efeito: +2 contra ser movido, derrubado ou empurrado
Crítico: Mammoth vira fundação da linha
```

### Compressão Titânica

```text
d20 + Potência, Estrutura ou Fluxo
Dano inicial: 2d8 + Potência
Dano mantido: 3d8 + Estrutura por rodada
Custo: Pressão +1 por rodada
Efeito: prende, comprime e compromete membro/avanço
```

### Aríete Apostólico

```text
d20 + Potência ou Estrutura
Dano: 3d10 + Potência
Requisito: Marcha 2+ ou Ancoragem seguida de avanço
Custo: Marcha -1 ou Calor +1
```

### Punho de Compressão

```text
d20 + Potência
Dano: 3d8 + Potência
Crítico: inicia Pressão de Cerco sem custo adicional
```

### Ombro de Cerco

```text
d20 + Estrutura ou Potência
Dano: 2d10 + Potência
Uso: afastar Kaiju, abrir espaço ou proteger flanco
```

### Abrir Corredor

```text
d20 + Estrutura, Potência ou Sensores
Uso: remover destroços, abrir rota ou proteger evacuação
Crítico: rota inteira salva por uma janela crítica
```

## Módulos opcionais

```text
Placas de Escudo nos Antebraços — Muralha +1d, Mobilidade -1 em ações rápidas.
Cabos Pesados de Contenção — prender Kaiju, estrutura ou destroço.
Âncoras de Solo — +2 em Ancoragem, mas difíceis de soltar.
Aríetes de Impacto nos Ombros — Aríete +1d8, risco de retorno.
Punhos de Compressão Reforçados — Compressão +1d8, Pressão sobe mais rápido.
```

## Avarias específicas

```text
Passo Pesado Demais — próxima Marcha -1.
Pressão no Joelho — Ancoragem -1.
Hidráulica Lenta — Reações -1 com braço pesado.
Quadril Rígido — Virar a Montanha -2.
Pé Afundado — deslocamento 1 zona; Marcha não sobe.
Joelho de Cerco Cedeu — Marcha zera, Defesa -2.
Coluna de Montanha Rachada — Pressão 4+ exige CD 17.
Hidráulica em Sobrepressão — Pressão não passa de 3 sem risco.
Marcha Quebrada — Marcha indisponível até estabilizar.
Queda de Colosso — queda redesenha o mapa.
Pânico de Massa — Vontade/Drift CD 18 ou Estresse +2.
```

## Tabela rápida de impacto

```text
1–2   Cabeça / Conn-Pod / FC-4E
3–4   Torso / couraça de cerco
5–6   Tríplice Eixo de Marcha
7–8   Coluna axial
9–10  Quadril / travas de marcha
11–12 Ombro direito
13–14 Ombro esquerdo
15    Braços / hidráulica profunda
16    Antebraços / escudos móveis
17    Mãos / garras de compressão
18    Pernas e joelhos
19    Pés / ancoragem pesada
20    Marcha Quebrada / Queda de Colosso / Pânico de Massa
```

## Nota do mestre

O Mammoth é muralha móvel, não tanque invencível. Recompense direção clara, proteção de comboios, uso de Marcha e manutenção da linha. Puna mudança de direção sem custo, perseguição de Kaiju rápido, terreno ruim ignorado e Pressão alta sem despressurizar.

---

# 6. HORIZON BRAVO — MARK-4

## Identidade

**Nome:** Horizon Bravo  
**ID:** `horizon-bravo`  
**Geração:** Mark-4  
**Doutrina:** comando estável de campo  
**Função:** coordenar aliados, proteger civis, estabilizar linhas, cobrir Jaegers especializados, manter comunicação e organizar campo.  
**Risco central:** sobrecarga tática, dados fragmentados, culpa operacional e colapso de comando local.

O Horizon Bravo é o sucessor espiritual do Horizon Brave, mas não é só maior ou mais forte. Ele transforma a filosofia de defesa e rota em **comando operacional**.

> **O Horizon Bravo não vence porque causa mais dano. Ele vence porque impede a batalha inteira de se desorganizar.**

## Atributos

```text
Potência:   +5
Estrutura:  +7
Mobilidade: +5
Precisão:   +5
Sensores:   +8
Fluxo:      +7
Interface:  +8
```

## Combate

```text
Integridade Estrutural: 242
Defesa: 15
Defesa em Guarda Operacional: 17 contra ameaça direcionada a aliado, civil, estrutura ou rota
Blindagem: 7 frontal / 7 antebraços / 6 ombros / 6 pernas / 6 torso / 5 lateral / 5 traseira / 5 juntas / 7 Conn-Pod
Deslocamento: 2 zonas
Deslocamento tático: 2 zonas + comando/reorganização leve
Deslocamento forçado: 3 zonas, com Calor +1
Reações: 2 por rodada; 3 com Campo de Coordenação ativo e sensores limpos
Dano base: 2d10 + Potência
Dano de impacto controlado: 3d8 + Potência
Dano de carga controlada: 3d10 + Precisão ou Interface
Dano de contenção: 2d8 + Potência por rodada
Bônus de suporte: +1 a +2
Calor máximo seguro: 6
Sobrecarga Tática segura: até 4
Estresse seguro: até 4
Sincronia mínima: 66%
Sincronia ideal: 78%–90%
```

## Marcador especial — Clareza de Campo

```text
0 — campo caótico / leitura fragmentada
1 — ameaça principal identificada
2 — aliados e rota em leitura
3 — operação organizada
4 — comando local estável
5 — excesso de informação / risco de sobrecarga
```

A Clareza sempre precisa estar ligada a uma prioridade declarada: proteger ponte, cobrir Nova, segurar Kaiju longe da rota, coordenar retirada, etc.

## Marcador secundário — Linha Operacional

```text
0 — sem linha definida
1 — posição marcada
2 — rota protegida
3 — linha estável
4 — zona segura temporária
5 — linha sobrecarregada / risco de colapso
```

## Risco — Sobrecarga Tática

```text
0 — leitura limpa
1 — múltiplas prioridades leves
2 — dados demais
3 — conflito entre missão e combate
4 — limite perigoso
5 — fragmentação tática
6 — colapso de comando local
```

## Sistemas principais

### FC-4G — Fluxo de Comando Estável

Conecta pilotos ao corpo do Jaeger e ao estado tático da missão: aliados, civis, terreno, ameaça, comunicação e rotas.

### Malha de Estabilidade Operacional

Mantém postura, redistribui impacto e sustenta defesa de área.

### Rede Bravo

Retransmite dados, estabiliza comunicação e ajuda a torre.

### Visão Operacional

Lê campo inteiro, civis, aliados, ameaça, flanco e rotas.

## Ataques e manobras

### Golpe Bravo

```text
d20 + Potência ou Precisão
Dano: 2d10 + Potência
Sucesso forte: +1d8 ou Desbalanceado leve
Crítico: aliado próximo recebe +1 na próxima ação
```

### Guarda Operacional

```text
d20 + Estrutura, Interface ou Vontade
Redução: 1d10 + Estrutura
Alvo: aliado, civil, estrutura, comboio, rota ou zona
Custo: Linha +1 ou Clareza 1+
Crítico: aliado protegido recebe +2 na próxima ação defensiva/reposicionamento
```

### Campo de Coordenação

```text
d20 + Sensores, Interface ou Mente
Custo: Clareza 2+
Efeito: aliado recebe +1/+2, ignora penalidade ou ganha janela tática
Falha crítica: dado errado, abertura falsa ou Sobrecarga +1
```

### Reorganizar Linha

```text
d20 + Interface, Sensores ou Mente
Custo: Clareza 2 ou Linha 2
Efeito: melhora posição de aliado, rota ou zona
Crítico: Clareza +1 e aliado recebe +1
```

### Contenção de Campo

```text
d20 + Potência, Estrutura ou Interface
Dano: 2d8 + Potência
Efeito: Parcialmente Preso / Preso / avanço reduzido
Crítico: estabiliza alvo para finalização aliada
```

### Parede de Linha

```text
d20 + Estrutura ou Vontade
Redução: 1d12 + Estrutura
Requisito: Linha 2+ ou posição defensiva clara
Efeito: bloqueia avanço e cria zona segura
```

### Pulso de Reorganização — opcional

```text
d20 + Interface ou Precisão
Dano: 2d8 + Interface
Custo: Calor +1
Efeito: interrompe avanço, empurra levemente ou abre janela de reposicionamento
```

### Carga de Impacto Controlada — opcional

```text
d20 + Precisão ou Interface
Dano: 3d10 + Precisão
Uso limitado por missão
Efeito: Placa Rachada, Membro Tensionado ou Obstrução Removida
```

## Avarias específicas

```text
Canal de Campo Instável — próximo Campo de Coordenação -1.
Placa de Antebraço Desalinhada — Guarda Operacional -1.
Sensor de Rota Cego — rota/zona civil sem leitura.
Comunicação Dorsal Chiando — Reorganizar Linha -2 fora de visão.
Malha de Estabilidade em Atraso — Linha não passa de 3.
Campo Fragmentado — Clareza máxima 2; suporte só em alvo visível.
Retransmissão Perdida — sem bônus para aliados fora da visão.
Âncora Instável — Guarda Operacional -2 se proteger área.
Colapso de Comando Local — Clareza zera, Sobrecarga +2.
HUD de Guerra Quebrado — Mente/Drift CD 18 ou Estresse +2.
Linha Quebrada — Linha zera e algo protegido fica ameaçado.
```

## Tabela rápida de impacto

```text
1–2   Cabeça / Conn-Pod / FC-4G
3–4   Torso / Malha de Estabilidade
5–6   Coluna axial / leitura de tensão
7–8   Linhas laterais de suporte
9–10  Módulos dorsais de comunicação
11–12 Sensores de ombro, peito e cabeça
13    Ombro direito
14    Ombro esquerdo
15    Braços
16    Antebraços defensivos
17    Mãos
18    Quadril
19    Pernas e pés
20    Colapso de Comando Local / HUD Quebrado / Linha Quebrada
```

## Nota do mestre

O Horizon Bravo não compete com especialistas no território deles. Ele não dá mais dano que Nova, não corta melhor que Echo, não empurra melhor que Mammoth, não resiste a falha como Hydra e não faz múltiplas ações como Crimson. O poder dele é tornar todos os outros mais eficientes.

Recompense leitura de campo, prioridade clara, suporte, cobertura de janela e proteção de civis. Puna tentar jogar como atacante puro, proteger tudo ao mesmo tempo, ignorar Sobrecarga e usar Campo de Coordenação sem Clareza.

---

# RESUMO DE PAPÉIS DOS MARK-4

```text
Crimson Typhoon — pressão simultânea / três braços / coordenação multivetorial.
Hydra Corinthian — sobrevivência / redundância / combate degradado.
Nova Hyperion — energia dirigida / disparos / carga e aterramento.
Echo Saber — ressonância / lâminas / ruptura interna.
Mammoth Apostle — muralha móvel / avanço de cerco / linha frontal.
Horizon Bravo — comando de campo / suporte / estabilidade operacional.
```

# BALANCEAMENTO GERAL

```text
Crimson é forte em ações múltiplas, mas paga Sobrecarga Anatômica.
Hydra é difícil de derrubar, mas acumula Degradação.
Nova causa dano alto, mas depende de Carga, Estabilidade e Aterramento.
Echo destrói carapaça, mas precisa ler Frequência e controlar Ruído.
Mammoth segura linha, mas é lento, direcional e vulnerável a flancos.
Horizon Bravo organiza o campo, mas depende de Clareza e sofre Sobrecarga Tática.
```

# FRASES OPERACIONAIS

```text
Crimson Typhoon:
Braço um ativo. Braço dois ativo. Terceiro membro aceito no Fluxo. Formem a tempestade, mas não se percam dentro dela.

Hydra Corinthian:
Braço esquerdo degradado. Linha auxiliar assumindo. Ainda funciona. Continuem a missão.

Nova Hyperion:
Núcleo estável. Bancos energizados. Pés buscando terra. A estrela está presa — por enquanto.

Echo Saber:
Lâminas armadas. Reguladores buscando retorno. Toquem a carapaça, escutem a resposta… e só então cortem.

Mammoth Apostle:
Comboios atrás de você. Avance um metro por vez e não deixe a linha quebrar.

Horizon Bravo:
Linha instável. Aliados em combate. Civis ainda em rota. Organize o campo.
```


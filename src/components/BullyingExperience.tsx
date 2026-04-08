import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import verbalImg from "@/assets/verbal-bullying.jpg";
import cyberImg from "@/assets/cyberbullying-phone.jpg";
import exclusionImg from "@/assets/exclusion.jpg";
import physicalImg from "@/assets/physical-shadow.jpg";
import impactImg from "@/assets/impact-message.jpg";
import lonelyImg from "@/assets/lonely-bench.jpg";

type Screen =
  | "intro"
  | "chat"
  | "reveal"
  | "impact"
  | "types"
  | "identity"
  | "path"
  | "final";

type ChatChoice = "zoar" | "ignorar" | "defender" | null;
type IdentityChoice = "bully" | "victim" | "witness" | null;

// Delayed motion wrapper
const Delayed = ({
  children,
  delay = 0,
  className = "",
  y = 30,
  scale = 1,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  scale?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y, scale }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay: delay / 1000, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Chat bubble with motion
const ChatBubble = ({
  text,
  delay,
  self = false,
}: {
  text: string;
  delay: number;
  self?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: self ? 40 : -40 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm sm:text-base ${
        self
          ? "bg-[hsl(var(--chat-bubble-self))] text-primary-foreground self-end rounded-br-md"
          : "bg-[hsl(var(--chat-bubble-other))] self-start rounded-bl-md"
      }`}
    >
      {text}
    </motion.div>
  );
};

// Expandable type card with motion
const TypeCard = ({
  label,
  desc,
  detail,
  image,
  index,
}: {
  label: string;
  desc: string;
  detail: string;
  image: string;
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 + index * 0.2, ease: "easeOut" }}
      className="w-full"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left group"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 py-3 px-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
        >
          <motion.img
            src={image}
            alt={label}
            loading="lazy"
            width={56}
            height={56}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            whileHover={{ rotate: 2 }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium">{label}</p>
            <p className="text-sm text-dim">{desc}</p>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-dim text-lg"
          >
            ▾
          </motion.span>
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden mt-2"
          >
            <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
              <motion.img
                src={image}
                alt={label}
                loading="lazy"
                width={800}
                height={512}
                className="w-full h-36 object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="p-4">
                <p className="text-sm text-foreground/80 leading-relaxed">{detail}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Floating particles decoration
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-primary/10"
        initial={{
          x: Math.random() * 400,
          y: Math.random() * 600,
        }}
        animate={{
          y: [null, Math.random() * -200 - 100],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 4 + Math.random() * 3,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Pulsing line divider
const PulsingLine = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 1.2, delay: delay / 1000, ease: "easeOut" }}
    className="w-16 h-0.5 bg-primary/30 rounded-full mx-auto my-4"
  />
);

export default function BullyingExperience() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [chatChoice, setChatChoice] = useState<ChatChoice>(null);
  const [identityChoice, setIdentityChoice] = useState<IdentityChoice>(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [showAfterChat, setShowAfterChat] = useState(false);

  const goTo = useCallback((next: Screen) => {
    setScreen(next);
  }, []);

  useEffect(() => {
    if (screen === "chat" && !chatChoice) {
      const t = setTimeout(() => setShowChatOptions(true), 4500);
      return () => clearTimeout(t);
    }
  }, [screen, chatChoice]);

  useEffect(() => {
    if (chatChoice) {
      const t = setTimeout(() => setShowAfterChat(true), 800);
      return () => clearTimeout(t);
    }
  }, [chatChoice]);

  useEffect(() => {
    if (showAfterChat) {
      const t = setTimeout(() => goTo("reveal"), 3500);
      return () => clearTimeout(t);
    }
  }, [showAfterChat, goTo]);

  const choiceLabel =
    chatChoice === "zoar"
      ? "zoar"
      : chatChoice === "ignorar"
      ? "ignorar"
      : "defender";

  const bullyingTypes = [
    {
      label: "Verbal",
      desc: "apelidos, zoações, humilhação",
      detail:
        "Bullying verbal inclui xingamentos, apelidos maldosos, comentários depreciativos e humilhação pública. Palavras deixam marcas profundas na autoestima e na saúde mental da vítima, mesmo quando disfarçadas de 'brincadeira'.",
      image: verbalImg,
    },
    {
      label: "Cyberbullying",
      desc: "mensagens, comentários, exposição online",
      detail:
        "O cyberbullying acontece em redes sociais, mensagens e plataformas online. A vítima é perseguida 24 horas por dia, sem descanso. Prints, montagens e exposição pública amplificam o sofrimento de forma devastadora.",
      image: cyberImg,
    },
    {
      label: "Exclusão",
      desc: "ignorar, deixar de fora",
      detail:
        "A exclusão social é uma forma silenciosa mas extremamente dolorosa de bullying. Ser ignorado, excluído de grupos e atividades causa isolamento profundo e sentimento de rejeição que pode durar anos.",
      image: exclusionImg,
    },
    {
      label: "Físico",
      desc: "agressões, empurrões, intimidação",
      detail:
        "O bullying físico envolve qualquer forma de agressão corporal: empurrões, socos, chutes e intimidação física. Além das marcas visíveis, deixa traumas emocionais profundos e medo constante.",
      image: physicalImg,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {screen === "intro" && (
            <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6 relative">
              <FloatingParticles />

              <Delayed delay={300} scale={0.9}>
                <h1 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
                  Você acha que nunca
                  <br />
                  <motion.span
                    className="font-semibold inline-block"
                    initial={{ opacity: 0, letterSpacing: "0.2em" }}
                    animate={{ opacity: 1, letterSpacing: "0em" }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                  >
                    fez bullying?
                  </motion.span>
                </h1>
              </Delayed>

              <Delayed delay={1000}>
                <motion.img
                  src={lonelyImg}
                  alt="Solidão"
                  width={800}
                  height={512}
                  className="w-64 sm:w-80 rounded-2xl mx-auto"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 0.7, filter: "blur(0px)" }}
                  transition={{ duration: 1.2, delay: 1 }}
                  whileHover={{ scale: 1.03, opacity: 0.9 }}
                />
              </Delayed>

              <Delayed delay={1800}>
                <motion.button
                  onClick={() => goTo("chat")}
                  className="px-8 py-3 rounded-full border border-primary/30 text-sm font-medium tracking-wide
                    bg-primary/5 text-accent-soft hover:text-foreground"
                  whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.15)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continuar
                </motion.button>
              </Delayed>
            </div>
          )}

          {screen === "chat" && (
            <div className="flex flex-col min-h-screen px-4 sm:px-6 py-12 max-w-md mx-auto">
              <Delayed delay={200} className="mb-6">
                <p className="text-xs text-dim tracking-widest uppercase">
                  Grupo — 3 membros
                </p>
              </Delayed>

              <div className="flex flex-col gap-3 flex-1">
                <ChatBubble text="olha a foto desse mlk kkkkkk q nojo" delay={800} />
                <ChatBubble text="cara ele é muito feio, coitado 😂😂" delay={2200} />
                <ChatBubble text="vou mandar no grupo da sala pra todo mundo ver" delay={3200} />

                {showChatOptions && !chatChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6 flex flex-col gap-2 self-end"
                  >
                    {(["zoar", "ignorar", "defender"] as ChatChoice[]).map(
                      (c, i) => (
                        <motion.button
                          key={c}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          onClick={() => {
                            setChatChoice(c);
                            setShowChatOptions(false);
                          }}
                          className="px-5 py-2 rounded-full border border-border text-sm
                            text-accent-soft hover:text-foreground"
                          whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--accent))" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {c === "zoar"
                            ? "😂 Zoar"
                            : c === "ignorar"
                            ? "😶 Ignorar"
                            : "🛡️ Defender"}
                        </motion.button>
                      )
                    )}
                  </motion.div>
                )}

                {chatChoice === "zoar" && (
                  <>
                    <ChatBubble text="KKKKK manda a foto, quero ver 😂" delay={0} self />
                    {showAfterChat && (
                      <>
                        <ChatBubble text="boa kkk vou fazer meme dele" delay={300} />
                        <ChatBubble text="esse cara vai chorar amanhã 💀" delay={1200} />
                      </>
                    )}
                  </>
                )}
                {chatChoice === "ignorar" && (
                  <>
                    {showAfterChat && (
                      <>
                        <ChatBubble text="ué, não vai falar nada?" delay={300} />
                        <ChatBubble text="silêncio = concordou kkkk" delay={1200} />
                        <ChatBubble text="pronto, mandei no grupo da sala 😂" delay={2000} />
                      </>
                    )}
                  </>
                )}
                {chatChoice === "defender" && (
                  <>
                    <ChatBubble text="para com isso, isso é pesado demais" delay={0} self />
                    {showAfterChat && (
                      <>
                        <ChatBubble
                          text="relaxa, tá defendendo por quê? é teu namorado? 😂"
                          delay={300}
                        />
                        <ChatBubble text="vou mandar mesmo, ngm liga" delay={1200} />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {screen === "reveal" && (
            <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6 relative">
              <FloatingParticles />

              <Delayed delay={500} y={0} scale={0.8}>
                <p className="text-xl sm:text-3xl font-light text-accent-soft">
                  Essa conversa parece leve pra você?
                </p>
              </Delayed>

              <PulsingLine delay={1800} />

              <Delayed delay={2500} y={40}>
                <motion.p
                  className="text-2xl sm:text-4xl font-semibold"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  Pra quem recebe, não é.
                </motion.p>
              </Delayed>

              <Delayed delay={4500}>
                <motion.button
                  onClick={() => goTo("impact")}
                  className="mt-8 px-8 py-3 rounded-full border border-primary/30 text-sm
                    bg-primary/5 text-accent-soft hover:text-foreground"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continuar
                </motion.button>
              </Delayed>
            </div>
          )}

          {screen === "impact" && (
            <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-4 relative">
              <FloatingParticles />

              <Delayed delay={300}>
                <motion.img
                  src={impactImg}
                  alt="Impacto das mensagens"
                  loading="lazy"
                  width={800}
                  height={512}
                  className="w-72 sm:w-96 rounded-2xl mx-auto"
                  initial={{ opacity: 0, filter: "blur(15px)", scale: 0.9 }}
                  animate={{ opacity: 0.6, filter: "blur(0px)", scale: 1 }}
                  transition={{ duration: 1.5 }}
                  whileHover={{ opacity: 0.85 }}
                />
              </Delayed>

              <PulsingLine delay={1000} />

              <Delayed delay={1200}>
                <p className="text-2xl sm:text-4xl font-light leading-relaxed">
                  Uma mensagem pode ficar
                </p>
              </Delayed>

              <Delayed delay={2500} scale={0.7}>
                <motion.p
                  className="text-3xl sm:text-5xl font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  pra sempre.
                </motion.p>
              </Delayed>

              <Delayed delay={4000}>
                <motion.button
                  onClick={() => goTo("types")}
                  className="mt-10 px-8 py-3 rounded-full border border-primary/30 text-sm
                    bg-primary/5 text-accent-soft hover:text-foreground"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continuar
                </motion.button>
              </Delayed>
            </div>
          )}

          {screen === "types" && (
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center max-w-lg mx-auto">
              <Delayed delay={300} scale={0.9}>
                <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
                  Nem todo bullying parece bullying
                </h2>
              </Delayed>

              <div className="w-full flex flex-col gap-3 mb-8">
                {bullyingTypes.map((item, i) => (
                  <TypeCard
                    key={item.label}
                    label={item.label}
                    desc={item.desc}
                    detail={item.detail}
                    image={item.image}
                    index={i}
                  />
                ))}
              </div>

              <Delayed delay={3000} scale={0.8}>
                <motion.p
                  className="text-xl font-semibold mt-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Mas sempre machuca.
                </motion.p>
              </Delayed>

              <Delayed delay={4000}>
                <motion.button
                  onClick={() => goTo("identity")}
                  className="mt-10 px-8 py-3 rounded-full border border-primary/30 text-sm
                    bg-primary/5 text-accent-soft hover:text-foreground"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continuar
                </motion.button>
              </Delayed>
            </div>
          )}

          {screen === "identity" && (
            <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8 relative">
              <FloatingParticles />

              <Delayed delay={300} scale={0.9}>
                <h2 className="text-2xl sm:text-4xl font-light">
                  Quem é você nessa história?
                </h2>
              </Delayed>

              <PulsingLine delay={800} />

              <div className="flex flex-col gap-3">
                {([
                  { key: "bully" as IdentityChoice, label: "Já fiz isso" },
                  { key: "victim" as IdentityChoice, label: "Já passei por isso" },
                  { key: "witness" as IdentityChoice, label: "Já vi isso acontecer" },
                ]).map((item, i) => (
                  <motion.button
                    key={item.key}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.2, duration: 0.5 }}
                    onClick={() => {
                      setIdentityChoice(item.key);
                      goTo("path");
                    }}
                    className="px-8 py-3 rounded-full border border-primary/30 text-sm
                      bg-primary/5 text-accent-soft hover:text-foreground"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {screen === "path" && (() => {
            const paths = {
              bully: {
                lines: ["Você não é um monstro.", "Mas isso precisa mudar."],
                tips: ["Pare imediatamente", "Não incentive outros", "Peça desculpa", "Pense antes de falar"],
                closing: "Maturidade é saber parar.",
              },
              victim: {
                lines: ["Você não merece isso.", "Não é culpa sua."],
                tips: ["Fale com alguém", "Não guarde sozinho", "Denuncie", "Busque apoio"],
                closing: "Você merece respeito.",
              },
              witness: {
                lines: ["O silêncio também participa."],
                tips: ["Não ria", "Defenda", "Apoie a vítima", "Avise alguém"],
                closing: "Coragem é agir.",
              },
            };
            const p = paths[identityChoice || "victim"];

            return (
              <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-md mx-auto relative">
                <FloatingParticles />

                {p.lines.map((line, i) => (
                  <Delayed key={i} delay={400 + i * 1200} className="mb-2">
                    <p className="text-xl sm:text-2xl font-light">{line}</p>
                  </Delayed>
                ))}

                <PulsingLine delay={1800} />

                <div className="mt-6 flex flex-col gap-3">
                  {p.tips.map((tip, i) => (
                    <motion.div
                      key={tip}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2 + i * 0.4, duration: 0.5 }}
                    >
                      <p className="text-sm text-dim">• {tip}</p>
                    </motion.div>
                  ))}
                </div>

                <Delayed delay={4000} scale={0.85}>
                  <motion.p
                    className="text-xl sm:text-2xl font-semibold mt-10"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    {p.closing}
                  </motion.p>
                </Delayed>

                <Delayed delay={5000}>
                  <motion.button
                    onClick={() => goTo("final")}
                    className="mt-10 px-8 py-3 rounded-full border border-primary/30 text-sm
                      bg-primary/5 text-accent-soft hover:text-foreground"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continuar
                  </motion.button>
                </Delayed>
              </div>
            );
          })()}

          {screen === "final" && (
            <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-4 relative">
              <FloatingParticles />

              <Delayed delay={500} scale={0.7}>
                <motion.p
                  className="text-3xl sm:text-5xl font-bold leading-tight"
                  animate={{ letterSpacing: ["0em", "0.02em", "0em"] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Bullying não é brincadeira.
                </motion.p>
              </Delayed>

              <PulsingLine delay={1500} />

              <Delayed delay={2000} y={0} scale={0.9}>
                <p className="text-2xl sm:text-4xl font-light">É escolha.</p>
              </Delayed>

              <Delayed delay={4000}>
                <p className="text-lg text-dim mt-4">E agora você sabe.</p>
              </Delayed>

              {chatChoice && (
                <Delayed delay={5000}>
                  <motion.p
                    className="text-sm text-dim mt-6 italic"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Você escolheu {choiceLabel}.
                  </motion.p>
                </Delayed>
              )}

              <Delayed delay={6000} className="flex gap-4 mt-10">
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Compartilhar
                </motion.button>
                <motion.button
                  onClick={() => {
                    setChatChoice(null);
                    setIdentityChoice(null);
                    setShowChatOptions(false);
                    setShowAfterChat(false);
                    goTo("intro");
                  }}
                  className="px-8 py-3 rounded-full border border-primary/30 text-sm
                    bg-primary/5 text-accent-soft hover:text-foreground"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Refazer
                </motion.button>
              </Delayed>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

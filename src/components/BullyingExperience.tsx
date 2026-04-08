import { useState, useEffect, useCallback } from "react";

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

// Reusable animated text component
const FadeText = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-1000 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Chat bubble
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
    <div
      className={`animate-type-in max-w-[75%] px-4 py-2.5 rounded-2xl text-sm sm:text-base ${
        self
          ? "bg-[hsl(var(--chat-bubble-self))] self-end rounded-br-md"
          : "bg-[hsl(var(--chat-bubble-other))] self-start rounded-bl-md"
      }`}
    >
      {text}
    </div>
  );
};

export default function BullyingExperience() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [transitioning, setTransitioning] = useState(false);
  const [chatChoice, setChatChoice] = useState<ChatChoice>(null);
  const [identityChoice, setIdentityChoice] = useState<IdentityChoice>(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [showAfterChat, setShowAfterChat] = useState(false);

  const goTo = useCallback((next: Screen) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
    }, 600);
  }, []);

  // Show chat options after messages appear
  useEffect(() => {
    if (screen === "chat" && !chatChoice) {
      const t = setTimeout(() => setShowChatOptions(true), 3500);
      return () => clearTimeout(t);
    }
  }, [screen, chatChoice]);

  // Show after-choice messages
  useEffect(() => {
    if (chatChoice) {
      const t = setTimeout(() => setShowAfterChat(true), 800);
      return () => clearTimeout(t);
    }
  }, [chatChoice]);

  // Auto-advance from after-chat
  useEffect(() => {
    if (showAfterChat) {
      const t = setTimeout(() => goTo("reveal"), 3000);
      return () => clearTimeout(t);
    }
  }, [showAfterChat, goTo]);

  const choiceLabel = chatChoice === "zoar" ? "zoar" : chatChoice === "ignorar" ? "ignorar" : "defender";

  const renderScreen = () => {
    switch (screen) {
      case "intro":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
            <FadeText delay={300}>
              <h1 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
                Você acha que nunca
                <br />
                <span className="font-semibold">fez bullying?</span>
              </h1>
            </FadeText>
            <FadeText delay={1200}>
              <button
                onClick={() => goTo("chat")}
                className="px-8 py-3 rounded-full border border-foreground/20 text-sm font-medium tracking-wide
                  hover:bg-foreground/10 transition-all duration-300 text-accent-soft hover:text-foreground"
              >
                Continuar
              </button>
            </FadeText>
          </div>
        );

      case "chat":
        return (
          <div className="flex flex-col min-h-screen px-4 sm:px-6 py-12 max-w-md mx-auto">
            <FadeText delay={200} className="mb-6">
              <p className="text-xs text-dim tracking-widest uppercase">Grupo — 3 membros</p>
            </FadeText>

            <div className="flex flex-col gap-3 flex-1">
              <ChatBubble text="mano olha esse cara kkkkk" delay={800} />
              <ChatBubble text="ridículo 😂" delay={2200} />

              {showChatOptions && !chatChoice && (
                <FadeText delay={0} className="mt-6 flex flex-col gap-2 self-end">
                  {(["zoar", "ignorar", "defender"] as ChatChoice[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setChatChoice(c);
                        setShowChatOptions(false);
                      }}
                      className="px-5 py-2 rounded-full border border-foreground/20 text-sm
                        hover:bg-foreground/10 transition-all duration-200 capitalize text-accent-soft hover:text-foreground"
                    >
                      {c === "zoar" ? "😂 Zoar" : c === "ignorar" ? "😶 Ignorar" : "🛡️ Defender"}
                    </button>
                  ))}
                </FadeText>
              )}

              {chatChoice === "zoar" && (
                <>
                  <ChatBubble text="kkkkk manda mais 😂" delay={0} self />
                  {showAfterChat && <ChatBubble text="KKKK isso aí, continua" delay={300} />}
                </>
              )}
              {chatChoice === "ignorar" && (
                <>
                  {showAfterChat && (
                    <>
                      <ChatBubble text="ué, ficou mudo?" delay={300} />
                      <ChatBubble text="deixa quieto, ele concorda kkk" delay={1200} />
                    </>
                  )}
                </>
              )}
              {chatChoice === "defender" && (
                <>
                  <ChatBubble text="para com isso, não tem graça" delay={0} self />
                  {showAfterChat && (
                    <>
                      <ChatBubble text="relaxa, é só brincadeira" delay={300} />
                      <ChatBubble text="vai defender agora? kk" delay={1200} />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case "reveal":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6">
            <FadeText delay={500}>
              <p className="text-xl sm:text-3xl font-light text-accent-soft">
                Essa conversa parece leve pra você?
              </p>
            </FadeText>
            <FadeText delay={2500}>
              <p className="text-2xl sm:text-4xl font-semibold">
                Pra quem recebe, não é.
              </p>
            </FadeText>
            <FadeText delay={4500}>
              <button
                onClick={() => goTo("impact")}
                className="mt-8 px-8 py-3 rounded-full border border-foreground/20 text-sm
                  hover:bg-foreground/10 transition-all duration-300 text-accent-soft hover:text-foreground"
              >
                Continuar
              </button>
            </FadeText>
          </div>
        );

      case "impact":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-4">
            <FadeText delay={500}>
              <p className="text-2xl sm:text-4xl font-light leading-relaxed">
                Uma mensagem pode ficar
              </p>
            </FadeText>
            <FadeText delay={2000}>
              <p className="text-3xl sm:text-5xl font-bold">pra sempre.</p>
            </FadeText>
            <FadeText delay={4000}>
              <button
                onClick={() => goTo("types")}
                className="mt-10 px-8 py-3 rounded-full border border-foreground/20 text-sm
                  hover:bg-foreground/10 transition-all duration-300 text-accent-soft hover:text-foreground"
              >
                Continuar
              </button>
            </FadeText>
          </div>
        );

      case "types":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-lg mx-auto">
            <FadeText delay={300}>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-10">
                Nem todo bullying parece bullying
              </h2>
            </FadeText>

            {[
              { label: "Verbal", desc: "apelidos, zoações, humilhação" },
              { label: "Cyberbullying", desc: "mensagens, comentários, exposição online" },
              { label: "Exclusão", desc: "ignorar, deixar de fora" },
              { label: "Físico", desc: "agressões" },
            ].map((item, i) => (
              <FadeText key={item.label} delay={1000 + i * 800} className="mb-6">
                <p className="text-lg font-medium">{item.label}</p>
                <p className="text-sm text-dim">{item.desc}</p>
              </FadeText>
            ))}

            <FadeText delay={4500}>
              <p className="text-xl font-semibold mt-4">Mas sempre machuca.</p>
            </FadeText>

            <FadeText delay={5500}>
              <button
                onClick={() => goTo("identity")}
                className="mt-10 px-8 py-3 rounded-full border border-foreground/20 text-sm
                  hover:bg-foreground/10 transition-all duration-300 text-accent-soft hover:text-foreground"
              >
                Continuar
              </button>
            </FadeText>
          </div>
        );

      case "identity":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
            <FadeText delay={300}>
              <h2 className="text-2xl sm:text-4xl font-light">
                Quem é você nessa história?
              </h2>
            </FadeText>
            <FadeText delay={1200} className="flex flex-col gap-3">
              {([
                { key: "bully" as IdentityChoice, label: "Já fiz isso" },
                { key: "victim" as IdentityChoice, label: "Já passei por isso" },
                { key: "witness" as IdentityChoice, label: "Já vi isso acontecer" },
              ]).map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setIdentityChoice(item.key);
                    goTo("path");
                  }}
                  className="px-8 py-3 rounded-full border border-foreground/20 text-sm
                    hover:bg-foreground/10 transition-all duration-300 text-accent-soft hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
            </FadeText>
          </div>
        );

      case "path":
        const paths = {
          bully: {
            lines: ["Você não é um monstro.", "Mas isso precisa mudar."],
            tips: [
              "Pare imediatamente",
              "Não incentive outros",
              "Peça desculpa",
              "Pense antes de falar",
            ],
            closing: "Maturidade é saber parar.",
          },
          victim: {
            lines: ["Você não merece isso.", "Não é culpa sua."],
            tips: [
              "Fale com alguém",
              "Não guarde sozinho",
              "Denuncie",
              "Busque apoio",
            ],
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
          <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-md mx-auto">
            {p.lines.map((line, i) => (
              <FadeText key={i} delay={400 + i * 1200} className="mb-2">
                <p className="text-xl sm:text-2xl font-light">{line}</p>
              </FadeText>
            ))}

            <div className="mt-8 flex flex-col gap-3">
              {p.tips.map((tip, i) => (
                <FadeText key={tip} delay={2000 + i * 600}>
                  <p className="text-sm text-dim">• {tip}</p>
                </FadeText>
              ))}
            </div>

            <FadeText delay={4500}>
              <p className="text-xl sm:text-2xl font-semibold mt-10">{p.closing}</p>
            </FadeText>

            <FadeText delay={5500}>
              <button
                onClick={() => goTo("final")}
                className="mt-10 px-8 py-3 rounded-full border border-foreground/20 text-sm
                  hover:bg-foreground/10 transition-all duration-300 text-accent-soft hover:text-foreground"
              >
                Continuar
              </button>
            </FadeText>
          </div>
        );

      case "final":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-4">
            <FadeText delay={500}>
              <p className="text-3xl sm:text-5xl font-bold leading-tight">
                Bullying não é brincadeira.
              </p>
            </FadeText>
            <FadeText delay={2000}>
              <p className="text-2xl sm:text-4xl font-light">É escolha.</p>
            </FadeText>
            <FadeText delay={4000}>
              <p className="text-lg text-dim mt-4">E agora você sabe.</p>
            </FadeText>

            {chatChoice && (
              <FadeText delay={5000}>
                <p className="text-sm text-dim mt-6 italic">
                  Você escolheu {choiceLabel}.
                </p>
              </FadeText>
            )}

            <FadeText delay={6000} className="flex gap-4 mt-10">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "Bullying não é brincadeira", url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="px-8 py-3 rounded-full bg-foreground text-background text-sm font-medium
                  hover:bg-foreground/90 transition-all duration-300"
              >
                Compartilhar
              </button>
              <button
                onClick={() => {
                  setChatChoice(null);
                  setIdentityChoice(null);
                  setShowChatOptions(false);
                  setShowAfterChat(false);
                  goTo("intro");
                }}
                className="px-8 py-3 rounded-full border border-foreground/20 text-sm
                  hover:bg-foreground/10 transition-all duration-300 text-accent-soft hover:text-foreground"
              >
                Refazer
              </button>
            </FadeText>
          </div>
        );
    }
  };

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-opacity duration-500 ${
        transitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      {renderScreen()}
    </div>
  );
}

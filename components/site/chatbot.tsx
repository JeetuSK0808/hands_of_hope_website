"use client";

import * as React from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { id: number; from: "bot" | "user"; text: string };

/**
 * Static, on-device guide.
 *
 * No server, no API key, nothing leaves the browser. Each intent has a list
 * of "training" utterances that we tokenise, weight by IDF, and score against
 * the user's input via a small bag-of-words overlap. The best-scoring intent's
 * response (one of several) is chosen, with light variation so the same
 * question doesn't always echo back the same line.
 *
 * This is a deliberately small model. Everything below is the entire model,
 * bundled with the site. Fits comfortably in well under a kilobyte of weights.
 */

type Intent = {
  id: string;
  utterances: string[];
  responses: string[];
  followUps?: string[];
};

const INTENTS: Intent[] = [
  {
    id: "greet",
    utterances: [
      "hi", "hello", "hey", "hi there", "good morning", "good evening",
      "hey chatbot", "what's up", "yo",
    ],
    responses: [
      "Hi, I'm the Hands of Hope chatbot. Ask me about chapters, programs, volunteering, or our impact.",
      "Hello. I'm the Hands of Hope chatbot. I can help you understand what Hands of Hope does and how to get involved.",
      "Hey, happy to help. Try one of the prompts below or ask anything in your own words.",
    ],
    followUps: [
      "What does Hands of Hope do?",
      "How do I start a chapter?",
      "Tell me about your impact",
    ],
  },
  {
    id: "what",
    utterances: [
      "what is hands of hope", "what does hands of hope do", "what do you do",
      "tell me about hands of hope", "who are you", "what's your mission",
      "explain hands of hope", "describe the org", "introduce hands of hope",
    ],
    responses: [
      "Hands of Hope is a 501(c)(3) student-led nonprofit, fiscally sponsored by Hack Club. We connect high school students with the communities just outside their classroom through service projects, fundraisers, and STEM Buddies sessions.",
      "We're a student-led nonprofit out of Atlanta. The short version: high schoolers run service projects, raise money for local partners, and lead STEM Buddies, hands-on STEM mentorship for disabled children. Every chapter is shaped by the people running it.",
    ],
    followUps: [
      "What programs do you run?",
      "How can I volunteer?",
      "Where are you based?",
    ],
  },
  {
    id: "mission",
    utterances: [
      "what is your mission", "mission statement", "what's the mission",
      "why does hands of hope exist", "purpose of hands of hope", "vision",
    ],
    responses: [
      "Our mission is to ignite compassion by connecting high school students with the real world, and to inspire them to take meaningful action. Our vision is to bridge the gap between students and communities in need through youth-led action that lasts.",
      "Mission: ignite compassion in high school students and turn it into meaningful action. Vision: youth-led service that actually lasts, bridging students and the communities just past their classroom.",
    ],
    followUps: ["What programs do you run?", "Tell me about your impact"],
  },
  {
    id: "programs",
    utterances: [
      "what programs", "programs", "what kind of work", "branches",
      "stem buddies", "ripple for change", "awards ceremony",
      "what activities", "what services", "kinds of projects",
    ],
    responses: [
      "Three branches plus a signature event. Chapter Network: school-based service for high schoolers. STEM Buddies: accessible, hands-on STEM mentorship for disabled children. Start a Chapter: student-led, anywhere. Plus the annual Hands of Hope Awards Ceremony recognizing service hours, leadership, and impact.",
      "We run a Chapter Network at high schools, STEM Buddies for inclusive STEM learning, and the Ripple for Change event each year. Service hours are verified and recognized beyond school.",
    ],
    followUps: [
      "How do I start a chapter?",
      "What is STEM Buddies?",
      "When is the awards ceremony?",
    ],
  },
  {
    id: "stem",
    utterances: [
      "what is stem buddies", "tell me about stem buddies", "stem program",
      "stem mentorship", "disabled children", "inclusive stem",
    ],
    responses: [
      "STEM Buddies is a dedicated branch providing hands-on, accessible STEM learning to disabled children. It's built around joy, agency, and discovery, not curriculum compliance. If you'd like to volunteer with the program, our Contact page is the way in.",
    ],
    followUps: ["How can I volunteer?", "Where are you based?"],
  },
  {
    id: "ripple",
    utterances: [
      "ripple for change", "what is ripple", "tell me about ripple",
      "signature event", "annual event",
    ],
    responses: [
      "Ripple for Change is our signature evening of stories, art, and momentum. Students, families, and partners gather to share what one small act of service can start, and what it can build. Details for this year are forthcoming.",
    ],
    followUps: ["When is the awards ceremony?", "Tell me about your impact"],
  },
  {
    id: "awards",
    utterances: [
      "awards ceremony", "awards", "when is the awards", "honors",
      "recognition", "service hours award",
    ],
    responses: [
      "The Hands of Hope Awards Ceremony is held annually each spring. It honors service, leadership, and impact: verified hours, national honors, and an evening dedicated to the students who showed up.",
    ],
    followUps: ["What programs do you run?", "How can I volunteer?"],
  },
  {
    id: "start",
    utterances: [
      "how do i start a chapter", "start a chapter", "open a chapter",
      "begin a chapter", "found a chapter", "no chapter at my school",
      "bring hands of hope to my school",
    ],
    responses: [
      "Wonderful, every chapter begins with one student. Email info@handsofhopeoutreach.com or visit our Contact page; we'll send the chapter starter kit and pair you with a founder mentor within 48 hours.",
      "Easy enough: head to /contact or write to info@handsofhopeoutreach.com. We'll send the starter kit and a founder mentor within 48 hours, and you're off.",
    ],
    followUps: ["How can I volunteer?", "Where are you based?"],
  },
  {
    id: "volunteer",
    utterances: [
      "how can i volunteer", "how do i volunteer", "i want to help",
      "i want to join", "join hands of hope", "sign up", "register",
      "be a volunteer", "get involved",
    ],
    responses: [
      "If your school has a Hands of Hope chapter, register through it. That's the fastest path. If it doesn't, you can start one and we'll guide you the whole way through.",
      "Two paths. (1) If your school has a chapter, sign up there. (2) If not, start one. Email info@handsofhopeoutreach.com or use the Contact page. Either way you're in.",
    ],
    followUps: ["How do I start a chapter?", "What programs do you run?"],
  },
  {
    id: "impact",
    utterances: [
      "tell me about your impact", "impact", "numbers", "results",
      "how many hours", "how much money", "how many students",
      "what have you done",
    ],
    responses: [
      "Through 2026: 5,000+ verified volunteer hours, $20,000+ raised for community partners, and 250+ students leading projects across Atlanta, every semester.",
      "5,000+ volunteer hours. $20,000+ raised. 250+ students leading projects. And it's still counting.",
    ],
    followUps: ["What programs do you run?", "Who are your partners?"],
  },
  {
    id: "where",
    utterances: [
      "where are you based", "where are you located", "location", "city",
      "atlanta", "headquarters", "are you in atlanta", "what city",
    ],
    responses: [
      "Atlanta, Georgia, though our chapter network spans both U.S. and abroad, and is growing.",
    ],
    followUps: ["How do I start a chapter?", "Who are your partners?"],
  },
  {
    id: "partners",
    utterances: [
      "who are your partners", "partners", "partner organizations",
      "who do you work with", "collaborators",
    ],
    responses: [
      "We collaborate with mission-aligned organizations across Atlanta: shelters, schools, food banks, and foundations. Atlanta Mission, Open Hand Atlanta, the Atlanta Community Food Bank, MDE School, and a long list of others. The full circle is on the home page.",
    ],
    followUps: ["Tell me about your impact", "How can I volunteer?"],
  },
  {
    id: "contact",
    utterances: [
      "how do i contact you", "contact", "email", "phone", "get in touch",
      "reach out", "where do i write", "support", "info@",
    ],
    responses: [
      "Email info@handsofhopeoutreach.com, or use the Contact page. We're on Instagram (@handsofhope_outreach) and LinkedIn too.",
    ],
    followUps: ["How do I start a chapter?", "Tell me about your impact"],
  },
  {
    id: "donate",
    utterances: [
      "how do i donate", "donate", "give money", "support financially",
      "fundraise", "tax deductible", "make a gift", "contribute",
    ],
    responses: [
      "Head to the Donate page (/donate) to pick an amount and we'll send you the secure link. We're a 501(c)(3), so gifts are tax-deductible, and every dollar is directed to underserved partners and programs.",
      "The /donate page has tiered amounts and a one-time or monthly toggle. Pick what fits and we'll hand off the rest by email.",
    ],
    followUps: ["Who are your partners?", "Tell me about your impact"],
  },
  {
    id: "thanks",
    utterances: ["thanks", "thank you", "appreciate it", "ty", "thx", "cool", "great"],
    responses: [
      "Anytime. If you'd like a human to follow up, info@handsofhopeoutreach.com is the door.",
      "You're welcome. Anything else I can answer?",
    ],
  },
  {
    id: "bye",
    utterances: ["bye", "goodbye", "see ya", "later", "talk soon"],
    responses: [
      "Take care. Hope to see you in a chapter soon.",
      "Bye for now, and thanks for stopping by.",
    ],
  },
];

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "do", "does", "for",
  "from", "had", "has", "have", "i", "im", "i'm", "in", "is", "it", "me",
  "my", "of", "on", "or", "our", "so", "the", "this", "to", "us", "was",
  "we", "what", "when", "where", "who", "why", "with", "you", "your",
  "im", "ive", "you're", "yours", "ours", "thats", "that", "its", "it's",
]);

function tokenise(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t));
}

// Pre-compute IDF: rare tokens across the training set count more heavily.
const IDF: Map<string, number> = (() => {
  const docCount = INTENTS.reduce((n, i) => n + i.utterances.length, 0);
  const docFreq = new Map<string, number>();
  for (const intent of INTENTS) {
    for (const u of intent.utterances) {
      const seen = new Set(tokenise(u));
      seen.forEach((tok) => docFreq.set(tok, (docFreq.get(tok) || 0) + 1));
    }
  }
  const idf = new Map<string, number>();
  docFreq.forEach((df, tok) => {
    idf.set(tok, Math.log((docCount + 1) / (df + 1)) + 1);
  });
  return idf;
})();

function scoreIntent(query: string, intent: Intent): number {
  const qTokens = tokenise(query);
  if (qTokens.length === 0) return 0;
  let best = 0;
  for (const u of intent.utterances) {
    const uTokens = new Set(tokenise(u));
    let s = 0;
    for (const t of qTokens) {
      if (uTokens.has(t)) s += IDF.get(t) || 1;
    }
    // Reward exact-phrase matches a touch
    if (query.toLowerCase().includes(u.toLowerCase())) s *= 1.6;
    if (s > best) best = s;
  }
  // Tiny normalisation by query length so longer questions don't always win
  return best / Math.max(2, Math.sqrt(qTokens.length));
}

// Used to gently vary which response is chosen per-intent across a session.
const usageCount: Record<string, number> = {};

function classify(query: string): Intent | null {
  let bestIntent: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const s = scoreIntent(query, intent);
    if (s > bestScore) {
      bestScore = s;
      bestIntent = intent;
    }
  }
  // Threshold: below this, treat as "didn't catch that"
  return bestScore >= 0.6 ? bestIntent : null;
}

function pickResponse(intent: Intent): string {
  const i = (usageCount[intent.id] || 0) % intent.responses.length;
  usageCount[intent.id] = (usageCount[intent.id] || 0) + 1;
  return intent.responses[i];
}

const FALLBACK = [
  "I'm not sure I caught that. Try asking about chapters, programs, volunteering, or our impact, or email info@handsofhopeoutreach.com for a real person.",
  "I'm a small on-device guide, so I might not know that one. I'm best on chapters, STEM Buddies, the Awards Ceremony, partners, and how to volunteer.",
];
let fallbackIdx = 0;

export function Chatbot() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([
    {
      id: 0,
      from: "bot",
      text: "Hi, I'm the Hands of Hope chatbot. I run entirely on-device, so ask freely. What can I help with?",
    },
  ]);
  const [suggestions, setSuggestions] = React.useState<string[]>([
    "What does Hands of Hope do?",
    "How do I start a chapter?",
    "Tell me about your impact",
    "How can I volunteer?",
  ]);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages, open, thinking]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { id: m.length, from: "user", text: clean }]);
    setInput("");
    setThinking(true);

    // Simulate a brief "thinking" pause so the model feels alive.
    const delay = 400 + Math.min(900, clean.length * 14);
    setTimeout(() => {
      const intent = classify(clean);
      let reply: string;
      let nextSuggestions: string[] | null = null;
      if (intent) {
        reply = pickResponse(intent);
        if (intent.followUps && intent.followUps.length) {
          nextSuggestions = intent.followUps;
        }
      } else {
        reply = FALLBACK[fallbackIdx % FALLBACK.length];
        fallbackIdx += 1;
      }
      setThinking(false);
      setMessages((m) => [...m, { id: m.length, from: "bot", text: reply }]);
      if (nextSuggestions) setSuggestions(nextSuggestions);
    }, delay);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open Hands of Hope chatbot"}
        className={cn(
          "fixed bottom-5 right-5 z-[55] inline-flex h-14 w-14 items-center justify-center rounded-full text-background shadow-[0_18px_40px_-12px_oklch(0.18_0.012_60_/_0.45)] transition-transform hover:scale-105"
        )}
        style={{ background: "var(--foreground)" }}
      >
        {open ? (
          <X className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <>
            <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 inline-flex h-3 w-3"
            >
              <span
                className="absolute inset-0 rounded-full animate-ping-soft"
                style={{ background: "var(--brand-rose)" }}
              />
              <span
                className="relative inline-flex h-3 w-3 rounded-full ring-2 ring-background"
                style={{ background: "var(--brand-rose)" }}
              />
            </span>
          </>
        )}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-5 z-[55] w-[min(94vw,24rem)] origin-bottom-right border border-border bg-background shadow-2xl transition-all duration-300",
          open
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
            : "scale-95 opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-background"
            style={{ background: "var(--foreground)" }}
          >
            <span className="font-display text-lg italic">H</span>
            <span
              aria-hidden
              className="absolute -right-0.5 -bottom-0.5 inline-flex h-3 w-3 rounded-full ring-2 ring-background"
              style={{ background: "var(--brand-rose)" }}
            />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium leading-none">Hands of Hope Chatbot</div>
            <div className="mt-1 editorial-eyebrow text-[10px] tracking-[0.22em] text-muted-foreground">
              On-device guide · Always on
            </div>
          </div>
          <span className="font-display text-[10px] italic text-muted-foreground/80">
            v1
          </span>
        </div>

        <div
          ref={scrollerRef}
          className="max-h-[55vh] min-h-[20rem] space-y-3 overflow-y-auto p-4"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[88%] px-4 py-2.5 text-sm leading-relaxed",
                m.from === "bot"
                  ? "rounded-md rounded-bl-none bg-muted text-foreground"
                  : "ml-auto rounded-md rounded-br-none bg-foreground text-background"
              )}
            >
              {m.text}
            </div>
          ))}

          {thinking && (
            <div className="max-w-[60%] px-4 py-2.5 rounded-md rounded-bl-none bg-muted text-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 chatbot-dot" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 chatbot-dot chatbot-dot-2" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 chatbot-dot chatbot-dot-3" />
              </span>
            </div>
          )}

          {!thinking && messages.length > 0 && messages[messages.length - 1].from === "bot" && (
            <div className="flex flex-wrap gap-2 pt-2">
              {suggestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Hands of Hope anything…"
            className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          <button
            type="submit"
            aria-label="Send"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
          >
            <Send className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </>
  );
}

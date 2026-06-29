import React, { useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  FileText,
  Zap,
  Wrench,
  Cloud,
  ChevronDown,
  Code2,
  Database,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";

/* ----------------------------------------------------------------
   Types
----------------------------------------------------------------- */

type TagColor = "blue" | "green" | "purple" | "orange";

interface TagData {
  label: string;
  color?: TagColor;
}

interface SkillItem {
  icon: React.ReactNode;
  name: string;
  desc: string;
  tags: TagData[];
}

interface ProjectItem {
  name: string;
  desc: string;
  tags: TagData[];
  github: string;
  live: string;
  liveTitle: string;
  video: string;
  poster: string;
  featured?: boolean;
}

interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  desc: string;
  current?: boolean;
}

/* ----------------------------------------------------------------
   Data
----------------------------------------------------------------- */

const SKILLS: SkillItem[] = [
  {
    icon: <Code2 className="w-5 h-5 text-[var(--accent)]" />,
    name: "Languages",
    desc: "The core languages I read, write, and ship production code in.",
    tags: [
      { label: "Java" },
      { label: "TypeScript" },
      { label: "JavaScript" },
      { label: "Python" },
    ],
  },
  {
    icon: <Zap className="w-5 h-5 text-[var(--accent)]" />,
    name: "Frontend Engineering",
    desc: "Responsive, accessible, performant UIs built with modern React tooling.",
    tags: [
      { label: "React" },
      { label: "Next.js" },
      { label: "Tailwind CSS" },
      { label: "TanStack Query" },
    ],
  },
  {
    icon: <Wrench className="w-5 h-5 text-[#30d158]" />,
    name: "Backend & APIs",
    desc: "RESTful and async APIs, ORMs, and LLM-orchestration layers.",
    tags: [
      { label: "Node.js", color: "green" },
      { label: "Express.js", color: "green" },
      { label: "FastAPI", color: "green" },
      { label: "Prisma", color: "green" },
      { label: "LangChain", color: "green" },
    ],
  },
  {
    icon: <Database className="w-5 h-5 text-[#bf5af2]" />,
    name: "Databases & Caching",
    desc: "Relational, document, and vector stores for structured and AI-driven data.",
    tags: [
      { label: "PostgreSQL", color: "purple" },
      { label: "MongoDB", color: "purple" },
      { label: "Redis", color: "purple" },
      { label: "Qdrant (Vector DB)", color: "purple" },
    ],
  },
  {
    icon: <Cloud className="w-5 h-5 text-[#ff9f0a]" />,
    name: "DevOps & Tools",
    desc: "CI/CD pipelines, monorepo tooling, and cloud infrastructure on AWS.",
    tags: [
      { label: "Git", color: "orange" },
      { label: "Docker", color: "orange" },
      { label: "GitHub Actions (CI/CD)", color: "orange" },
      { label: "Turborepo", color: "orange" },
      { label: "AWS (EC2, S3)", color: "orange" },
      { label: "Nginx", color: "orange" },
      { label: "WebSockets", color: "orange" },
      { label: "Postman", color: "orange" },
    ],
  },
];

const PROJECTS: ProjectItem[] = [
  {
    name: "SketchFlow",
    desc: "Engineered a real-time collaborative whiteboard letting multiple users draw and edit together in shared workspaces.",
    tags: [
      { label: "Next.js" },
      { label: "WebSockets", color: "purple" },
      { label: "Turborepo", color: "orange" },
      { label: "Prisma", color: "green" },
      { label: "PostgreSQL", color: "blue" },
    ],
    github: "https://github.com",
    live: "https://example.com",
    liveTitle: "View live demo",
    video: "https://cdn.sujansinhthakor.com/Demo_SketchFlow.mp4",
    poster: "/projectPoster/SketchFlow.png",
    featured: true,
  },
  {
    name: "Synthiq",
    desc: "Created an AI app that converts natural-language prompts into rendered math and science animations end-to-end.",
    tags: [
      { label: "FastAPI", color: "green" },
      { label: "Python", color: "blue" },
      { label: "GPT-4", color: "orange" },
      { label: "Manim", color: "purple" },
      { label: "Next.js" },
    ],
    github: "https://github.com",
    live: "https://example.com",
    liveTitle: "View live demo",
    video: "",
    poster:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 280'%3E%3Crect width='400' height='280' fill='%23111'/%3E%3Ccircle cx='200' cy='140' r='26' fill='%2330d158' opacity='0.9'/%3E%3Cpolygon points='191,126 191,154 215,140' fill='%23000'/%3E%3C/svg%3E",
  },
  {
    name: "ChatPDF",
    desc: "Built a platform to upload and query PDFs via an interactive chat interface with citation-backed answers.",
    tags: [
      { label: "Next.js" },
      { label: "LangChain", color: "orange" },
      { label: "Qdrant", color: "purple" },
      { label: "Redis", color: "green" },
      { label: "BullMQ" },
    ],
    github: "https://github.com",
    live: "https://example.com",
    liveTitle: "View live demo",
    video: "https://cdn.sujansinhthakor.com/Demo_ChatPDF.mp4",
    poster: "/projectPoster/ChatPDF.png",
  },
];

const EXPERIENCE: ExperienceItem[] = [
  {
    period: "October 2025 — March 2026",
    role: "Full Stack Engineer Intern",
    company: "ORIM Advisory Pvt Ltd",
    desc: "Led the redesign of the core issue tracking engine, improving performance 3× for teams with 10k+ issues. Mentored 4 junior engineers and drove technical direction for the integrations team.",
  },
  {
    period: "March 2025 — June 2025",
    role: "Full Stack Developer Intern",
    company: "Idna Enterprises",
    desc: "Built infrastructure tooling and developer-facing APIs for the Edge Runtime. Contributed to open-source Next.js and reduced cold start times by 40% across the platform.",
  },
];

const NAV_LINKS = ["about", "skills", "projects", "experience"] as const;
type SectionId = (typeof NAV_LINKS)[number] | "hero" | "contact";

const TAG_CLASSES: Record<TagColor, string> = {
  blue: "text-[var(--accent)] bg-[rgba(var(--accent-rgb),0.12)]",
  green: "text-[#30d158] bg-[rgba(48,209,88,0.1)]",
  purple: "text-[#bf5af2] bg-[rgba(191,90,242,0.1)]",
  orange: "text-[#ff9f0a] bg-[rgba(255,159,10,0.1)]",
};

function Tag({ label, color = "blue" }: TagData) {
  return (
    <span
      className={`text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full ${TAG_CLASSES[color]}`}
    >
      {label}
    </span>
  );
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

interface RevealProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

function Reveal({ children, delayMs = 0, className = "" }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

function gridCorners(idx: number, total: number, cols: number) {
  const isFirst = idx === 0;
  const isLastOfFirstRow = idx === cols - 1;
  const isFirstOfLastRow = idx === total - cols;
  const isLast = idx === total - 1;
  return [
    isFirst ? "rounded-tl-[18px]" : "",
    isLastOfFirstRow ? "rounded-tr-[18px]" : "",
    isFirstOfLastRow ? "rounded-bl-[18px]" : "",
    isLast ? "rounded-br-[18px]" : "",
  ].join(" ");
}

function GlobalStyles() {
  return (
    <style>{`
        /* ── Accent color token ── */
        :root {
          --accent: #10b981;
          --accent-rgb: 16, 185, 129;
        }

        @keyframes drift-one {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(60px, -80px, 0) scale(1.1); }
          66% { transform: translate3d(-40px, 50px, 0) scale(0.94); }
        }
        @keyframes drift-two {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-70px, -40px, 0) scale(1.12); }
        }
        @keyframes drift-three {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          40% { transform: translate3d(50px, 70px, 0) scale(0.92); }
          80% { transform: translate3d(-60px, -30px, 0) scale(1.06); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .ambient-orb {
          animation-play-state: running;
        }
        @media (prefers-reduced-motion: reduce) {
          .ambient-orb {
            animation: none !important;
          }
        }

        /* Custom scrollbar */
        html {
          scrollbar-width: thin;
          scrollbar-color: rgba(var(--accent-rgb), 0.45) #000;
        }
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(var(--accent-rgb), 0.55),
            rgba(48, 209, 88, 0.4)
          );
          border-radius: 10px;
          border: 2px solid #000;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(var(--accent-rgb), 0.85),
            rgba(48, 209, 88, 0.65)
          );
        }
        ::-webkit-scrollbar-corner {
          background: #000;
        }
      `}</style>
  );
}

function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="ambient-orb absolute top-[-12%] right-[2%] w-[520px] h-[520px] rounded-full bg-[rgba(var(--accent-rgb),0.12)] blur-[120px]"
        style={{ animation: "drift-one 26s ease-in-out infinite" }}
      />
      <div
        className="ambient-orb absolute bottom-[-18%] left-[-5%] w-[460px] h-[460px] rounded-full bg-[rgba(48,209,88,0.09)] blur-[110px]"
        style={{ animation: "drift-two 32s ease-in-out infinite" }}
      />
      <div
        className="ambient-orb absolute top-[38%] left-[45%] w-[380px] h-[380px] rounded-full bg-[rgba(191,90,242,0.08)] blur-[110px]"
        style={{ animation: "drift-three 36s ease-in-out infinite" }}
      />
    </div>
  );
}

/* ----------------------------------------------------------------
   Nav
----------------------------------------------------------------- */

function Nav({ active }: { active: SectionId }) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-[52px] flex items-center justify-between px-6 md:px-[60px] bg-black/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.08]">
      <a
        href="#hero"
        className="text-[15px] font-medium tracking-[-0.3px] text-[#f5f5f7]"
      >
        Sujansinh Thakor
      </a>
      <ul className="hidden md:flex gap-9 list-none">
        {NAV_LINKS.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`text-[13px] capitalize transition-colors ${active === id ? "text-[#f5f5f7]" : "text-[#6e6e73] hover:text-[#f5f5f7]"}`}
            >
              {id}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className="text-[13px] font-medium text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.4)] rounded-full px-4 py-1.5 transition-colors hover:bg-[rgba(var(--accent-rgb),0.1)]"
      >
        Get in touch ↗
      </a>
    </nav>
  );
}

/* ----------------------------------------------------------------
   Hero
----------------------------------------------------------------- */

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-start pt-[52px] px-6 md:px-[60px] overflow-hidden"
    >
      {/* ambient glow */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_70%_50%,rgba(var(--accent-rgb),0.07),transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(48,209,88,0.05),transparent_60%)]"
        style={{ animation: "pulse-glow 8s ease-in-out infinite" }}
      />

      <div className="relative max-w-[820px]">
        <div className="inline-flex items-center gap-2 text-[12px] font-medium text-[var(--accent)] bg-[rgba(var(--accent-rgb),0.12)] border border-[rgba(var(--accent-rgb),0.2)] rounded-full px-3.5 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
          I am actively looking for jobs
        </div>

        <h1 className="text-[clamp(52px,7vw,96px)] font-semibold tracking-[-3px] leading-none text-[#f5f5f7] mb-2">
          Sujansinh Thakor.
        </h1>
        <h1 className="text-4xl font-semibold tracking-[-3px] leading-none text-[#6e6e73] mb-8">
          Full Stack Developer
        </h1>

        <p className="text-[17px]  text-[#aeaeb2] max-w-[520px] leading-[1.7] mb-10">
          I enjoy turning ideas into products and learning something new with
          every project.
        </p>

        <div className="flex gap-3.5">
          <a
            href="#projects"
            className="text-[15px] font-medium text-black bg-[#f5f5f7] rounded-full px-7 py-3 transition-all hover:bg-[#e8e8ed] active:scale-[0.98]"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="text-[15px] font-normal text-[#f5f5f7] border border-white/[0.14] rounded-full px-7 py-3 transition-colors hover:bg-white/[0.06]"
          >
            Contact Me
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[2px] uppercase text-[#6e6e73]">
          Scroll
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce text-[#6e6e73]" />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   Divider
----------------------------------------------------------------- */

function Divider() {
  return <div className="h-px bg-white/[0.08] max-w-[1200px] mx-auto" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-[var(--accent)] mb-5">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[clamp(34px,4vw,52px)] font-semibold tracking-[-1.5px] leading-[1.1] text-[#f5f5f7] mb-14">
      {children}
    </h2>
  );
}

/* ----------------------------------------------------------------
   About
----------------------------------------------------------------- */

function About() {
  const stats = [
    { num: "1.5", suffix: "y", label: "Building & learning" },
    { num: "1000", suffix: "+", label: "DSA problems solved" },
    { num: "10", suffix: "+", label: "Projects shipped" },
    { num: "2", suffix: "", label: "Internships completed" },
  ];

  return (
    <section
      id="about"
      className="max-w-[1200px] mx-auto px-6 md:px-[60px] py-24 md:py-[120px]"
    >
      <Reveal>
        <SectionLabel>Who I Am</SectionLabel>
      </Reveal>
      <Reveal>
        <SectionTitle>
          Crafting code
          <br />
          <span className="text-[#6e6e73]">with purpose.</span>
        </SectionTitle>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
        <Reveal className="text-[16px] text-[#aeaeb2] leading-[1.9] space-y-5">
          <p>
            I'm a{" "}
            <strong className="font-medium text-[#f5f5f7]">
              Full Stack developer from India
            </strong>{" "}
            who enjoys building products.
          </p>

          <p>
            Through my{" "}
            <strong className="font-medium text-[#f5f5f7]">Internships</strong>{" "}
            , I’ve gained hands-on experience shipping production code, driving
            team collaboration, and thriving in fast-paced engineering
            environments. This practical experience is supported by a strong
            foundation in Data Structures and Algorithms.{" "}
            <strong className="font-medium text-[#f5f5f7]">
              Data Structures & Algorithms.
            </strong>{" "}
          </p>

          <p>
            When I'm not coding, I'm usually out playing badminton or cricket or
            exploring open world and AAA video games.
          </p>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="grid grid-cols-2 gap-px">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`bg-[#161616] border border-white/[0.08] px-6 py-7 transition-colors hover:bg-[#1c1c1e] ${gridCorners(i, stats.length, 2)}`}
              >
                <div className="text-[42px] font-semibold tracking-[-2px] leading-none text-[#f5f5f7] mb-1.5">
                  {s.num}
                  <span className="text-[28px] text-[var(--accent)]">
                    {s.suffix}
                  </span>
                </div>
                <div className="text-[12px] text-[#6e6e73]">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   Skills
----------------------------------------------------------------- */

function Skills() {
  return (
    <section
      id="skills"
      className="max-w-[1200px] mx-auto px-6 md:px-[60px] py-24 md:py-[120px]"
    >
      <Reveal>
        <SectionLabel>What I Do</SectionLabel>
      </Reveal>
      <Reveal>
        <SectionTitle>
          Across the full
          <br />
          <span className="text-[#6e6e73]">stack.</span>
        </SectionTitle>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SKILLS.map((skill, i) => (
          <Reveal key={skill.name} delayMs={(i % 3) * 100}>
            <div
              className="group relative overflow-hidden bg-[#161616] rounded-[18px] px-7 py-8 h-full 
  transition-all duration-300 ease-out
  hover:scale-[1.02] 
  hover:shadow-[0_0_60px_-15px_rgba(var(--accent-rgb),0.25)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-transparent" />
              <div className="relative z-20">
                <div className="w-11 h-11 rounded-xl bg-[#111] border border-white/[0.14] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {skill.icon}
                </div>
                <div className="text-[17px] font-medium tracking-[-0.3px] text-[#f5f5f7] mb-2">
                  {skill.name}
                </div>
                <div className="text-[13px] text-[#6e6e73] leading-[1.6] mb-5">
                  {skill.desc}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skill.tags.map((t) => (
                    <Tag key={t.label} {...t} />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   Projects
----------------------------------------------------------------- */

function ProjectCard({
  project,
  delayMs,
  onVideoClick,
}: {
  project: ProjectItem;
  delayMs: number;
  onVideoClick: () => void;
}) {
  const media = (
    <div
      onClick={onVideoClick}
      className={`cursor-pointer group/video relative bg-[#111] overflow-hidden transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_8px_40px_rgba(var(--accent-rgb),0.15)] ${project.featured ? "border border-white/[0.08] hover:border-white/[0.1] h-full min-h-[260px]" : "aspect-video"}`}
    >
      <video
        ref={(el) => {
          if (el) el.playbackRate = 1.5;
        }} // Adjust this number (1.0 is normal, 1.5 is 50% faster, 2.0 is double speed)
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/video:scale-[1.03]"
        autoPlay
        muted
        loop
        onLoadedData={() => {}}
        playsInline
        preload="metadata"
        poster={project.poster}
      >
        <source src={project.video} type="video/mp4" />
      </video>
    </div>
  );

  const links = (
    <div className="flex gap-2 shrink-0">
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        title="View source on GitHub"
        className="w-8 h-8 rounded-full bg-[#111] border border-white/[0.14] flex items-center justify-center text-[#f5f5f7] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-black"
      >
        <FaGithub className="w-3.5 h-3.5" />
      </a>
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        title={project.liveTitle}
        className="w-8 h-8 rounded-full bg-[#111] border border-white/[0.14] flex items-center justify-center text-[#f5f5f7] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-black"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );

  const tags = (
    <div className="flex flex-wrap gap-1.5">
      {project.tags.map((t) => (
        <Tag key={t.label} {...t} />
      ))}
    </div>
  );

  if (project.featured) {
    return (
      <Reveal delayMs={delayMs} className="md:col-span-2">
        <div className="relative bg-[#161616] border border-white/[0.08] rounded-[18px] p-9 grid md:grid-cols-2 gap-10 items-center transition-all hover:border-white/[0.14] hover:-translate-y-1">
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.15),transparent_70%)] pointer-events-none" />
          <div className="relative">
            <div className="text-2xl font-semibold tracking-[-0.8px] text-[#f5f5f7] mb-3 leading-tight">
              {project.name}
            </div>
            <p className="text-sm text-[#6e6e73] leading-[1.7]  mb-6">
              {project.desc}
            </p>
            <div className="flex items-center justify-between">
              {tags}
              {links}
            </div>
          </div>
          {media}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal delayMs={delayMs}>
      <div className="bg-[#161616] border border-white/[0.08] rounded-[18px] p-8 h-full transition-all hover:border-white/[0.14] hover:-translate-y-1">
        {media}
        <div className="text-2xl font-semibold tracking-[-0.8px] text-[#f5f5f7] mt-6 mb-3 leading-tight">
          {project.name}
        </div>
        <p className="text-sm text-[#6e6e73] leading-[1.7]  mb-6">
          {project.desc}
        </p>
        <div className="flex items-center justify-between">
          {tags}
          {links}
        </div>
      </div>
    </Reveal>
  );
}

function Projects() {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    if (activeProject) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProject]);

  return (
    <section
      id="projects"
      className="max-w-[1200px] mx-auto px-6 md:px-[60px] py-24 md:py-[120px]"
    >
      <Reveal>
        <SectionLabel>Selected Work</SectionLabel>
      </Reveal>
      <Reveal>
        <SectionTitle>
          Things I've
          <br />
          <span className="text-[#6e6e73]">shipped.</span>
        </SectionTitle>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.name}
            project={p}
            delayMs={i * 100}
            onVideoClick={() => setActiveProject(p)}
          />
        ))}
      </div>

      {activeProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#111] rounded-[24px] overflow-hidden border border-white/[0.14] shadow-[0_0_80px_rgba(var(--accent-rgb),0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 transition-colors hover:bg-black/80"
              aria-label="Close modal"
            >
              ✕
            </button>
            <video
              ref={(el) => {
                if (el) el.playbackRate = 1.5;
              }} // Adjust this number to change modal video speed
              className="w-full max-h-[85vh] object-contain bg-black"
              autoPlay
              controls
              playsInline
              poster={activeProject.poster}
              key={activeProject.name}
            >
              <source src={activeProject.video} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}

/* ----------------------------------------------------------------
   Experience
----------------------------------------------------------------- */

function Experience() {
  return (
    <section
      id="experience"
      className="max-w-[1200px] mx-auto px-6 md:px-[60px] py-24 md:py-[120px]"
    >
      <Reveal>
        <SectionLabel>Work History</SectionLabel>
      </Reveal>
      <Reveal>
        <SectionTitle>
          Where I've
          <br />
          <span className="text-[#6e6e73]">been.</span>
        </SectionTitle>
      </Reveal>

      <div className="flex flex-col gap-px">
        {EXPERIENCE.map((job, i) => (
          <Reveal key={job.company} delayMs={i * 100}>
            <div
              className={`bg-[#161616] border border-white/[0.08] px-7 md:px-9 py-8 grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-3 md:gap-10 items-start transition-colors hover:bg-[#1c1c1e] ${
                i === 0 ? "rounded-t-[18px]" : ""
              } ${i === EXPERIENCE.length - 1 ? "rounded-b-[18px]" : ""}`}
            >
              <div className="text-xs text-[#6e6e73] pt-0.5">{job.period}</div>
              <div>
                <div className="text-[17px] font-medium tracking-[-0.3px] text-[#f5f5f7] mb-1">
                  {job.role}
                </div>
                <div className="text-[13px] text-[var(--accent)] mb-3.5">
                  {job.company}
                </div>
                <div className="text-[13px] text-[#6e6e73] leading-[1.7] ">
                  {job.desc}
                </div>
              </div>
              <span
                className={`text-[11px] font-medium rounded-full px-3 py-1 whitespace-nowrap ${
                  job.current
                    ? "bg-[rgba(48,209,88,0.12)] text-[#30d158] border border-[rgba(48,209,88,0.2)]"
                    : "bg-[#111] text-[#6e6e73] border border-white/[0.08]"
                }`}
              >
                {job.current ? "Current" : "Past"}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   Contact
----------------------------------------------------------------- */

function Contact() {
  const links = [
    {
      label: "GitHub",
      href: "https://github.com/Sujansinhthakor",
      Icon: FaGithub,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sujansinh-thakor/",
      Icon: FaLinkedinIn,
    },
    {
      label: "Twitter / X",
      href: "https://x.com/Sujanthakor94",
      Icon: FaXTwitter,
    },
    { label: "Resume", href: "/resume.pdf", Icon: FileText },
  ];

  const handleMailTo = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    await navigator.clipboard.writeText("work@sujansinhthakor.com");
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-[#f5f5f7]">
            Email copied!
          </span>
          <button
            onClick={() => {
              window.open(
                "https://mail.google.com/mail/u/0/#inbox?compose=new",
                "_blank",
              );
              toast.dismiss(t.id);
            }}
            className="text-[12px] font-semibold bg-[var(--accent)] text-black px-3 py-1.5 rounded-full hover:bg-[rgba(var(--accent-rgb),0.8)] transition-colors"
          >
            Open Gmail
          </button>
        </div>
      ),
      {
        position: "bottom-right",
        duration: 2000,
        style: {
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "12px 16px",
        },
      },
    );
  };

  return (
    <section
      id="contact"
      className="max-w-[1200px] mx-auto px-6 md:px-[60px] py-24 md:py-[120px] text-center"
    >
      <Reveal className="mx-auto">
        <SectionLabel>Say Hello</SectionLabel>
      </Reveal>
      <Reveal>
        <SectionTitle>
          Let's build
          <br />
          <span className="text-[#6e6e73]">something great.</span>
        </SectionTitle>
      </Reveal>

      <Reveal>
        <p className="text-[17px]  text-[#aeaeb2] max-w-[440px] mx-auto leading-[1.7] mb-12">
          I'm always interested in ambitious projects, great teams, and
          conversations that could lead somewhere.
        </p>
      </Reveal>

      <Reveal>
        <a
          onClick={handleMailTo}
          className="inline-block text-[36px] font-semibold tracking-[-1.5px] text-[#f5f5f7] pb-1 border-b-2 border-transparent transition-colors hover:text-[var(--accent)] hover:border-[var(--accent)]"
        >
          work@sujansinhthakor.com
        </a>
      </Reveal>

      <Reveal delayMs={100} className="mt-12">
        <div className="flex flex-wrap justify-center gap-3.5">
          {links.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#6e6e73] bg-[#161616] border border-white/[0.08] rounded-full px-5 py-2.5 transition-colors hover:text-[#f5f5f7] hover:border-white/[0.14] hover:bg-[#1c1c1e]"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ----------------------------------------------------------------
   Footer
----------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] px-6 md:px-[60px] py-7 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center max-w-[1200px] mx-auto">
      <p className="text-xs text-[#6e6e73]">
        © 2026 Sujansinh Thakor. Built with care.
      </p>
      <div className="flex gap-5">
        <a
          href="#hero"
          className="text-xs text-[#6e6e73] transition-colors hover:text-[#f5f5f7]"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------------
   Root component
----------------------------------------------------------------- */

export default function Portfolio() {
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    const ids: SectionId[] = ["hero", ...NAV_LINKS, "contact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-black text-[#f5f5f7] font-sans antialiased leading-relaxed">
      <GlobalStyles />
      <AmbientBackground />
      <Nav active={active} />
      <Hero />
      <Divider />
      <About />
      <Divider />
      <Skills />
      <Divider />
      <Projects />
      <Divider />
      <Experience />
      <Divider />
      <Contact />
      <Footer />
    </div>
  );
}

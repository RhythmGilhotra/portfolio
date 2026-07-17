"use client";

import { motion } from "framer-motion";
import {
  identity,
  origins,
  ascent,
  commandCenter,
  artifacts,
  constellation,
  monuments,
  transmission,
} from "@/lib/story";

const reveal = {
  hidden: { opacity: 0, y: 34 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function Section({
  children,
  className = "",
  align = "center",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "center" | "left" | "right";
}) {
  const a =
    align === "left"
      ? "items-start text-left"
      : align === "right"
        ? "items-end text-right"
        : "items-center text-center";
  const sx = align === "left" ? "34%" : align === "right" ? "66%" : "50%";
  return (
    <section
      className={`relative flex min-h-screen w-full flex-col justify-center px-6 md:px-16 ${a} ${className}`}
    >
      <div
        className="scrim relative max-w-2xl"
        style={{ ["--sx" as string]: sx }}
      >
        {children}
      </div>
    </section>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className="chapter-kicker mb-6 font-mono"
    >
      {children}
    </motion.p>
  );
}

export default function Overlay() {
  return (
    <div className="relative z-10">
      {/* 00 Arrival */}
      <Section>
        <motion.p
          variants={reveal}
          initial="hidden"
          animate="show"
          className="chapter-kicker mb-8 font-mono"
        >
          {identity.role}
        </motion.p>
        <motion.h1
          variants={reveal}
          initial="hidden"
          animate="show"
          custom={1}
          className="legible font-display text-5xl font-light leading-[0.95] md:text-8xl"
        >
          Rhythm
          <br />
          <span className="italic text-gold">Gilhotra</span>
        </motion.h1>
        <motion.p
          variants={reveal}
          initial="hidden"
          animate="show"
          custom={2}
          className="mx-auto mt-8 max-w-md text-base text-mist/70 md:text-lg"
        >
          {identity.tagline}
        </motion.p>
        <motion.p
          variants={reveal}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-16 font-mono text-xs tracking-widest text-mist/40"
        >
          scroll to travel · press <span className="text-gold">`</span> for terminal
        </motion.p>
      </Section>

      {/* 01 Origins */}
      <Section align="left">
        <Kicker>{origins.kicker}</Kicker>
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="legible font-display text-4xl font-light leading-tight md:text-6xl"
        >
          {origins.title}
        </motion.h2>
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          custom={1}
          className="mt-6 text-mist/70 md:text-lg"
        >
          {origins.body}
        </motion.p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {origins.facts.map((f, i) => (
            <motion.div
              key={f.label}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              custom={i + 2}
              className="glass rounded-lg p-4"
            >
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-gold/80">
                {f.label}
              </p>
              <p className="mt-1 text-sm text-mist">{f.value}</p>
            </motion.div>
          ))}
        </div>
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          custom={6}
          className="mt-6 text-sm italic text-mist/55"
        >
          {origins.leadership}
        </motion.p>
      </Section>

      {/* 02 Ascent */}
      <Section align="right">
        <Kicker>{ascent.kicker}</Kicker>
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="legible font-display text-4xl font-light leading-tight md:text-6xl"
        >
          {ascent.title}
        </motion.h2>
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          custom={1}
          className="mt-4 text-mist/70 md:text-lg"
        >
          {ascent.intro}
        </motion.p>
        <div className="mt-10 space-y-5">
          {ascent.peaks.map((p, i) => (
            <motion.div
              key={p.role}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={i + 1}
              className="glass rounded-xl p-5 text-left"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl text-mist">{p.role}</h3>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-gold/80">
                  {p.alt}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-ice/70">{p.period}</p>
              <p className="mt-3 text-sm text-mist/70">{p.story}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 03 Command Center */}
      <Section>
        <Kicker>{commandCenter.kicker}</Kicker>
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="legible font-display text-4xl font-light leading-tight md:text-6xl"
        >
          {commandCenter.title}
        </motion.h2>
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          custom={1}
          className="mx-auto mt-6 max-w-xl text-mist/70 md:text-lg"
        >
          {commandCenter.body}
        </motion.p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {commandCenter.stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              className="glass rounded-lg p-5"
            >
              <p className="font-display text-2xl text-gold md:text-3xl">{s.value}</p>
              <p className="mt-1 text-[0.7rem] text-mist/60">{s.label}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          custom={6}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 font-mono text-xs"
        >
          {commandCenter.pipeline.map((p, i) => (
            <span key={p} className="flex items-center gap-2">
              <span className="rounded border border-ice/30 px-3 py-1 text-ice/80">
                {p}
              </span>
              {i < commandCenter.pipeline.length - 1 && (
                <span className="text-gold/60">→</span>
              )}
            </span>
          ))}
        </motion.div>
      </Section>

      {/* 04 Artifacts */}
      <Section align="left">
        <Kicker>{artifacts.kicker}</Kicker>
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="legible font-display text-4xl font-light leading-tight md:text-6xl"
        >
          {artifacts.title}
        </motion.h2>
        <div className="mt-10 space-y-6">
          {artifacts.projects.map((p, i) => (
            <motion.div
              key={p.name}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              className="glass rounded-xl p-6"
            >
              <h3 className="font-display text-2xl text-mist">{p.name}</h3>
              <p className="mt-1 font-mono text-xs text-gold/70">{p.place}</p>
              <p className="mt-3 text-sm text-mist/70">{p.story}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-mist/15 px-3 py-1 font-mono text-[0.65rem] text-ice/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 05 Constellation */}
      <Section align="right">
        <Kicker>{constellation.kicker}</Kicker>
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="legible font-display text-4xl font-light leading-tight md:text-6xl"
        >
          {constellation.title}
        </motion.h2>
        <div className="mt-10 space-y-5">
          {constellation.clusters.map((c, i) => (
            <motion.div
              key={c.name}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-gold/80">
                {c.name}
              </p>
              <div className="mt-2 flex flex-wrap justify-end gap-2">
                {c.stars.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-ice/20 bg-ice/5 px-3 py-1 text-xs text-mist/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 06 Monuments */}
      <Section>
        <Kicker>{monuments.kicker}</Kicker>
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="legible font-display text-4xl font-light leading-tight md:text-6xl"
        >
          {monuments.title}
        </motion.h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {monuments.awards.map((a, i) => (
            <motion.div
              key={a.name + a.when}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              className="glass rounded-xl p-6 text-left"
            >
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-gold">
                {a.when}
              </p>
              <h3 className="mt-2 font-display text-xl text-mist">{a.name}</h3>
              <p className="font-mono text-[0.65rem] text-ice/60">{a.org}</p>
              <p className="mt-3 text-xs text-mist/65">{a.story}</p>
            </motion.div>
          ))}
        </div>
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          custom={4}
          className="glass mx-auto mt-8 max-w-xl rounded-xl px-6 py-4 text-sm italic text-mist/80"
        >
          {monuments.mentorship}
        </motion.p>
      </Section>

      {/* 07 Transmission */}
      <Section>
        <Kicker>{transmission.kicker}</Kicker>
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="legible font-display text-5xl font-light leading-tight md:text-7xl"
        >
          {transmission.title}
        </motion.h2>
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          custom={1}
          className="mx-auto mt-6 max-w-md text-mist/70 md:text-lg"
        >
          {transmission.body}
        </motion.p>
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          custom={2}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href={`mailto:${identity.email}`}
            className="rounded-full bg-gold px-8 py-3 font-mono text-sm text-void transition hover:bg-gold/85"
          >
            {identity.email}
          </a>
          <a
            href={identity.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-mist/20 px-8 py-3 font-mono text-sm text-mist transition hover:border-gold/60 hover:text-gold"
          >
            LinkedIn ↗
          </a>
        </motion.div>
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          custom={3}
          className="mt-16 font-mono text-[0.65rem] tracking-widest text-mist/30"
        >
          Rhythm Gilhotra · {identity.location} · built as an interactive universe
        </motion.p>
      </Section>
    </div>
  );
}

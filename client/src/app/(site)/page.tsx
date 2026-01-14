"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCode, FaProjectDiagram } from "react-icons/fa";
import { FaSitemap } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="min-h-screen bg-primary text-white px-6">
      {/* HERO */}
      <section className="flex min-h-screen flex-col items-center justify-center text-center space-y-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/site/profile.webp"
            alt="Rahul Kumar"
            width={140}
            height={140}
            priority
            className="rounded-full border-4 border-[#7618f1]"
          />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-bold">Rahul Kumar</h1>

        <p className="text-lg text-zinc-300">
          Software Engineer • Full Stack • AI/ML Learner
        </p>

        <p className="max-w-2xl text-zinc-400">
          I build scalable web applications using modern technologies and
          actively work on improving Data Structures, system design, and Machine
          Learning fundamentals.
        </p>

        <div className="flex gap-4 flex-wrap justify-center pt-4">
          <Link
            href="/portfolio"
            className="rounded-full bg-[#7618f1] px-6 py-2 font-medium hover:opacity-90 transition"
          >
            View Portfolio
          </Link>

          <Link
            href="/projects"
            className="rounded-full border border-[#38bdf8] px-6 py-2 text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black transition"
          >
            Explore Projects
          </Link>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="mx-auto max-w-6xl py-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <HomeCard
          icon={<FaCode />}
          title="Portfolio"
          desc="Selected work showcasing my skills, experience, and best projects."
          href="/portfolio"
        />

        <HomeCard
          icon={<FaProjectDiagram />}
          title="Projects"
          desc="All my web, backend, and experimental projects in one place."
          href="/projects"
        />

        <HomeCard
          icon={<FaSitemap />}
          title="System Design"
          desc="Architecture decisions, system breakdowns, and scalability notes."
          href="/system-design"
        />

        <HomeCard
          icon={<FaCode />}
          title="Apps"
          desc="Live application demos and experimental tools you can interact with."
          href="/app"
        />
      </section>
    </main>
  );
}

function HomeCard({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-700 bg-zinc-900/40 p-6 hover:border-[#7618f1] transition"
    >
      <div className="mb-4 text-2xl text-[#38bdf8] group-hover:text-[#7618f1] transition">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-zinc-400">{desc}</p>
    </Link>
  );
}

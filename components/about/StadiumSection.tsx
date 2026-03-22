"use client";

import Image from "next/image";

interface StadiumStat {
  value: string;
  label: string;
}

interface StadiumSectionProps {
  title: string;
  subtitle: string;
  stats: StadiumStat[];
}

export default function StadiumSection({
  title,
  subtitle,
  stats,
}: StadiumSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-secondary text-white relative overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-6 tracking-tight flex justify-center items-center flex-wrap gap-2">
            <span className="text-primary">Sân vận động</span> <span className="p-1.5 bg-primary text-white rounded-sm">{title}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            {subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105"
              >
                <div className="text-3xl md:text-4xl font-black text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center flex-wrap gap-4 mt-12">
          <Image className="w-full md:w-[calc(100%/3-11px)] rounded-md" src="/flag-namdinhfc-1.jpg" alt="Stadium" width={640} height={480} />
          <Image className="w-full md:w-[calc(100%/3-11px)] rounded-md" src="/thientruong-stadium-1.jpg" alt="Stadium" width={640} height={480} />
          <Image className="w-full md:w-[calc(100%/3-11px)] rounded-md" src="/flag-namdinhfc-2.jpg" alt="Stadium" width={640} height={480} />
        </div>
      </div>

      {/* Abstract background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-primary/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
    </section>
  );
}

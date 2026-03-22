"use client";

interface SquadStatsProps {
  totalPlayers: number;
  foreignPlayers: number;
  averageAge: number;
  totalGoals: number;
}

interface StatItemProps {
  value: number | string;
  label: string;
  delay?: number;
}

function StatItem({ value, label, delay = 0 }: StatItemProps) {
  return (
    <div
      className="text-center"
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`,
      }}
    >
      <div className="text-3xl md:text-4xl lg:text-5xl font-black text-primary mb-2">
        {value}
      </div>
      <div className="text-xs md:text-sm uppercase tracking-widest text-white/60 font-medium">
        {label}
      </div>
    </div>
  );
}

const SquadStats = ({
  totalPlayers,
  foreignPlayers,
  averageAge,
  totalGoals,
}: SquadStatsProps) => {
  return (
    <section className="bg-secondary py-12 md:py-16 lg:py-20 text-white overflow-hidden relative">
      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatItem value={totalPlayers} label="Tổng số cầu thủ" delay={0} />
          <StatItem value={foreignPlayers} label="Ngoại binh" delay={100} />
          <StatItem value={averageAge} label="Độ tuổi trung bình" delay={200} />
          <StatItem value={totalGoals} label="Tổng bàn thắng" delay={300} />
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default SquadStats;

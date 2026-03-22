import { Player, positionLabels } from "@/data/players";
import Image from "next/image";

interface PlayerCardProps {
    player: Player;
    index?: number;
}

const PlayerCard = ({ player, index = 0 }: PlayerCardProps) => {
    return (
        <div
            className="group relative overflow-hidden cursor-pointer animate-fade-in-up bg-linear-to-br from-primary to-primary-dark rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            style={{
                animationDelay: `${index * 80}ms`,
            }}
        >
            {/* Club Logo Watermark - Full Card */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 mix-blend-screen opacity-10">
                <Image
                    src="/main-logo.jpg"
                    alt="Logo"
                    width={350}
                    height={350}
                    className="object-contain rounded-full grayscale scale-125"
                />
            </div>

            {/* Large Background Number - Restored to Old Position (Top Right) */}
            <span className="absolute -top-2 -right-1 text-9xl font-black text-white/30 leading-none select-none italic z-0 pointer-events-none">
                {player.number}
            </span>

            {/* Top Area: Avatar & Badge */}
            <div className="relative pt-16 pb-6 px-6 flex flex-col items-center justify-center z-10">
                {/* Position badge */}
                <div className="absolute top-5 left-5 bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-sm z-20 font-bold uppercase text-[10px] tracking-widest px-3 py-1.5 rounded-full">
                    {positionLabels[player.position]}
                </div>

                {/* Avatar / Photo */}
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-500 border-4 border-white/80 relative z-10">
                    {player.image ? (
                        <Image
                            src={player?.image || ""}
                            alt={player.name}
                            width={120}
                            height={120}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary/40 flex items-center justify-center">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="rgba(255,255,255,0.7)"
                                strokeWidth="1.5"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Area */}
            <div className="px-6 pb-6 relative z-10">
                {/* Name & Small Number - Restored to Old Position (Inline) */}
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-extrabold text-xl text-white leading-tight truncate pr-2 drop-shadow-sm">
                        {player.name}
                    </h3>
                    <span className="font-heading font-black text-2xl text-white leading-none shrink-0 drop-shadow-md">
                        #{player.number}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/80 font-medium mb-4">
                    <span>{player.nationality}</span>
                </div>

                {player.stats && (
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/20 pt-4">
                        <div className="flex flex-col">
                            <p className="text-white font-black text-xl drop-shadow-sm">{player.stats.appearances}</p>
                            <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold mt-0.5">Trận đấu</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-white font-black text-xl drop-shadow-sm">{player.stats.goals}</p>
                            <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold mt-0.5">Bàn thắng</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerCard;

import Image from "next/image";

import { positionLabels } from "@/data/players";
import { formatDate } from "@/lib/format-date";
import type { PlayerDetail } from "@/lib/payload-api";
import { getPreferredFootLabel } from "@/lib/player-foot";

interface PlayerProfileProps {
  player: PlayerDetail;
}

interface InfoItem {
  label: string;
  value: string;
}

/** Chỉ hiện các thông tin đã khai trong CMS, tránh lưới đầy ô "chưa cập nhật". */
function buildInfoItems(player: PlayerDetail): InfoItem[] {
  const birthDate = player.dateOfBirth ? formatDate(player.dateOfBirth) : "";

  const items: (InfoItem | null)[] = [
    { label: "Vị trí", value: positionLabels[player.position] },
    { label: "Số áo", value: String(player.number) },
    { label: "Quốc tịch", value: player.nationality },
    birthDate
      ? {
          label: "Ngày sinh",
          value: player.age > 0 ? `${birthDate} (${player.age} tuổi)` : birthDate,
        }
      : null,
    player.height ? { label: "Chiều cao", value: `${player.height} cm` } : null,
    player.weight ? { label: "Cân nặng", value: `${player.weight} kg` } : null,
    player.preferredFoot
      ? { label: "Chân thuận", value: getPreferredFootLabel(player.preferredFoot) }
      : null,
    player.joinedDate
      ? { label: "Gia nhập CLB", value: formatDate(player.joinedDate) }
      : null,
  ];

  return items.filter((item): item is InfoItem => item !== null);
}

const PlayerProfile = ({ player }: PlayerProfileProps) => {
  const infoItems = buildInfoItems(player);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-8 lg:gap-12 items-start">
      {/* Ảnh cầu thủ */}
      <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-linear-to-br from-primary to-primary-dark shadow-lg">
        {/* Logo mờ làm nền khi ảnh thiếu hoặc nền trong suốt */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen opacity-10">
          <Image
            src="/main-logo.jpg"
            alt=""
            width={320}
            height={320}
            className="object-contain rounded-full grayscale"
          />
        </div>

        <span className="absolute -top-4 right-2 text-[9rem] font-black text-white/25 leading-none select-none italic pointer-events-none">
          {player.number}
        </span>

        {player.image && (
          <Image
            src={player.image}
            alt={player.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 380px"
            className="object-cover object-top"
          />
        )}

        <div className="absolute top-5 left-5 bg-white/20 text-white backdrop-blur-md border border-white/20 font-bold uppercase text-[10px] tracking-widest px-3 py-1.5 rounded-full">
          {positionLabels[player.position]}
        </div>
      </div>

      {/* Thông tin */}
      <div>
        <h2 className="font-heading text-2xl md:text-3xl font-black text-secondary uppercase tracking-tight mb-6">
          Thông Tin Cá Nhân
        </h2>

        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {infoItems.map((item) => (
            <div key={item.label} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <dt className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1.5">
                {item.label}
              </dt>
              <dd className="text-base md:text-lg font-bold text-secondary">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default PlayerProfile;

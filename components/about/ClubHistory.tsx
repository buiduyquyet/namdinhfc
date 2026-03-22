"use client";

import Image from "next/image";

interface ClubStats {
  founded: string;
  titles: number;
  stadiumCapacity: number;
}

interface ClubInfo {
  founded: string;
  history: string;
  description: string;
}

interface ClubHistoryProps {
  clubStats: ClubStats;
  clubInfo: ClubInfo;
}

export default function ClubHistory({ clubStats, clubInfo }: ClubHistoryProps) {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl group order-2 lg:order-1">
            <Image
              src="/cover-bg-2.jpg"
              alt="Nam Dinh FC History"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <div className="text-primary text-5xl md:text-6xl font-black mb-2">
                {clubStats.founded}
              </div>
              <div className="text-white font-bold uppercase tracking-widest text-sm">
                Năm thành lập
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase mb-6 leading-tight">
              Lịch sử & <span className="text-primary">Truyền Thống</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                Tiền thân là đội bóng Thanh niên Nam Hà thành lập năm{" "}
                {clubInfo.founded}, Thép Xanh Nam Định đã trải qua gần 60 năm
                lịch sử với nhiều thăng trầm nhưng luôn giữ được bản sắc riêng
                biệt của bóng đá thành Nam.
              </p>
              <p>
                Đội bóng nổi tiếng với lối đá rực lửa, cống hiến và đặc biệt là
                sự ủng hộ cuồng nhiệt từ các cổ động viên - những ngưởi đã biến
                Thiên Trường thành &quot;chảo lửa&quot; không thể khuất phục tại
                Việt Nam.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 md:gap-8 pt-8 mt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl md:text-4xl font-black text-secondary">
                  {clubStats.titles}
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-tighter mt-1">
                  Vô địch V.League
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-secondary">
                  {clubStats.stadiumCapacity.toLocaleString()}
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-tighter mt-1">
                  Sức chứa khán đài
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

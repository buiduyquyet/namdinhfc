"use client";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

function TimelineItem({
  event,
  index,
  isLeft,
}: {
  event: TimelineEvent;
  index: number;
  isLeft: boolean;
}) {
  return (
    <div className="relative">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center w-full">
        {/* Left Content */}
        <div className={`w-[calc(50%-2rem)] mr-3 ${isLeft ? "pr-8" : "opacity-0 pointer-events-none"}`}>
          {isLeft && (
            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-md transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <time className="font-black text-primary text-xl italic">
                  {event.year}
                </time>
                <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {event.type}
                </span>
              </div>
              <h3 className="font-extrabold text-secondary text-lg mb-2 uppercase tracking-tight">
                {event.title}
              </h3>
              <p className="text-base text-gray-500 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Center Dot */}
        <div className="relative flex items-center justify-center w-10 h-10 shrink-0 z-10">
          <div className="absolute inset-0 rounded-full border-4 border-white bg-primary text-secondary font-black shadow-lg flex items-center justify-center text-sm">
            {index + 1}
          </div>
        </div>

        {/* Right Content */}
        <div className={`w-[calc(50%-2rem)] ${!isLeft ? "pl-8" : "opacity-0 pointer-events-none"}`}>
          {!isLeft && (
            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-md transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <time className="font-black text-primary text-xl italic">
                  {event.year}
                </time>
                <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {event.type}
                </span>
              </div>
              <h3 className="font-extrabold text-secondary text-lg mb-2 uppercase tracking-tight">
                {event.title}
              </h3>
              <p className="text-base text-gray-500 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex items-start gap-4">
        {/* Mobile Dot */}
        <div className="relative flex items-center justify-center w-10 h-10 shrink-0 z-10 mt-1">
          <div className="absolute inset-0 rounded-full border-4 border-white bg-primary text-secondary font-black shadow-lg flex items-center justify-center text-sm">
            {index + 1}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 p-5 rounded-xl bg-white border border-gray-100 shadow-md">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <time className="font-black text-primary text-xl italic">
              {event.year}
            </time>
            <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {event.type}
            </span>
          </div>
          <h3 className="font-extrabold text-secondary text-lg mb-2 uppercase tracking-tight">
            {event.title}
          </h3>
          <p className="text-base text-gray-500 leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
}

const Timeline = ({ events }: TimelineProps) => {
  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Vertical line - Desktop: center, Mobile: left (20px = half of w-10) */}
      <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20" />

      {/* Timeline items */}
      <div className="space-y-8 md:space-y-12">
        {events.map((event, index) => (
          <TimelineItem
            key={event.year}
            event={event}
            index={index}
            isLeft={index % 2 === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;

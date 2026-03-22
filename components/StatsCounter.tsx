"use client";

import { useEffect, useRef, useState } from "react";

interface StatsCounterProps {
    items: {
        value: number;
        suffix?: string;
        label: string;
    }[];
}

function AnimatedNumber({
    target,
    suffix = "",
    duration = 2000,
    shouldAnimate,
}: {
    target: number;
    suffix?: string;
    duration?: number;
    shouldAnimate: boolean;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldAnimate) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [target, duration, shouldAnimate]);

    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return num.toLocaleString("vi-VN");
        }
        return num.toString();
    };

    return (
        <span>
            {formatNumber(count)}
            {suffix}
        </span>
    );
}

export default function StatsCounter({ items }: StatsCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(items.length, 2)}, 1fr)`,
                gap: "1.5rem",
            }}
            className="stats-grid"
        >
            {items.map((item, index) => (
                <div
                    key={item.label}
                    style={{
                        textAlign: "center",
                        padding: "2rem 1rem",
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "rgba(152, 197, 233, 0.06)",
                        border: "1px solid rgba(152, 197, 233, 0.1)",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(20px)",
                        transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                    }}
                >
                    <div
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            fontWeight: 900,
                            color: "var(--color-primary-50)",
                            lineHeight: 1,
                            marginBottom: "0.5rem",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        <AnimatedNumber
                            target={item.value}
                            suffix={item.suffix}
                            shouldAnimate={isVisible}
                        />
                    </div>
                    <div
                        style={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: "rgba(255, 255, 255, 0.5)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontFamily: "var(--font-heading)",
                        }}
                    >
                        {item.label}
                    </div>
                </div>
            ))}

            <style jsx global>{`
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(${items.length}, 1fr) !important;
          }
        }
      `}</style>
        </div>
    );
}

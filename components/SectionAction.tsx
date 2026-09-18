"use client";

import { RightCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useId, useState } from "react";

export default function SectionAction({ label, href }: { label: string; href: string }) {
  const tooltipId = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const visible = (hovered || focused) && !dismissed;

  return (
    <span
      className="section-action"
      onMouseEnter={() => { setHovered(true); setDismissed(false); }}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={href}
        className="section-action-link"
        aria-label={label}
        aria-describedby={visible ? tooltipId : undefined}
        onFocus={() => { setFocused(true); setDismissed(false); }}
        onBlur={() => setFocused(false)}
        onKeyDown={(event) => { if (event.key === "Escape") setDismissed(true); }}
      >
        <RightCircleOutlined aria-hidden="true" />
      </Link>
      <span id={tooltipId} role="tooltip" className="section-action-tooltip" hidden={!visible}>
        {label}
      </span>
    </span>
  );
}

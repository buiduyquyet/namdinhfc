import { RichText } from "@payloadcms/richtext-lexical/react";

import type { PlayerDetail } from "@/lib/payload-api";

interface PlayerBioProps {
  bio: PlayerDetail["bio"];
}

/**
 * Render tiểu sử Lexical của cầu thủ.
 * Typography nằm ở class `.rich-text` trong `app/globals.css`.
 */
const PlayerBio = ({ bio }: PlayerBioProps) => {
  if (!bio) return null;

  return <RichText data={bio} className="rich-text" disableContainer />;
};

export default PlayerBio;

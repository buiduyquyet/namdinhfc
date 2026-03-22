import { Player, players as localPlayers, Position } from "@/data/players";

// --- API Response Interfaces ---

interface ApiPlayerInfo {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
  nationality: string;
}

interface ApiGamesStats {
  appearences: number | null;
  position: string | null;
  number: number | null;
}

interface ApiGoalsStats {
  total: number | null;
  assists: number | null;
}

interface ApiPlayerStatistics {
  games: ApiGamesStats;
  goals: ApiGoalsStats;
}

interface ApiPlayerResponse {
  player: ApiPlayerInfo;
  statistics: ApiPlayerStatistics[];
}

interface ApiPaging {
  current: number;
  total: number;
}

interface ApiFootballResponse {
  response: ApiPlayerResponse[];
  paging: ApiPaging;
  errors?: Record<string, string>;
}

// --- Constants ---

const DEFAULT_NAM_DINH_TEAM_ID = 5734;

// --- Helper functions ---

/** Maps API position string to our internal Position type */
function mapPosition(apiPlayer: ApiPlayerInfo, apiStats: ApiPlayerStatistics | null): Position {
  const apiPos = (apiPlayer.position || apiStats?.games?.position || "").toLowerCase();
  if (apiPos.includes("goalkeeper")) return "goalkeeper";
  if (apiPos.includes("defender") || apiPos.includes("back")) return "defender";
  if (apiPos.includes("attacker") || apiPos.includes("forward") || apiPos.includes("striker")) return "forward";
  return "midfielder";
}

/** Maps a single API player response to our Player interface */
function mapApiPlayerToPlayer(item: ApiPlayerResponse): Player {
  const { player: apiPlayer, statistics } = item;
  const apiStats = statistics?.length > 0 ? statistics[0] : null;

  const appearances = apiStats?.games?.appearences ?? 0;
  const goals = apiStats?.goals?.total ?? 0;
  const assists = apiStats?.goals?.assists ?? 0;
  const playerNumber = apiPlayer.number ?? apiStats?.games?.number ?? 0;
  const nationality =
    apiPlayer.nationality && apiPlayer.nationality !== "Unknown"
      ? apiPlayer.nationality
      : "Việt Nam";

  const isFeatured =
    localPlayers.find(
      (p) => p.name.includes(apiPlayer.name) || apiPlayer.name.includes(p.name)
    )?.isFeatured ?? false;

  return {
    id: `api-${apiPlayer.id}`,
    name: apiPlayer.name,
    slug: apiPlayer.name.toLowerCase().replace(/\s+/g, "-"),
    number: playerNumber,
    position: mapPosition(apiPlayer, apiStats),
    nationality,
    age: apiPlayer.age ?? 0,
    image: apiPlayer.photo,
    stats: { appearances, goals, assists },
    isFeatured,
  } as Player;
}

// --- Main export ---

/** Fetches squad data from API-Football, falls back to local static data if unavailable */
export async function getSquadData(): Promise<Player[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const teamId = process.env.API_FOOTBALL_TEAM_ID || DEFAULT_NAM_DINH_TEAM_ID;
  const season = process.env.API_FOOTBALL_SEASON || 2024;

  if (!apiKey) {
    return localPlayers;
  }

  try {
    let allPlayers: ApiPlayerResponse[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const res = await fetch(
        `https://v3.football.api-sports.io/players?team=${teamId}&season=${season}&page=${page}`,
        { headers: { "x-apisports-key": apiKey } }
      );

      if (!res.ok) {
        throw new Error(`API-Football responded with status: ${res.status}`);
      }

      const json: ApiFootballResponse = await res.json();

      if (json.errors?.requests) {
        throw new Error(json.errors.requests);
      }

      if (json.response) {
        allPlayers = allPlayers.concat(json.response);
      }

      totalPages = json.paging?.total ?? 1;
      page++;
    } while (page <= totalPages);

    if (allPlayers.length === 0) {
      return localPlayers;
    }

    const mappedPlayers = allPlayers.map(mapApiPlayerToPlayer);
    return mappedPlayers.length > 0 ? mappedPlayers : localPlayers;

  } catch {
    return localPlayers;
  }
}

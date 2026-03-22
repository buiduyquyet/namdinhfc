import { Player, players as localPlayers, Position } from "@/data/players";

// You can find the team ID for Nam Dinh FC on the API-Football dashboard.
// We'll define a default ID here (you may need to verify or change it).
const DEFAULT_NAM_DINH_TEAM_ID = 5734; // Placeholder ID.

export async function getSquadData(): Promise<Player[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const teamId = process.env.API_FOOTBALL_TEAM_ID || DEFAULT_NAM_DINH_TEAM_ID;
  const season = process.env.API_FOOTBALL_SEASON || 2024; // Default to 2023 season

  // If no API key is provided, fallback to the static local data
  if (!apiKey) {
    console.warn("API_FOOTBALL_KEY is missing. Falling back to local players data.");
    return localPlayers;
  }

  try {
    let allPlayers: any[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const res = await fetch(
        `https://v3.football.api-sports.io/players?team=${teamId}&season=${season}&page=${page}`,
        {
          headers: {
            "x-apisports-key": apiKey,
          },
          // next: { revalidate: 86400 },
        }
      );
      if (!res.ok) {
        throw new Error(`API-Football responded with status: ${res.status}`);
      }

      const json = await res.json();

      if (json.errors && json.errors.requests) {
        throw new Error(json.errors.requests);
      }

      if (json.response) {
        allPlayers = allPlayers.concat(json.response);
      }

      totalPages = json.paging?.total || 1;
      page++;
    } while (page <= totalPages);

    if (allPlayers.length === 0) {
      console.warn("No detailed player data found for the given team ID. Falling back to local players data.");
      return localPlayers;
    }

    // Map the API data to our local Player interface
    const mappedPlayers: Player[] = allPlayers.map((item: any) => {
      const apiPlayer = item.player;
      const apiStats = item.statistics && item.statistics.length > 0 ? item.statistics[0] : null;
      console.log(item.statistics);
      // Map API positions to our Position type
      let mappedPosition: Position = "midfielder";
      const apiPos = apiPlayer.position
        ? apiPlayer.position.toLowerCase()
        : (apiStats?.games?.position ? apiStats.games.position.toLowerCase() : "");

      if (apiPos.includes("goalkeeper")) mappedPosition = "goalkeeper";
      else if (apiPos.includes("defender") || apiPos.includes("back")) mappedPosition = "defender";
      else if (apiPos.includes("attacker") || apiPos.includes("forward") || apiPos.includes("striker")) mappedPosition = "forward";

      let appearances = 0;
      let goals = 0;
      let assists = 0;

      if (apiStats) {
        appearances = apiStats.games?.appearences || 0;
        goals = apiStats.goals?.total || 0;
        assists = apiStats.goals?.assists || 0;
      }

      const playerNumber = apiPlayer.number !== null
        ? apiPlayer.number
        : (apiStats?.games?.number || 0);

      // Create a safely fallback for nationality
      const nationality = apiPlayer.nationality && apiPlayer.nationality !== "Unknown"
        ? apiPlayer.nationality
        : "Việt Nam";

      return {
        id: `api-${apiPlayer.id}`,
        name: apiPlayer.name,
        slug: apiPlayer.name.toLowerCase().replace(/\s+/g, '-'),
        number: playerNumber,
        position: mappedPosition,
        nationality: nationality,
        age: apiPlayer.age || 0,
        image: apiPlayer.photo,
        stats: { appearances, goals, assists },
        isFeatured: localPlayers.find(p => p.name.includes(apiPlayer.name) || apiPlayer.name.includes(p.name))?.isFeatured || false
      } as Player;
    });

    return mappedPlayers.length > 0 ? mappedPlayers : localPlayers;

  } catch (error) {
    console.error("Failed to fetch detailed player data from API-Football:", error);
    console.warn("Falling back to local players data.");
    return localPlayers;
  }
}

/**
 * roblox-api.js
 * Lightweight wrapper around Roblox's public, unauthenticated APIs.
 * No API key needed — these are the same endpoints the Roblox website uses.
 */
const RobloxAPI = (() => {

  /** Convert a place ID (the number in a roblox.com/games/ URL) to its universe ID. */
  async function getUniverseId(placeId) {
    const res = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
    if (!res.ok) throw new Error(`Failed to resolve universe ID for place ${placeId}`);
    const data = await res.json();
    return data.universeId;
  }

  /** Get a game's icon image URL. size examples: "50x50", "150x150", "512x512". */
  async function getGameIcon(universeId, size = "150x150") {
    const res = await fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=${size}&format=Png&isCircular=false`
    );
    if (!res.ok) throw new Error(`Failed to fetch icon for universe ${universeId}`);
    const data = await res.json();
    return data.data[0]?.imageUrl ?? null;
  }

  /** Get general game info: name, description, visits, playing (CCU), created/updated dates, etc. */
  async function getGameDetails(universeId) {
    const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
    if (!res.ok) throw new Error(`Failed to fetch game details for universe ${universeId}`);
    const data = await res.json();
    return data.data[0] ?? null;
  }

  /** Convenience: everything needed for a game card, from a place ID alone. */
  async function getGameCard(placeId, iconSize = "150x150") {
    const universeId = await getUniverseId(placeId);
    const [icon, details] = await Promise.all([
      getGameIcon(universeId, iconSize),
      getGameDetails(universeId)
    ]);
    return {
      universeId,
      iconUrl: icon,
      name: details?.name ?? null,
      playing: details?.playing ?? null,
      visits: details?.visits ?? null
    };
  }

  return { getUniverseId, getGameIcon, getGameDetails, getGameCard };
})();

// src/hooks/usePlayers.js
import { useState, useEffect, useMemo } from 'react';
import { loadPlayersCsv, fetchInfoboxSection } from '../api/fetchSections';
import { shuffleArray } from '../utils/shuffle';

export function usePlayers(difficultyLevel = 1, reloadKey = 0) {
  const [allPlayers, setAllPlayers] = useState([]);
  const [players, setPlayers]       = useState([]);
  const [sections, setSections]     = useState([]);

  const getPoolSize = lvl => {
    switch (lvl) {
      case 1: return 100;
      case 2: return 500;
      case 3: return 1000;
      case 4: return Infinity;
      default: return 100;
    }
  };

  // 1) Load CSV once and cache it internally
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await loadPlayersCsv();
      if (!cancelled) setAllPlayers(data);
    })();
    return () => { cancelled = true; };
  }, []);

  // 2) Whenever difficultyLevel or reloadKey changes, pick 10 new random players
  useEffect(() => {
    if (!allPlayers.length) return;

    const poolSize = getPoolSize(difficultyLevel);
    const topPool = [...allPlayers]
      .sort((a, b) => Number(b.overall_rating) - Number(a.overall_rating))
      .slice(0, poolSize === Infinity ? allPlayers.length : poolSize);

    const ten = shuffleArray(topPool).slice(0, 10);
    setPlayers(ten);
    setSections([]); // clear out old sections while we fetch fresh ones
  }, [allPlayers, difficultyLevel, reloadKey]);

  // 3) Fetch infobox HTML for the chosen players, ignoring any results if we reload in the meantime
  useEffect(() => {
    if (!players.length || !allPlayers.length) return;

    let cancelled = false;
    (async () => {
      const results = await Promise.all(players.map(fetchInfoboxSection));
      if (cancelled) return;

      const valid = results.filter(r => r !== null);
      if (valid.length < players.length) {
        // some failed → pick replacements and rerun
        const missing      = players.length - valid.length;
        const fetchedNames = valid.map(v => v.player.full_name);
        const poolSize     = getPoolSize(difficultyLevel);

        const replacements = shuffleArray(
          allPlayers
            .sort((a, b) => Number(b.overall_rating) - Number(a.overall_rating))
            .slice(0, poolSize === Infinity ? allPlayers.length : poolSize)
            .filter(p => !fetchedNames.includes(p.full_name))
        ).slice(0, missing);

        if (!cancelled) {
          setPlayers([...valid.map(v => v.player), ...replacements]);
          setSections([]); // trigger fetch again
        }
      } else {
        // all good
        if (!cancelled) {
          setSections(
            valid.map(v => ({
              id:     v.player.full_name,
              html:   v.html,
              player: v.player,
            }))
          );
        }
      }
    })();

    return () => { cancelled = true; };
  }, [players, allPlayers, difficultyLevel, reloadKey]);

  // suggestion list shuffle
  const shuffledAll = useMemo(() => shuffleArray(allPlayers), [allPlayers]);

  return { players, sections, shuffledAll };
}

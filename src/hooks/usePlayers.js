import { useState, useEffect, useMemo } from 'react';
import { loadPlayersCsv, fetchInfoboxSection } from '../api/fetchSections';

export function usePlayers(difficultyLevel = 1, reloadKey = 0) {
  const [allPlayers, setAllPlayers] = useState([]);
  const [players, setPlayers]     = useState([]);
  const [sections, setSections]   = useState([]);

  const getPoolSize = level => {
    switch (level) {
      case 1: return 100;  // Easy
      case 2: return 500;  // Medium
      case 3: return 100;  // Hard
      case 4: return Infinity; // Extreme
      default: return 100;
    }
  };

  useEffect(() => {
    (async () => {
      const data = await loadPlayersCsv();
      setAllPlayers(data);
    })();
  }, []);

  useEffect(() => {
    if (!allPlayers.length) return;

    const poolSize = getPoolSize(difficultyLevel);
    const sorted   = [...allPlayers]
      .sort((a, b) => parseInt(b.overall_rating) - parseInt(a.overall_rating))
      .slice(0, poolSize === Infinity ? allPlayers.length : poolSize)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    setPlayers(sorted);
    setSections([]);
  }, [allPlayers, difficultyLevel, reloadKey]);

  useEffect(() => {
    if (!players.length || !allPlayers.length) return;

    (async () => {
      const results = await Promise.all(players.map(fetchInfoboxSection));
      const valid   = results.filter(r => r !== null);

      if (valid.length < players.length) {
        const missing      = players.length - valid.length;
        const currentNames = valid.map(v => v.player.full_name);
        const poolSize     = getPoolSize(difficultyLevel);

        const replacements = [...allPlayers]
          .sort((a, b) => parseInt(b.overall_rating) - parseInt(a.overall_rating))
          .slice(0, poolSize === Infinity ? allPlayers.length : poolSize)
          .filter(p => !currentNames.includes(p.full_name))
          .sort(() => Math.random() - 0.5)
          .slice(0, missing);

        setPlayers([ ...valid.map(v => v.player), ...replacements ]);
        setSections([]);
      } else {
        setSections(valid.map(v => ({
          id:     v.player.full_name,
          html:   v.html,
          player: v.player
        })));
      }
    })();
  }, [players, allPlayers, difficultyLevel, reloadKey]);

  const shuffledAll = useMemo(
    () => [...allPlayers].sort(() => Math.random() - 0.5),
    [allPlayers]
  );

  return { players, sections, shuffledAll };
}

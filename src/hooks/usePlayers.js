// src/hooks/usePlayers.js
import { useState, useEffect, useMemo } from 'react';
import { loadPlayersCsv, fetchInfoboxSection } from '../api/fetchSections';

export function usePlayers() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await loadPlayersCsv();
      setAllPlayers(data);
      const top100 = data
        .sort((a, b) => parseInt(b.overall_rating) - parseInt(a.overall_rating))
        .slice(0, 100)
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      setPlayers(top100);
    })();
  }, []);

  useEffect(() => {
    if (!players.length || !allPlayers.length) return;
    (async () => {
      const results = await Promise.all(players.map(fetchInfoboxSection));
      const valid = results.filter(r => r !== null);
      if (valid.length < players.length) {
        const missing = players.length - valid.length;
        const currentNames = valid.map(v => v.player.full_name);
        const replacements = [...allPlayers]
          .sort((a, b) => parseInt(b.overall_rating) - parseInt(a.overall_rating))
          .slice(0, 100)
          .filter(p => !currentNames.includes(p.full_name))
          .sort(() => Math.random() - 0.5)
          .slice(0, missing);
        setPlayers([...valid.map(v => v.player), ...replacements]);
        setSections([]);
      } else {
        setSections(valid.map(v => ({ id: v.player.full_name, html: v.html, player: v.player })));
      }
    })();
  }, [players, allPlayers]);

  const shuffledAll = useMemo(() => [...allPlayers].sort(() => Math.random() - 0.5), [allPlayers]);

  return { players, sections, shuffledAll };
}

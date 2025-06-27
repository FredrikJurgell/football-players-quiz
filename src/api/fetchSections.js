import Papa from 'papaparse';

let _csvCache = null;

export async function loadPlayersCsv(path = '/fifa_players.csv') {
  if (_csvCache) return _csvCache;

  const res  = await fetch(path);
  const text = await res.text();
  const data = Papa.parse(text, { header: true }).data;

  _csvCache = data;
  return data;
}

export async function fetchInfoboxSection(player) {
  const tmp = document.createElement('div');
  let htmlText;
  const getHtml = async title => {
    const r = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`,
      { headers: { Accept: 'text/html' } }
    );
    if (!r.ok) throw new Error();
    return r.text();
  };
  const base = player.full_name.replace(/\./g, '').replace(/\s+/g, '_');
  try {
    htmlText = await getHtml(base);
  } catch {
    const s = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        player.full_name
      )}&limit=1&namespace=0&format=json&origin=*`
    );
    const [, titles] = await s.json();
    if (titles[0]) htmlText = await getHtml(titles[0]);
  }
  tmp.innerHTML = htmlText || '';
  const infobox = tmp.querySelector('table.infobox, table.infobox.vcard, table.infobox.vevent');
  if (!infobox) return null;
  infobox.querySelectorAll('a').forEach(a => a.replaceWith(document.createTextNode(a.textContent)));
  infobox.querySelectorAll('sup').forEach(s => s.remove());

  const rows = Array.from(
    infobox.querySelectorAll(':scope > tr, :scope > tbody > tr')
  );
  const normTxt = t => t.replace(/\u00a0/g, ' ').trim().toLowerCase();
  const start = rows.findIndex(r => normTxt(r.querySelector('th')?.textContent || '') === 'youth career');
  const end = rows.findIndex(r => normTxt(r.querySelector('th')?.textContent || '').startsWith('medal record'));
  const extract = start >= 0 ? (end > start ? rows.slice(start, end) : rows.slice(start)) : [];
  const seen = new Set();
  const unique = extract.filter(r => {
    const t = r.textContent.trim();
    return seen.has(t) ? false : seen.add(t);
  });
  const wrap = document.createElement('div'); wrap.className = 'flex justify-center mb-4';
  const tbl = document.createElement('table'); tbl.className = infobox.className;
  unique.forEach(r => tbl.appendChild(r.cloneNode(true)));
  wrap.appendChild(tbl);
  return { player, html: wrap.outerHTML };
}
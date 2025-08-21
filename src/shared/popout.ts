type WinKey = 'code'|'wiki'|'ops';
const KEYS = { code: 'win_code', wiki: 'win_wiki', ops: 'win_ops' } as const;

export function readWinRect(key: WinKey) {
  const raw = localStorage.getItem(KEYS[key]);
  if (!raw) return null;
  try { return JSON.parse(raw) as {x:number;y:number;width:number;height:number}; } catch { return null; }
}

export function writeWinRect(key: WinKey, rect: {x:number;y:number;width:number;height:number}) {
  localStorage.setItem(KEYS[key], JSON.stringify(rect));
}

export function openPopout(key: WinKey, url: string) {
  const rect = readWinRect(key) || defaultRect(key);
  const features = [
    `popup=yes`,
    `noopener=yes`,
    `noreferrer=yes`,
    `scrollbars=yes`,
    `resizable=yes`,
    `width=${rect.width}`, `height=${rect.height}`,
    `left=${rect.x}`, `top=${rect.y}`
  ].join(',');

  const w = window.open(url, `_blank`, features);
  // Fallback (popup blocked): try without features to let browser decide
  if (!w || w.closed) window.open(url, `_blank`);

  // Attach resize/move tracker (best-effort)
  const tracker = setInterval(() => {
    try {
      if (!w || w.closed) return clearInterval(tracker);
      // @ts-ignore cross-origin allowed for outerWidth/outerHeight/ screenX/Y in same origin
      const x = w.screenX ?? w.outerLeft ?? rect.x;
      const y = w.screenY ?? w.outerTop ?? rect.y;
      const width = w.outerWidth ?? rect.width;
      const height = w.outerHeight ?? rect.height;
      writeWinRect(key, { x, y, width, height });
    } catch { /* ignore */ }
  }, 800);
}

function defaultRect(key: WinKey) {
  // rough thirds for a 3‑monitor spread; adjust freely
  const W = window.screen.availWidth, H = window.screen.availHeight;
  if (key === 'code') return { x: 0,           y: 0, width: Math.max(1200, W/3), height: H };
  if (key === 'wiki') return { x: W/3,         y: 0, width: Math.max(1200, W/3), height: H };
  return                     { x: (2*W)/3,     y: 0, width: Math.max(1200, W/3), height: H }; // ops
}
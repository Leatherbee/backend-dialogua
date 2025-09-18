import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dialogua Backend</title>
<style>
  :root {
    --bg1:#0f1020; --bg2:#1a1b3a; --bg3:#2b3066;
    --card:#0b0c1a99; --glow:#9aa8ff55; --accent:#a5b4fc; --text:#e6e9ff;
    --muted:#b8c0ffcc; --ok:#22c55e; --chip:#11121f;
  }
  * { box-sizing: border-box; }
  html, body { height:100%; }
  body {
    margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif;
    color: var(--text);
    background: radial-gradient(1200px 1200px at 20% -10%, var(--bg3), transparent),
                radial-gradient(1000px 900px at 120% 20%, #4f46e5, transparent),
                linear-gradient(120deg, var(--bg1), var(--bg2));
    overflow: hidden;
  }
  .wrap {
    position:relative; height:100%; display:grid; place-items:center; padding:24px;
  }
  .orb {
    position:absolute; inset:-30% -30% auto auto; width:48vmax; aspect-ratio:1/1;
    background: radial-gradient(closest-side, #8b5cf6, transparent 70%);
    filter: blur(60px) saturate(120%); opacity:.35; animation: float 14s ease-in-out infinite;
    pointer-events:none;
  }
  @keyframes float { 0%,100%{ transform:translateY(0)} 50%{ transform:translateY(18px)} }

  .card {
    position:relative; width:min(920px, 92vw);
    border-radius:24px; padding:34px 36px;
    background: backdrop-filter(saturate(160%) blur(10px)) var(--card);
    outline: 1px solid #ffffff18; box-shadow: 0 20px 60px #0007, 0 0 0 1px var(--glow) inset;
  }
  .title {
    display:flex; align-items:center; gap:16px; margin:0 0 8px 0;
    font-size:clamp(28px, 3.2vw, 42px); letter-spacing:.4px; font-weight:800;
  }
  .title .emoji { filter: drop-shadow(0 2px 8px #0006); font-size:1.2em }
  .sub { margin:0 0 22px 0; color:var(--muted); font-size:clamp(14px, 1.4vw, 16px) }

  .row {
    display:flex; flex-wrap:wrap; gap:12px; margin: 20px 0 8px;
  }
  .chip {
    padding:8px 12px; border-radius:999px; background:var(--chip); border:1px solid #2a2b45;
    color:#c7d2fe; font-size:13px;
  }

  .status {
    display:inline-flex; align-items:center; gap:8px; font-size:14px;
    padding:8px 12px; border-radius:999px; background:#0f172a; border:1px solid #1f2547;
  }
  .dot { width:10px; height:10px; border-radius:50%; background:var(--ok); box-shadow:0 0 12px #22c55e99 }
  .actions { margin-top:22px; display:flex; gap:12px; flex-wrap:wrap; }
  .btn {
    padding:10px 14px; border-radius:12px; border:1px solid #2c2f57; background:#141635; color:#e9eaff;
    text-decoration:none; font-weight:600; transition:transform .12s ease, box-shadow .12s ease;
  }
  .btn:hover { transform: translateY(-1px); box-shadow:0 8px 22px #0006 }
  .btn.primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-color:transparent; }
  footer { margin-top:26px; opacity:.8; font-size:12.5px; color:#c7d2fe99 }
  code { background:#0f1430; border:1px solid #252a55; padding:2px 6px; border-radius:6px }
  svg { height:64px; width:64px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="orb" aria-hidden="true"></div>
    <section class="card" role="main">
      <h1 class="title">
        <span class="emoji" aria-hidden="true">🐾</span> Dialogua Backend
      </h1>
      <p class="sub">Welcome, dev! Your API is alive and purring. Use the links below to explore or check status.</p>

      <div class="status"><span class="dot" aria-hidden="true"></span> <strong>Healthy</strong> · <span id="ts"></span></div>

      <div class="row">
        <span class="chip">NestJS</span>
        <span class="chip">TypeScript</span>
        <span class="chip">WebSocket ready</span>
        <span class="chip">TTS/STT capable</span>
      </div>

      <div class="actions">
        <a class="btn primary" href="https://docs.nestjs.com" target="_blank" rel="noreferrer">Open Nest Docs</a>
        <a class="btn" href="/health" rel="noreferrer">/health</a>
        <a class="btn" href="/api" rel="noreferrer">/api</a>
      </div>

      <footer>
        Build at <code>GET /</code> · Deployed: <span id="env">production</span>
      </footer>
    </section>
  </div>

<script>
  // Minimal inline runtime info
  document.getElementById('ts').textContent =
    new Date().toLocaleString(undefined, { hour12:false });
  const env = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) || 'production';
  document.getElementById('env').textContent = env;
</script>
</body>
</html>`;
  }
}

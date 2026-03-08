'use client';

import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   Shared types & helpers
───────────────────────────────────────────── */
type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };
type WeldSpark = Spark & { tail: { x: number; y: number }[] };

function resizeCanvas(canvas: HTMLCanvasElement) {
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
}

/* ─────────────────────────────────────────────
   1 · Laser Cutting Canvas
───────────────────────────────────────────── */
function LaserCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let W = 0, H = 0, t = 0;
        const SPARKS: Spark[] = [];
        type CutPt = { x: number; y: number };
        const CUTS: CutPt[] = [];
        let headX = 0, cutIdx = 0;
        let raf: number;

        function init() {
            resizeCanvas(canvas!);
            W = canvas!.width; H = canvas!.height;
            headX = W * 0.15;
            CUTS.length = 0;
            const cx = W / 2, cy = H * 0.55, r = Math.min(W, H) * 0.28;
            for (let i = 0; i <= 360; i += 3) {
                const a = (i * Math.PI) / 180;
                const rv = r + (i % 30 < 5 ? 8 : -4);
                CUTS.push({ x: cx + rv * Math.cos(a), y: cy + rv * Math.sin(a) });
            }
        }

        function spawnSparks(x: number, y: number) {
            for (let i = 0; i < 4; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 1 + Math.random() * 3;
                SPARKS.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - Math.random() * 2, life: 1, size: 1 + Math.random() * 2, color: `hsl(${30 + Math.random() * 30},100%,${60 + Math.random() * 30}%)` });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            const mg = ctx.createLinearGradient(0, 0, W, H);
            mg.addColorStop(0, '#1a2530'); mg.addColorStop(0.5, '#141e28'); mg.addColorStop(1, '#0f1820');
            ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);

            ctx.fillStyle = '#1e2e40'; ctx.fillRect(0, H * 0.08, W, 12);
            ctx.fillStyle = '#2a3e52'; ctx.fillRect(0, H * 0.08, W, 3);

            const step = Math.floor(cutIdx) % CUTS.length;
            const target = CUTS[step];
            if (target) headX += (target.x - headX) * 0.12;

            const hx = headX, hy = H * 0.08 + 12;
            ctx.fillStyle = '#1e3040'; ctx.beginPath();
            (ctx as any).roundRect?.(hx - 22, hy, 44, 40, 4) ?? ctx.rect(hx - 22, hy, 44, 40);
            ctx.fill();
            ctx.strokeStyle = '#3a5060'; ctx.lineWidth = 1; ctx.stroke();

            ctx.fillStyle = '#2a3e50'; ctx.beginPath();
            (ctx as any).roundRect?.(hx - 8, hy + 38, 16, 18, 8) ?? ctx.rect(hx - 8, hy + 38, 16, 18);
            ctx.fill();

            const ng = ctx.createRadialGradient(hx, hy + 58, 0, hx, hy + 58, 10);
            ng.addColorStop(0, 'rgba(0,229,255,.9)'); ng.addColorStop(1, 'transparent');
            ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(hx, hy + 58, 10, 0, Math.PI * 2); ctx.fill();

            const bg2 = ctx.createLinearGradient(hx, hy + 58, hx, hy + 58 + (H - hy - 58));
            bg2.addColorStop(0, 'rgba(0,229,255,.95)'); bg2.addColorStop(0.6, 'rgba(0,229,255,.4)'); bg2.addColorStop(1, 'rgba(0,229,255,.05)');
            ctx.strokeStyle = bg2; ctx.lineWidth = 2.5;
            ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(hx, hy + 58); ctx.lineTo(hx, H); ctx.stroke();
            ctx.shadowBlur = 0;

            cutIdx = (cutIdx + 0.6) % CUTS.length;
            const drawn = Math.floor(cutIdx);
            ctx.beginPath(); ctx.strokeStyle = 'rgba(255,120,30,.85)'; ctx.lineWidth = 1.5;
            ctx.shadowColor = 'rgba(255,80,0,.8)'; ctx.shadowBlur = 4;
            for (let i = 0; i < drawn && i < CUTS.length - 1; i++) {
                if (i === 0) ctx.moveTo(CUTS[i].x, CUTS[i].y);
                else ctx.lineTo(CUTS[i].x, CUTS[i].y);
            }
            ctx.stroke(); ctx.shadowBlur = 0;

            if (target && Math.random() < 0.5) spawnSparks(target.x, target.y);

            for (let i = SPARKS.length - 1; i >= 0; i--) {
                const s = SPARKS[i];
                s.x += s.vx; s.y += s.vy; s.vy += 0.15; s.life -= 0.06;
                if (s.life <= 0) { SPARKS.splice(i, 1); continue; }
                ctx.globalAlpha = s.life; ctx.fillStyle = s.color;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1;
            }

            if (target) {
                const cg = ctx.createRadialGradient(target.x, target.y, 0, target.x, target.y, 18);
                cg.addColorStop(0, 'rgba(255,150,0,.8)'); cg.addColorStop(0.4, 'rgba(255,80,0,.3)'); cg.addColorStop(1, 'transparent');
                ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(target.x, target.y, 18, 0, Math.PI * 2); ctx.fill();
            }

            t += 0.02; raf = requestAnimationFrame(draw);
        }

        init();
        window.addEventListener('resize', init);
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ─────────────────────────────────────────────
   2 · CNC Machining Canvas
───────────────────────────────────────────── */
function CNCCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let W = 0, H = 0, t = 0;
        type Chip = { x: number; y: number; vx: number; vy: number; life: number; angle: number; size: number; color: string };
        const CHIPS: Chip[] = [];
        let raf: number;

        function init() { resizeCanvas(canvas!); W = canvas!.width; H = canvas!.height; }
        init(); window.addEventListener('resize', init);

        function draw() {
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#0a1420'; ctx.fillRect(0, 0, W, H);
            const cx = W / 2, cy = H / 2;

            // Workpiece
            ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 1.5);
            const r = Math.min(W, H) * 0.22;
            ctx.fillStyle = '#8a9aaa';
            ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.35, 0, 0, Math.PI * 2); ctx.fill();
            for (let i = 1; i <= 3; i++) {
                ctx.beginPath(); ctx.ellipse(0, 0, r * (1 - i * 0.22), r * (1 - i * 0.22) * 0.35, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,${0.08 * i})`; ctx.lineWidth = 1; ctx.stroke();
            }
            const sg = ctx.createLinearGradient(-r, 0, r, 0);
            sg.addColorStop(0, 'rgba(0,0,0,.3)'); sg.addColorStop(0.4, 'rgba(255,255,255,.15)'); sg.addColorStop(1, 'rgba(0,0,0,.3)');
            ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.35, 0, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // Tool paths
            ctx.strokeStyle = 'rgba(0,229,255,.12)'; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
            for (let ri = 20; ri < W * 0.3; ri += 20) { ctx.beginPath(); ctx.arc(cx, cy, ri, 0, Math.PI * 2); ctx.stroke(); }
            ctx.setLineDash([]);

            // End mill
            const tx = cx + Math.cos(t * 1.2) * W * 0.25;
            const ty = cy - H * 0.05 + Math.sin(t * 0.8) * H * 0.06;
            ctx.save(); ctx.translate(tx, ty); ctx.rotate(t * 8);
            ctx.fillStyle = '#2a3e50'; ctx.fillRect(-5, -50, 10, 50);
            for (let f = 0; f < 4; f++) {
                const fa = f * Math.PI / 2 + t * 5 * 8;
                ctx.strokeStyle = 'rgba(150,200,220,.4)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(fa) * 10, Math.sin(fa) * 10); ctx.stroke();
            }
            ctx.fillStyle = '#3a5060'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(0,229,255,.5)'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            if (Math.random() < 0.3) CHIPS.push({ x: tx, y: ty, vx: (Math.random() - 0.5) * 4, vy: -1 - Math.random() * 3, life: 1, angle: Math.random() * Math.PI * 2, size: 2 + Math.random() * 4, color: `hsl(${180 + Math.random() * 40},50%,${50 + Math.random() * 20}%)` });

            for (let i = CHIPS.length - 1; i >= 0; i--) {
                const c = CHIPS[i];
                c.x += c.vx; c.y += c.vy; c.vy += 0.1; c.life -= 0.05;
                if (c.life <= 0) { CHIPS.splice(i, 1); continue; }
                ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.angle + c.life * 5);
                ctx.globalAlpha = c.life; ctx.fillStyle = c.color;
                ctx.beginPath(); ctx.arc(0, 0, c.size * c.life * 0.5, 0, Math.PI * 2); ctx.fill();
                ctx.restore(); ctx.globalAlpha = 1;
            }

            ctx.fillStyle = 'rgba(0,229,255,.5)'; ctx.font = "bold 10px monospace";
            ctx.fillText(`RPM: ${Math.floor(2800 + Math.sin(t) * 200)}`, 10, H - 28);
            ctx.fillText(`FEED: ${Math.floor(180 + Math.cos(t) * 30)} mm/min`, 10, H - 14);

            t += 0.025; raf = requestAnimationFrame(draw);
        }
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ─────────────────────────────────────────────
   3 · Welding Canvas
───────────────────────────────────────────── */
function WeldCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let W = 0, H = 0, t = 0;
        const SPARKS: WeldSpark[] = [];
        let raf: number;

        function init() { resizeCanvas(canvas!); W = canvas!.width; H = canvas!.height; }
        init(); window.addEventListener('resize', init);

        function spawnSpark(x: number, y: number) {
            for (let i = 0; i < 6; i++) {
                const a = Math.random() * Math.PI * 2, spd = 2 + Math.random() * 5;
                SPARKS.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 3, life: 1, size: 1.5, tail: [], color: `hsl(${Math.random() > 0.5 ? 40 : 200},100%,70%)` });
            }
        }

        function draw() {
            ctx.fillStyle = 'rgba(8,14,20,.35)'; ctx.fillRect(0, 0, W, H);
            const wx = W * 0.2 + Math.sin(t * 0.7) * W * 0.25, wy = H * 0.55;

            ctx.fillStyle = '#1a2a38'; ctx.fillRect(20, H * 0.4, W * 0.42, H * 0.25); ctx.fillRect(W * 0.46, H * 0.4, W * 0.45, H * 0.25);

            // Weld bead
            const drawn = Math.min(200, Math.floor((t / 40) * 1000) % 200);
            ctx.beginPath();
            for (let i = 0; i < drawn; i++) {
                const bx = 20 + (W - 40) * (i / 200);
                const by = H * 0.4 + Math.sin(bx * 0.2 + t) * 2;
                i === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by);
            }
            ctx.strokeStyle = 'rgba(255,120,30,.8)'; ctx.lineWidth = 5; ctx.shadowColor = 'rgba(255,80,0,.6)'; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;

            // Torch
            ctx.save(); ctx.translate(wx, wy); ctx.rotate(Math.PI * 0.15);
            ctx.fillStyle = '#1e3040'; ctx.strokeStyle = '#3a5060'; ctx.lineWidth = 1.5;
            ctx.beginPath(); (ctx as any).roundRect?.(-6, -50, 12, 50, 3) ?? ctx.rect(-6, -50, 12, 50); ctx.fill(); ctx.stroke();
            const tg = ctx.createRadialGradient(0, 6, 0, 0, 6, 14);
            tg.addColorStop(0, 'rgba(150,220,255,.95)'); tg.addColorStop(1, 'transparent');
            ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(0, 6, 14, 0, Math.PI * 2); ctx.fill();
            const flash = ctx.createRadialGradient(0, 6, 0, 0, 6, 24);
            flash.addColorStop(0, `rgba(180,240,255,${0.4 + Math.sin(t * 20) * 0.3})`); flash.addColorStop(1, 'transparent');
            ctx.fillStyle = flash; ctx.beginPath(); ctx.arc(0, 6, 24, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            if (Math.random() < 0.6) spawnSpark(wx, wy + 10);

            for (let i = SPARKS.length - 1; i >= 0; i--) {
                const s = SPARKS[i];
                s.tail.push({ x: s.x, y: s.y }); if (s.tail.length > 6) s.tail.shift();
                s.x += s.vx; s.y += s.vy; s.vy += 0.2; s.vx *= 0.95; s.life -= 0.06;
                if (s.life <= 0) { SPARKS.splice(i, 1); continue; }
                for (let j = 0; j < s.tail.length - 1; j++) {
                    ctx.globalAlpha = (j / s.tail.length) * s.life * 0.8;
                    ctx.strokeStyle = s.color; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(s.tail[j].x, s.tail[j].y); ctx.lineTo(s.tail[j + 1].x, s.tail[j + 1].y); ctx.stroke();
                }
                ctx.globalAlpha = s.life; ctx.fillStyle = s.color; ctx.shadowColor = s.color; ctx.shadowBlur = 4;
                ctx.beginPath(); ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1; ctx.shadowBlur = 0;
            }

            ctx.fillStyle = 'rgba(100,160,255,.5)'; ctx.font = 'bold 10px monospace';
            ctx.fillText(`AMP: ${Math.floor(140 + Math.sin(t) * 15)}A`, 10, H - 28);
            ctx.fillText('WIRE: ER70S-6 · 1.2mm', 10, H - 14);

            t += 0.02; raf = requestAnimationFrame(draw);
        }
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ─────────────────────────────────────────────
   4 · Sheet Metal Canvas
───────────────────────────────────────────── */
function SheetCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let W = 0, H = 0, t = 0; let raf: number;

        function init() { resizeCanvas(canvas!); W = canvas!.width; H = canvas!.height; }
        init(); window.addEventListener('resize', init);

        function draw() {
            ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0a1420'; ctx.fillRect(0, 0, W, H);
            const cx = W / 2, cy = H * 0.55, sw = W * 0.55, st = 8;
            const bendDeg = Math.floor(45 + Math.sin(t * 0.4) * 45);
            const angle = (bendDeg * Math.PI) / 180 * 0.5;
            const lw = (sw / 2) * Math.cos(angle);
            const bendAngle = -angle * 0.6 + Math.PI * 0.12;
            const rw = sw / 2;
            const rx = Math.cos(bendAngle) * rw, ry = Math.sin(bendAngle) * rw;

            const shg = ctx.createLinearGradient(cx - sw / 2, cy, cx + sw / 2, cy);
            shg.addColorStop(0, '#8a9aaa'); shg.addColorStop(0.48, '#c0ccd4'); shg.addColorStop(0.52, '#a0b0bc'); shg.addColorStop(1, '#7a8a98');
            ctx.fillStyle = shg;

            ctx.beginPath(); ctx.moveTo(cx - lw, cy - st / 2); ctx.lineTo(cx, cy - st / 2); ctx.lineTo(cx, cy + st / 2); ctx.lineTo(cx - lw, cy + st / 2); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(cx, cy - st / 2); ctx.lineTo(cx + rx, cy - ry - st / 2); ctx.lineTo(cx + rx, cy - ry + st / 2); ctx.lineTo(cx, cy + st / 2); ctx.closePath(); ctx.fill();

            const bl = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
            bl.addColorStop(0, 'rgba(255,180,50,.7)'); bl.addColorStop(1, 'transparent');
            ctx.fillStyle = bl; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill();

            const punchY = cy - 30 - Math.abs(Math.sin(t * 0.4)) * 50;
            ctx.fillStyle = '#253545'; ctx.beginPath(); (ctx as any).roundRect?.(cx - 30, punchY - 20, 60, 20, 3) ?? ctx.rect(cx - 30, punchY - 20, 60, 20); ctx.fill();
            ctx.fillStyle = '#3a5060'; ctx.beginPath(); (ctx as any).roundRect?.(cx - 4, punchY - 3, 8, 14, 2) ?? ctx.rect(cx - 4, punchY - 3, 8, 14); ctx.fill();
            ctx.fillStyle = '#1e2e3e'; ctx.beginPath(); (ctx as any).roundRect?.(cx - 50, cy + st / 2 + 2, 100, 18, 3) ?? ctx.rect(cx - 50, cy + st / 2 + 2, 100, 18); ctx.fill();

            ctx.fillStyle = 'rgba(0,229,255,.5)'; ctx.font = 'bold 10px monospace';
            ctx.fillText(`BEND: ${bendDeg}°`, 10, H - 28);
            ctx.fillText(`FORCE: ${Math.floor(80 + Math.sin(t * 0.4) * 60)} kN`, 10, H - 14);

            t += 0.02; raf = requestAnimationFrame(draw);
        }
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ─────────────────────────────────────────────
   5 · Prototype Canvas
───────────────────────────────────────────── */
function ProtoCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let W = 0, H = 0, t = 0; let raf: number;

        function init() { resizeCanvas(canvas!); W = canvas!.width; H = canvas!.height; }
        init(); window.addEventListener('resize', init);

        function draw() {
            ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0a1420'; ctx.fillRect(0, 0, W, H);
            const cx = W / 2, cy = H / 2;
            const s = Math.min(W, H) * 0.3;
            const progress = Math.sin(t * 0.3) * 0.5 + 0.5;

            const pts3D = [{ x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }, { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 }];
            const angle = t * 0.4;
            const proj = pts3D.map(p => {
                const rx = p.y * Math.cos(0.4) - p.z * Math.sin(0.4);
                const ry = p.y * Math.sin(0.4) + p.z * Math.cos(0.4);
                const rx2 = p.x * Math.cos(angle) + rx * Math.sin(angle);
                return { x: cx + rx2 * s, y: cy + ry * s };
            });

            const faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [0, 3, 7, 4]];
            const filled = Math.floor(progress * faces.length);

            ctx.strokeStyle = 'rgba(0,229,255,.25)'; ctx.lineWidth = 0.8;
            faces.forEach(f => { ctx.beginPath(); f.forEach((v, i) => { i === 0 ? ctx.moveTo(proj[v].x, proj[v].y) : ctx.lineTo(proj[v].x, proj[v].y); }); ctx.closePath(); ctx.stroke(); });

            for (let i = 0; i < filled; i++) {
                const f = faces[i];
                const grad = ctx.createLinearGradient(proj[f[0]].x, proj[f[0]].y, proj[f[2]].x, proj[f[2]].y);
                grad.addColorStop(0, 'rgba(50,80,100,.7)'); grad.addColorStop(1, 'rgba(20,40,60,.7)');
                ctx.fillStyle = grad; ctx.beginPath(); f.forEach((v, j) => { j === 0 ? ctx.moveTo(proj[v].x, proj[v].y) : ctx.lineTo(proj[v].x, proj[v].y); }); ctx.closePath(); ctx.fill();
            }
            proj.forEach(p => { ctx.fillStyle = 'rgba(0,229,255,.7)'; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); });

            const bw = W * 0.6, bh = 6, bx = (W - bw) / 2, by = H * 0.88;
            ctx.fillStyle = 'rgba(0,229,255,.1)'; ctx.strokeStyle = 'rgba(0,229,255,.2)'; ctx.lineWidth = 1;
            ctx.beginPath(); (ctx as any).roundRect?.(bx, by, bw, bh, 3) ?? ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
            const fill = bw * progress;
            const fg = ctx.createLinearGradient(bx, 0, bx + fill, 0);
            fg.addColorStop(0, '#00e5ff'); fg.addColorStop(1, '#ff6a00');
            ctx.fillStyle = fg; ctx.beginPath(); (ctx as any).roundRect?.(bx, by, fill, bh, 3) ?? ctx.rect(bx, by, fill, bh); ctx.fill();

            ctx.fillStyle = 'rgba(0,229,255,.6)'; ctx.font = '10px monospace'; ctx.fillText(`BUILD: ${Math.floor(progress * 100)}%`, bx, by - 5);
            ctx.fillStyle = 'rgba(0,229,255,.5)'; ctx.font = 'bold 10px monospace';
            ctx.fillText(`ITER: #${Math.floor(t * 0.3) % 8 + 1}`, 10, H - 28);
            ctx.fillText('24-HR TURNAROUND', 10, H - 14);

            t += 0.02; raf = requestAnimationFrame(draw);
        }
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ─────────────────────────────────────────────
   6 · Batch Production Canvas
───────────────────────────────────────────── */
function BatchCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let W = 0, H = 0, t = 0;
        type Part = { x: number; y: number; done: boolean; angle: number; size: number; type: number };
        let PARTS: Part[] = [], nextPart = 0;
        let raf: number;

        function init() {
            resizeCanvas(canvas!); W = canvas!.width; H = canvas!.height;
            PARTS = []; nextPart = 0;
            for (let i = 0; i < 12; i++) PARTS.push({ x: W * 0.1 + Math.random() * W * 0.8, y: H * 0.1 + Math.random() * H * 0.6, done: i < 3, angle: Math.random() * Math.PI * 2, size: 18 + Math.random() * 12, type: Math.floor(Math.random() * 3) });
        }
        init(); window.addEventListener('resize', init);

        function drawPart(p: Part, done: boolean) {
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
            const s = p.size;
            ctx.beginPath();
            if (p.type === 0) { for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s); } }
            else if (p.type === 1) { for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; const r = s * (i % 2 === 0 ? 1 : 0.75); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } }
            else { (ctx as any).roundRect?.(-s, -s * 0.7, s * 2, s * 1.4, 3) ?? ctx.rect(-s, -s * 0.7, s * 2, s * 1.4); }
            ctx.closePath();
            ctx.fillStyle = done ? 'rgba(50,80,100,.7)' : 'rgba(20,35,50,.6)'; ctx.fill();
            ctx.strokeStyle = done ? 'rgba(0,229,255,.5)' : 'rgba(100,150,170,.2)'; ctx.lineWidth = done ? 1.5 : 1; ctx.stroke();
            if (done) { ctx.strokeStyle = 'rgba(80,220,120,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-s * 0.3, 0); ctx.lineTo(-s * 0.05, s * 0.25); ctx.lineTo(s * 0.3, -s * 0.2); ctx.stroke(); }
            ctx.restore();
        }

        function draw() {
            ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0a1420'; ctx.fillRect(0, 0, W, H);

            ctx.fillStyle = '#1a2530'; (ctx as any).roundRect ? (ctx.beginPath(), (ctx as any).roundRect(0, H * 0.78, W, H * 0.15, 4), ctx.fill()) : ctx.fillRect(0, H * 0.78, W, H * 0.15);
            ctx.fillStyle = '#253545';
            for (let x = ((-t * 30) % 40 + 40) % 40; x < W; x += 40) { ctx.beginPath(); (ctx as any).roundRect?.(x, H * 0.78, 36, H * 0.15, 3) ?? ctx.rect(x, H * 0.78, 36, H * 0.15); ctx.fill(); }

            for (let i = 0; i < 5; i++) { const bx = ((W * 0.8 / 4) * i - t * 25 + W * 2) % W; drawPart({ x: W * 0.05 + bx, y: H * 0.85, done: i < nextPart, angle: 0, size: 14, type: i % 3 }, i < nextPart); }
            PARTS.forEach(p => drawPart(p, p.done));

            const done = PARTS.filter(p => p.done).length;
            const pct = done / PARTS.length;
            ctx.fillStyle = 'rgba(0,10,20,.7)'; ctx.strokeStyle = 'rgba(0,229,255,.15)'; ctx.lineWidth = 1;
            ctx.beginPath(); (ctx as any).roundRect?.(8, 8, 110, 55, 6) ?? ctx.rect(8, 8, 110, 55); ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(0,229,255,.7)'; ctx.font = 'bold 11px monospace'; ctx.fillText(`BATCH: LT-${Math.floor(t * 0.5) % 50 + 100}`, 14, 24);
            ctx.fillStyle = 'rgba(0,229,255,.4)'; ctx.font = '10px monospace'; ctx.fillText(`${done}/${PARTS.length} INSPECTED`, 14, 40);
            ctx.fillStyle = 'rgba(0,229,255,.1)'; ctx.beginPath(); (ctx as any).roundRect?.(14, 46, 90, 5, 3) ?? ctx.rect(14, 46, 90, 5); ctx.fill();
            const fg2 = ctx.createLinearGradient(14, 0, 14 + 90 * pct, 0); fg2.addColorStop(0, '#00e5ff'); fg2.addColorStop(1, '#80ff00');
            ctx.fillStyle = fg2; ctx.beginPath(); (ctx as any).roundRect?.(14, 46, 90 * pct, 5, 3) ?? ctx.rect(14, 46, 90 * pct, 5); ctx.fill();

            if (t > nextPart * 4 + 2 && nextPart < PARTS.length) { PARTS[nextPart].done = true; nextPart++; }
            t += 0.02; raf = requestAnimationFrame(draw);
        }
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ─────────────────────────────────────────────
   Services Data
───────────────────────────────────────────── */
const SERVICES = [
    {
        num: '01', title: 'LASER CUTTING', sub: 'Sharp Edges & Complex Patterns',
        desc: 'Fiber laser cutting on stainless steel, mild steel, aluminium & copper — achieving hairline precision with zero burr and minimal heat-affected zones.',
        tags: ['SS304', 'AL6061', 'MS', 'COPPER', 'FIBER LASER'],
        stats: [{ val: '±0.1mm', lbl: 'TOLERANCE' }, { val: '3000W', lbl: 'LASER POWER' }, { val: '25mm', lbl: 'MAX THICKNESS' }],
        Canvas: LaserCanvas, label: 'LASER ▸ LIVE CUT',
    },
    {
        num: '02', title: 'CNC MACHINING', sub: 'High-Precision Multi-Axis Milling & Turning',
        desc: '3, 4 & 5-axis CNC milling and turning for complex geometries, threads, pockets and contoured surfaces on any engineering metal.',
        tags: ['3/4/5-AXIS', 'TURNING', 'MILLING', 'THREADING'],
        stats: [{ val: '±0.05', lbl: 'TOLERANCE mm' }, { val: '5-Axis', lbl: 'DOF' }, { val: 'Ra0.8', lbl: 'FINISH µm' }],
        Canvas: CNCCanvas, label: 'CNC ▸ 5-AXIS MILLING',
    },
    {
        num: '03', title: 'WELDING & FABRICATION', sub: 'Durable Assembly of Industrial Components',
        desc: 'TIG, MIG and spot welding combined with structural fabrication — delivering leak-tight, load-bearing assemblies for heavy industrial use.',
        tags: ['TIG', 'MIG', 'SPOT', 'STRUCTURAL', 'PIPE'],
        stats: [{ val: 'AWS', lbl: 'CERTIFIED' }, { val: '12mm', lbl: 'MAX WELD' }, { val: 'X-RAY', lbl: 'TESTED' }],
        Canvas: WeldCanvas, label: 'WELDING ▸ TIG/MIG ACTIVE',
    },
    {
        num: '04', title: 'SHEET METAL', sub: 'Expert Bending, Punching & Forming',
        desc: 'CNC press brakes, turret punching and roll forming for enclosures, brackets, frames and custom sheet metal assemblies from 0.5mm to 10mm.',
        tags: ['BENDING', 'PUNCHING', 'FORMING', 'STAMPING'],
        stats: [{ val: '±0.2', lbl: 'BEND TOL mm' }, { val: '160T', lbl: 'PRESS FORCE' }, { val: '3m', lbl: 'MAX LENGTH' }],
        Canvas: SheetCanvas, label: 'SHEET ▸ PRESS BRAKE ACTIVE',
    },
    {
        num: '05', title: 'PROTOTYPE MANUFACTURING', sub: 'Quick-Turn Prototypes to Validate Designs',
        desc: '24–72 hour rapid prototyping using laser cutting, CNC and sheet metal — so you can test fit, form and function before committing to full production.',
        tags: ['24HR TURNAROUND', 'DFM REVIEW', 'ITERATION', 'FIT-CHECK'],
        stats: [{ val: '24hr', lbl: 'MIN LEAD TIME' }, { val: '1 pc', lbl: 'MOQ' }, { val: 'FREE', lbl: 'DFM REVIEW' }],
        Canvas: ProtoCanvas, label: 'PROTO ▸ DESIGN VALIDATION',
    },
    {
        num: '06', title: 'SMALL BATCH PRODUCTION', sub: 'Cost-Effective Manufacturing for Limited Runs',
        desc: 'Optimised tooling and nesting strategies deliver competitive per-part pricing for runs of 10–1000 pieces — with full quality inspection on every batch.',
        tags: ['10–1000 PCS', 'NESTING', 'QUALITY CHECK', 'ON-TIME'],
        stats: [{ val: '10 pcs', lbl: 'MIN BATCH' }, { val: '100%', lbl: 'INSPECTED' }, { val: '7-Day', lbl: 'DELIVERY' }],
        Canvas: BatchCanvas, label: 'BATCH ▸ PRODUCTION RUN',
    },
] as const;

/* ─────────────────────────────────────────────
   Main Export
───────────────────────────────────────────── */
export function ServicesSection() {
    return (
        <section id="services" className="py-20 relative overflow-hidden bg-[#020617]">
            {/* Background mesh */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 mb-4 inline-flex items-center gap-3">
                        <span className="w-8 h-px bg-cyan-500/30"></span>
                        OUR CAPABILITIES
                        <span className="w-8 h-px bg-cyan-500/30"></span>
                    </p>
                    <h2 className="font-bankgothic text-4xl sm:text-5xl md:text-[56px] leading-[1.1] tracking-tight text-white mb-6 drop-shadow-sm">
                        Precision Manufacturing Services
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto font-light text-sm md:text-base">
                        Our network of MechMasters covers a wide range of industrial processes to meet your specific requirements.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {SERVICES.map((svc) => {
                        const { Canvas } = svc;
                        return (
                            <div
                                key={svc.num}
                                className="group rounded-2xl border border-white/[0.05] bg-[#040f25]/50 backdrop-blur-md overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] transition-all duration-500 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                                {/* Animated Canvas Panel */}
                                <div className="relative h-48 bg-[#020617] overflow-hidden border-b border-white/[0.05]">
                                    <Canvas />
                                    {/* Scan line */}
                                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,229,255,0.015) 3px, rgba(0,229,255,0.015) 4px)' }} />
                                    {/* Label */}
                                    <div className="absolute bottom-2 right-3 text-[9px] font-bold tracking-widest text-cyan-400/60 font-mono">{svc.label}</div>
                                    {/* Top corner grid dots */}
                                    <div className="absolute top-2 left-2 w-4 h-4 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,229,255,0.8) 1px, transparent 1px)', backgroundSize: '5px 5px' }} />
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 font-consolas mb-1 flex items-center gap-2">
                                            <span className="text-zinc-500">[{svc.num}]</span> {svc.title}
                                        </p>
                                        <h3 className="font-bankgothic text-base font-bold text-white leading-snug group-hover:text-cyan-50 transition-colors">{svc.sub}</h3>
                                    </div>

                                    <p className="text-xs text-zinc-400 leading-relaxed">{svc.desc}</p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {svc.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-cyan-500/20 text-cyan-400/70 bg-cyan-500/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-4 pt-2 border-t border-white/[0.06]">
                                        {svc.stats.map(stat => (
                                            <div key={stat.lbl} className="flex-1">
                                                <div className="text-sm font-bold text-white font-mono">{stat.val}</div>
                                                <div className="text-[9px] uppercase tracking-wider text-zinc-500 mt-0.5">{stat.lbl}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

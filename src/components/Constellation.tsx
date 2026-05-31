import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number };

// A soft, warm ambient "constellation" field that drifts behind the hero.
// Tuned to read as gentle fireside texture rather than a cold techy grid:
// warm accent color, low opacity, calm motion. Stays lightweight — caps DPR,
// pauses off-screen and while the tab is hidden, and renders a single static
// frame when the user prefers reduced motion.
export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let onScreen = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    // Warm accent (terracotta) so the field blends into the cozy palette
    // instead of reading as a cold neural net.
    const accent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim() || "#c25d33";

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fewer nodes on phones — the node-pair loop is O(n²), so keep it light.
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const density = Math.min(
        Math.floor((width * height) / (isMobile ? 30000 : 18000)),
        isMobile ? 26 : 76
      );
      nodes = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
      }));
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const color = accent();
      const maxDist = 122;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // gentle attraction to the cursor
        const dxm = mouse.x - n.x;
        const dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 150 && dm > 0) {
          n.x += (dxm / dm) * 0.2;
          n.y += (dym / dm) * 0.2;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDist) {
            ctx.globalAlpha = (1 - dist / maxDist) * 0.1;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const running = () => onScreen && !document.hidden;

    const loop = () => {
      if (running()) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    if (reduced) {
      draw();
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

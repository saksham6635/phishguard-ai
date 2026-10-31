/**
 * ambientBackground.js — High-tech cybersecurity & voice AI background canvas
 * Designed specifically for PhishGuard AI's modern light neomorphic aesthetic.
 * Features:
 *  - Floating neural/threat telemetry nodes with distance-based connection mesh
 *  - Harmonic audio carrier waves sweeping gently across the lower horizon
 *  - Periodic subtle sonar / radar threat pulse rings
 *  - High-DPI crisp rendering & automatic battery-efficient pause when hidden
 */
(() => {
  "use strict";

  const canvas = document.getElementById("ambient-dots-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animId = 0;
  let lastTime = 0;
  let elapsed = 0;

  // Nodes for the threat telemetry constellation
  const NODE_COUNT_BASE = 38;
  let nodes = [];
  let sonarPulses = [];
  let nextSonarTime = 2.0;

  class Node {
    constructor(w, h) {
      this.reset(w, h);
    }
    reset(w, h) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.32;
      this.baseRadius = 1.2 + Math.random() * 1.8;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.isThreatAnchor = Math.random() < 0.18;
      this.color = this.isThreatAnchor
        ? "rgba(42, 124, 111, 0.55)" // Teal/emerald security anchor
        : "rgba(59, 109, 140, 0.38)"; // Slate/cyan telemetry node
    }
    update(w, h, dt) {
      this.x += this.vx * dt * 60;
      this.y += this.vy * dt * 60;
      this.pulsePhase += dt * 1.5;

      if (this.x < -20) this.x = w + 20;
      if (this.x > w + 20) this.x = -20;
      if (this.y < -20) this.y = h + 20;
      if (this.y > h + 20) this.y = -20;
    }
    draw(context) {
      const radius = this.baseRadius + Math.sin(this.pulsePhase) * 0.4;
      context.beginPath();
      context.arc(this.x, this.y, Math.max(0.5, radius), 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.fill();

      if (this.isThreatAnchor) {
        // Subtle outer glow ring
        context.beginPath();
        context.arc(this.x, this.y, radius * 2.4, 0, Math.PI * 2);
        context.strokeStyle = "rgba(42, 124, 111, 0.12)";
        context.lineWidth = 1;
        context.stroke();
      }
    }
  }

  class SonarPulse {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = 130 + Math.random() * 70;
      this.life = 1.0;
      this.speed = 45;
    }
    update(dt) {
      this.radius += this.speed * dt;
      this.life = Math.max(0, 1 - this.radius / this.maxRadius);
      return this.life > 0;
    }
    draw(context) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(42, 124, 111, ${(this.life * 0.16).toFixed(3)})`;
      context.lineWidth = 1.2;
      context.stroke();
    }
  }

  function resize() {
    const nextW = window.innerWidth;
    const nextH = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (nextW === width && nextH === height) return;
    width = nextW;
    height = nextH;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(65, Math.max(24, Math.floor((width * height) / 28000)));
    nodes = Array.from({ length: count }, () => new Node(width, height));
    sonarPulses = [];
  }

  function drawCarrierWaves(time) {
    // 2 subtle harmonic voice audio waves rolling across the background
    const waveCount = 2;
    const baseY = height * 0.78;

    for (let w = 0; w < waveCount; w++) {
      const speed = 0.45 + w * 0.28;
      const freq = 0.0035 + w * 0.002;
      const amp = 14 + w * 10;
      const color = w === 0 ? "rgba(42, 124, 111, 0.06)" : "rgba(59, 109, 140, 0.045)";

      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 12) {
        const y = baseY + Math.sin(x * freq + time * speed) * amp + Math.cos(x * freq * 0.5 + time * 0.3) * (amp * 0.4);
        if (x === 0) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Wave outline
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const y = baseY + Math.sin(x * freq + time * speed) * amp + Math.cos(x * freq * 0.5 + time * 0.3) * (amp * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = w === 0 ? "rgba(42, 124, 111, 0.12)" : "rgba(59, 109, 140, 0.09)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawConnections() {
    const maxDist = 110;
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < len; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59, 109, 140, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function render(time) {
    ctx.clearRect(0, 0, width, height);

    // 1. Voice audio carrier waves in the backdrop
    drawCarrierWaves(elapsed);

    // 2. Interconnecting lines between telemetry nodes
    drawConnections();

    // 3. Sonar / radar pulses
    for (let i = sonarPulses.length - 1; i >= 0; i--) {
      const p = sonarPulses[i];
      if (p.update(0.016)) {
        p.draw(ctx);
      } else {
        sonarPulses.splice(i, 1);
      }
    }

    // 4. Telemetry nodes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update(width, height, 0.016);
      nodes[i].draw(ctx);
    }
  }

  function tick(timestamp) {
    if (document.hidden || reducedMotion.matches) {
      animId = 0;
      return;
    }

    if (lastTime) {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.06);
      elapsed += dt;

      // Spawn periodic sonar pulse from anchor node
      if (elapsed >= nextSonarTime && nodes.length > 0) {
        const anchors = nodes.filter((n) => n.isThreatAnchor);
        const source = anchors.length > 0 ? anchors[Math.floor(Math.random() * anchors.length)] : nodes[0];
        if (source) {
          sonarPulses.push(new SonarPulse(source.x, source.y));
        }
        nextSonarTime = elapsed + 3.2 + Math.random() * 2.5;
      }
    }
    lastTime = timestamp;

    render(elapsed);
    animId = window.requestAnimationFrame(tick);
  }

  function start() {
    if (reducedMotion.matches || document.hidden) {
      if (animId) window.cancelAnimationFrame(animId);
      animId = 0;
      lastTime = 0;
      render(0);
      return;
    }
    if (!animId) {
      lastTime = 0;
      animId = window.requestAnimationFrame(tick);
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", start);
  reducedMotion.addEventListener("change", start);

  resize();
  start();
})();

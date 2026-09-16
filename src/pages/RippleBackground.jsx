import { useEffect, useRef } from 'react';

const LiquidBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Track the previous position to draw lines between frames (prevents gaps on fast movement)
  const lastPos = useRef({ x: null, y: null });

  const settings = {
    // Per-frame decay. The relationship to trail length isn't linear — the
    // wave also disperses spatially — so this was solved by simulation, not
    // arithmetic: 0.96 ran ~84 frames (~1.4s), 0.88 runs ~43 (~0.7s).
    damping: 0.88,
    strength: 1000, // Impact strength
  };

  // The canvas is transparent except where the wave is, so this is the colour
  // of the ripple itself. Reading it off --primary keeps the effect on-theme
  // without the component knowing which theme is on.
  const readAccent = () => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim();
    const [h, sPct, lPct] = raw.split(/\s+/).map((v) => parseFloat(v));
    if ([h, sPct, lPct].some(Number.isNaN)) return [219, 10, 10];

    const sat = sPct / 100;
    const lum = lPct / 100;
    const c = (1 - Math.abs(2 * lum - 1)) * sat;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lum - c / 2;
    const [r, g, b] =
      h < 60 ? [c, x, 0] :
      h < 120 ? [x, c, 0] :
      h < 180 ? [0, c, x] :
      h < 240 ? [0, x, c] :
      h < 300 ? [x, 0, c] : [c, 0, x];
    return [r, g, b].map((v) => Math.round((v + m) * 255));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let accent = readAccent();
    // Repaint in the new accent when the theme flips.
    const themeObserver = new MutationObserver(() => { accent = readAccent(); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    let width, height;
    let buffer1 = [];
    let buffer2 = [];
    
    const scaleFactor = 0.5; // Resolution scaling

    const resize = () => {
      width = Math.ceil(window.innerWidth * scaleFactor);
      height = Math.ceil(window.innerHeight * scaleFactor);
      canvas.width = width;
      canvas.height = height;
      const size = width * height;
      buffer1 = new Int16Array(size);
      buffer2 = new Int16Array(size);
    };

    // Determine index in buffer and apply strength
    const drawRipple = (cx, cy) => {
      // Ensure we only draw inside the canvas bounds
      if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
          // Directly modify the buffer immediately
          buffer1[cx + cy * width] = settings.strength;
      }
    };

    // REAL-TIME HANDLING
    const processInput = (clientX, clientY) => {
      const x = Math.floor(clientX * scaleFactor);
      const y = Math.floor(clientY * scaleFactor);

      // If we have a previous position, interpolate a line to prevent gaps
      if (lastPos.current.x !== null) {
        const dx = x - lastPos.current.x;
        const dy = y - lastPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(distance);

        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const lerpX = Math.floor(lastPos.current.x + dx * t);
          const lerpY = Math.floor(lastPos.current.y + dy * t);
          drawRipple(lerpX, lerpY);
        }
      }

      // Draw at current position
      drawRipple(x, y);
      
      // Update last position
      lastPos.current = { x, y };
    };

    const handleMouseMove = (e) => processInput(e.clientX, e.clientY);
    
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      processInput(touch.clientX, touch.clientY);
    };

    const loop = () => {
      // Skip rendering when off-screen to save CPU
      if (!isVisibleRef.current) {
        animationRef.current = null;
        return;
      }

      // FLUID SIMULATION: Swap buffers
      const temp = buffer1;
      buffer1 = buffer2;
      buffer2 = temp;

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const damping = settings.damping;
      const w = width;
      const h = height;

      // 1. Physics Loop (Applies only to inner pixels, 1 to w-2, 1 to h-2)
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = x + y * w;
          
          // Averaging neighbor pixels to create wave propagation
          const heightVal = (
            (buffer2[i - 1] + buffer2[i + 1] + buffer2[i - w] + buffer2[i + w]) / 2
          ) - buffer1[i]; // buffer1 is the next state destination buffer

          buffer1[i] = heightVal * damping;
        }
      }

      // ** FIX HERE **: Explicitly clear the borders of the NEW STATE BUFFER (buffer1)
      // This eliminates the "stuck" red strokes on the edges.
      for (let x = 0; x < w; x++) {
          buffer1[x] = 0;           // Top border (y=0)
          buffer1[x + (h - 1) * w] = 0; // Bottom border (y=h-1)
      }
      for (let y = 1; y < h - 1; y++) {
          buffer1[y * w] = 0;       // Left border (x=0)
          buffer1[w - 1 + y * w] = 0; // Right border (x=w-1)
      }


      // 2. Rendering Loop (Process ALL pixels 0 to w-1, 0 to h-1)
      for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
              const i = x + y * w;
              const pixelIndex = i * 4;
              const waveHeight = buffer1[i]; // Use the fully updated buffer1

              const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
              // Crests brighten toward the accent's own hue rather than
              // blowing out to white.
              const lift = waveHeight > 0 ? waveHeight * 1.5 : 0;

              data[pixelIndex] = clamp(accent[0] + lift);
              data[pixelIndex + 1] = clamp(accent[1] + lift * 0.3);
              data[pixelIndex + 2] = clamp(accent[2] + lift * 0.3);

              // Alpha based on wave height
              const alpha = Math.min(210, Math.max(0, waveHeight * 9));
              data[pixelIndex + 3] = alpha; 
          }
      }

      ctx.putImageData(imgData, 0, 0);
      animationRef.current = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const handleMouseLeave = () => {
      lastPos.current = { x: null, y: null };
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    // Pause animation when canvas is not visible (saves CPU/battery)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animationRef.current) {
          loop();
        }
      },
      { threshold: 0 }
    );
    if (canvas) visibilityObserver.observe(canvas);

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: -1,
        filter: 'blur(2px)', 
        opacity: 0.9 
      }}
    />
  );
};

export default LiquidBackground;
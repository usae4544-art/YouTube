import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "motion/react";
import { Camera, Sparkles, LogIn, PlayCircle } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isFadingOutRef = useRef(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [inputText, setInputText] = useState("");
  const updateParticlesRef = useRef<((text: string) => void) | undefined>(undefined);

  const handleGetStarted = () => {
    if (isFadingOutRef.current) return;
    isFadingOutRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 650);
  };

  const handleCreate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (updateParticlesRef.current) {
      updateParticlesRef.current(inputText.trim());
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | undefined;
    let particles: THREE.Points | undefined;
    let geometry: THREE.BufferGeometry | undefined;
    let material: THREE.ShaderMaterial | undefined;
    let animationFrameId = 0;
    let textMorphTimer: ReturnType<typeof setTimeout> | undefined;

    try {
      const w = Math.max(container.clientWidth || window.innerWidth, 320);
      const h = Math.max(container.clientHeight || window.innerHeight, 320);
      const isCompact = w < 640;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
      camera.position.z = isCompact ? 165 : 120;

      renderer = new THREE.WebGLRenderer({
        antialias: !isCompact,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      const particleCount = isCompact ? 7500 : 14000;
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const targetPositions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const color1 = new THREE.Color(0xd946ef);
      const color2 = new THREE.Color(0x06b6d4);
      const color3 = new THREE.Color(0x8b5cf6);

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 35 + Math.random() * 1.5;

        const px = r * Math.sin(phi) * Math.cos(theta);
        const py = r * Math.sin(phi) * Math.sin(theta);
        const pz = r * Math.cos(phi);

        positions[i * 3] = px;
        positions[i * 3 + 1] = py;
        positions[i * 3 + 2] = pz;

        targetPositions[i * 3] = px;
        targetPositions[i * 3 + 1] = py;
        targetPositions[i * 3 + 2] = pz;

        const rand = Math.random();
        let mixedColor = color1.clone();
        if (rand > 0.66) {
          mixedColor.lerp(color2, (rand - 0.66) * 3);
        } else if (rand > 0.33) {
          mixedColor = color2.clone().lerp(color3, (rand - 0.33) * 3);
        } else {
          mixedColor = color3.clone().lerp(color1, rand * 3);
        }
        mixedColor.multiplyScalar(1.3);

        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("targetPos", new THREE.BufferAttribute(targetPositions, 3));

      material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          morphAmount: { value: 0 },
        },
        vertexShader: `
          uniform float time;
          uniform float morphAmount;
          attribute vec3 targetPos;
          attribute vec3 color;
          varying vec3 vColor;

          void main() {
            vColor = color;
            vec3 p = mix(position, targetPos, morphAmount);
            p.x += sin(time * 3.0 + p.y * 0.1) * 0.3;
            p.y += cos(time * 3.0 + p.x * 0.1) * 0.3;
            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (180.0 / max(-mvPosition.z, 1.0)) * (1.0 + morphAmount * 0.3);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float r = distance(gl_PointCoord, vec2(0.5));
            if (r > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, r);
            float core = smoothstep(0.2, 0.0, r) * 0.8;
            vec3 finalColor = vColor + vec3(core);
            gl_FragColor = vec4(finalColor, min(alpha * 1.5, 1.0));
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      let currentMorphAmount = 0;
      let isTextMode = false;

      updateParticlesRef.current = (text: string) => {
        if (!geometry) return;
        isTextMode = !!text;

        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const targetAttr = geometry.attributes.targetPos as THREE.BufferAttribute;

        for (let i = 0; i < particleCount; i++) {
          posAttr.array[i * 3] = THREE.MathUtils.lerp(
            posAttr.array[i * 3],
            targetAttr.array[i * 3],
            currentMorphAmount,
          );
          posAttr.array[i * 3 + 1] = THREE.MathUtils.lerp(
            posAttr.array[i * 3 + 1],
            targetAttr.array[i * 3 + 1],
            currentMorphAmount,
          );
          posAttr.array[i * 3 + 2] = THREE.MathUtils.lerp(
            posAttr.array[i * 3 + 2],
            targetAttr.array[i * 3 + 2],
            currentMorphAmount,
          );
        }
        posAttr.needsUpdate = true;

        if (!text) {
          for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 35 + Math.random() * 1.5;
            targetAttr.array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            targetAttr.array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            targetAttr.array[i * 3 + 2] = r * Math.cos(phi);
          }
        } else {
          const canvas2d = document.createElement("canvas");
          canvas2d.width = 1200;
          canvas2d.height = 300;
          const ctx = canvas2d.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
            ctx.font = "900 140px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, canvas2d.width / 2, canvas2d.height / 2);

            try {
              const imgData = ctx.getImageData(0, 0, canvas2d.width, canvas2d.height);
              const pixels = imgData.data;
              const textPos: Array<{ x: number; y: number; z: number }> = [];

              for (let y = 0; y < canvas2d.height; y += 3) {
                for (let x = 0; x < canvas2d.width; x += 3) {
                  const index = (y * canvas2d.width + x) * 4;
                  if (pixels[index] > 128) {
                    const px = (x - canvas2d.width / 2) * 0.22;
                    const py = -(y - canvas2d.height / 2) * 0.22;
                    const pz = (Math.random() - 0.5) * 3;
                    textPos.push({ x: px, y: py, z: pz });
                  }
                }
              }

              textPos.sort(() => Math.random() - 0.5);

              for (let i = 0; i < particleCount; i++) {
                if (i < textPos.length) {
                  targetAttr.array[i * 3] = textPos[i].x;
                  targetAttr.array[i * 3 + 1] = textPos[i].y;
                  targetAttr.array[i * 3 + 2] = textPos[i].z;
                } else {
                  targetAttr.array[i * 3] = (Math.random() - 0.5) * 80;
                  targetAttr.array[i * 3 + 1] = (Math.random() - 0.5) * 80;
                  targetAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 50 - 150;
                }
              }
            } catch (e) {
              console.warn(e);
            }
          }
        }
        targetAttr.needsUpdate = true;
        currentMorphAmount = 0;
      };

      const clock = new THREE.Clock();

      textMorphTimer = setTimeout(() => {
        if (updateParticlesRef.current && !isFadingOutRef.current) {
          updateParticlesRef.current("NEXUS");
        }
      }, 1200);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        material!.uniforms.time.value = elapsedTime;
        currentMorphAmount += (1 - currentMorphAmount) * 0.05;
        material!.uniforms.morphAmount.value = currentMorphAmount;

        if (isTextMode) {
          particles!.rotation.y = THREE.MathUtils.lerp(particles!.rotation.y, 0, 0.08);
          particles!.rotation.x = THREE.MathUtils.lerp(particles!.rotation.x, 0, 0.08);
        } else {
          particles!.rotation.y += 0.005;
          particles!.rotation.x += 0.002;
        }

        renderer!.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!renderer || !container) return;
        const nw = Math.max(container.clientWidth || window.innerWidth, 320);
        const nh = Math.max(container.clientHeight || window.innerHeight, 320);
        camera.aspect = nw / nh;
        camera.position.z = nw < 640 ? 165 : 120;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        if (textMorphTimer) clearTimeout(textMorphTimer);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer?.dispose();
        geometry?.dispose();
        material?.dispose();
      };
    } catch (err) {
      console.warn("THREE JS Intro Animation fallback active:", err);
      setWebglFailed(true);
      return () => {
        if (textMorphTimer) clearTimeout(textMorphTimer);
      };
    }
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050508] overflow-hidden flex flex-col items-center justify-between safe-area-pad"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1, scale: isFadingOut ? 1.03 : 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Fallback / Ambient Animated Aurora */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.18, 1], rotate: [0, 12, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="w-72 h-72 rounded-full bg-gradient-to-tr from-fuchsia-600/20 via-indigo-600/20 to-cyan-500/20 blur-3xl"
        />
        {webglFailed && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute flex flex-col items-center gap-3"
          >
            <PlayCircle className="w-20 h-20 text-rose-500 drop-shadow-[0_0_24px_rgba(244,63,94,0.6)]" />
            <span className="text-4xl font-display font-black tracking-wider bg-gradient-to-r from-fuchsia-400 via-white to-cyan-400 bg-clip-text text-transparent">
              NEXUS
            </span>
          </motion.div>
        )}
      </div>

      {/* Top Creator Badge */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 pt-10"
      >
        <a
          href="https://www.instagram.com/shivansh10120?igsh=Ymt6MWF3Y3J0Mm1x"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/10 active:scale-95 cursor-pointer"
        >
          <Camera className="w-4 h-4 text-pink-500" />
          <span className="text-white font-medium text-sm tracking-wide">shivansh</span>
        </a>
      </motion.div>

      {/* Bottom Animation UI & Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="relative z-10 w-full max-w-lg px-4 pb-8 space-y-4"
      >
        <form
          onSubmit={handleCreate}
          className="bg-[#1a1a24]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center gap-2 shadow-2xl"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type name for 3D morph..."
            className="flex-1 bg-transparent text-white px-4 py-3 outline-none placeholder:text-white/30 text-base sm:text-lg font-medium min-w-0"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Create
          </button>
        </form>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGetStarted}
          className="w-full bg-gradient-to-r from-red-600/90 via-rose-600/90 to-indigo-600/90 hover:opacity-95 backdrop-blur-md border border-white/20 text-white py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-[0_0_25px_rgba(239,68,68,0.25)]"
        >
          <LogIn className="w-5 h-5" />
          Continue to App
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

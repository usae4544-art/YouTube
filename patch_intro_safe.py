import sys

with open("src/components/IntroAnimation.tsx", "r") as f:
    content = f.read()

# Fix context creation
content = content.replace("const ctx = canvas2d.getContext('2d');", "const ctx = canvas2d.getContext('2d', { willReadFrequently: true });")

# Fix getImageData and WebGL errors by wrapping in try/catch
new_effect = """
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let geometry: THREE.BufferGeometry;
    let material: THREE.ShaderMaterial;
    let animationFrameId: number;

    try {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
      camera.position.z = 150;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      const canvas2d = document.createElement('canvas');
      canvas2d.width = 1024;
      canvas2d.height = 256;
      const ctx = canvas2d.getContext('2d', { willReadFrequently: true });
      
      let textPositions: THREE.Vector3[] = [];
      
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
        
        ctx.font = 'bold 120px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('NEXUS VIDEO', canvas2d.width / 2, canvas2d.height / 2);

        try {
          const imgData = ctx.getImageData(0, 0, canvas2d.width, canvas2d.height);
          const pixels = imgData.data;

          for (let y = 0; y < canvas2d.height; y += 3) {
            for (let x = 0; x < canvas2d.width; x += 3) {
              const index = (y * canvas2d.width + x) * 4;
              if (pixels[index] > 128) {
                const px = (x - canvas2d.width / 2) * 0.28;
                const py = -(y - canvas2d.height / 2) * 0.28;
                const pz = (Math.random() - 0.5) * 8;
                textPositions.push(new THREE.Vector3(px, py, pz));
              }
            }
          }
        } catch (e) {
          console.warn("Canvas getImageData failed:", e);
        }
      }

      const particleCount = Math.max(textPositions.length, 6000);
      
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const targetPositions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      const colorPurple = new THREE.Color(0xa855f7); // Neon purple
      const colorCyan = new THREE.Color(0x06b6d4); // Neon cyan
      
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 35 + Math.random() * 15;
        
        const startX = r * Math.sin(phi) * Math.cos(theta);
        const startY = r * Math.sin(phi) * Math.sin(theta);
        const startZ = r * Math.cos(phi);
        
        positions[i*3] = startX;
        positions[i*3+1] = startY;
        positions[i*3+2] = startZ;
        
        let target;
        if (i < textPositions.length) {
          target = textPositions[i];
        } else {
          target = new THREE.Vector3(
             (Math.random() - 0.5) * 300,
             (Math.random() - 0.5) * 200,
             (Math.random() - 0.5) * 200 - 80
          );
        }
        
        targetPositions[i*3] = target.x;
        targetPositions[i*3+1] = target.y;
        targetPositions[i*3+2] = target.z;
        
        const mixedColor = colorPurple.clone().lerp(colorCyan, Math.random());
        colors[i*3] = mixedColor.r;
        colors[i*3+1] = mixedColor.g;
        colors[i*3+2] = mixedColor.b;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('targetPos', new THREE.BufferAttribute(targetPositions, 3));
      
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
            p.x += sin(time * 2.0 + p.y * 0.1) * (1.0 - morphAmount) * 1.5;
            p.y += cos(time * 2.0 + p.x * 0.1) * (1.0 - morphAmount) * 1.5;
            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (120.0 / -mvPosition.z) * (1.0 + morphAmount * 0.5);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float r = distance(gl_PointCoord, vec2(0.5));
            if (r > 0.5) discard;
            float alpha = smoothstep(0.5, 0.1, r);
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
      
      const clock = new THREE.Clock();
      let isMorphing = false;
      let morphValue = 0;
      
      setTimeout(() => {
         isMorphing = true;
      }, 2000);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        material.uniforms.time.value = elapsedTime;
        
        if (isMorphing) {
          morphValue += (1 - morphValue) * 0.03;
          material.uniforms.morphAmount.value = morphValue;
          particles.rotation.y = THREE.MathUtils.lerp(particles.rotation.y, 0, 0.03);
          particles.rotation.x = THREE.MathUtils.lerp(particles.rotation.x, 0, 0.03);
        } else {
          particles.rotation.y = elapsedTime * 0.4;
          particles.rotation.x = elapsedTime * 0.2;
        }
        
        renderer.render(scene, camera);
      };
      
      animate();
      
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (mountRef.current && renderer && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
        if (geometry) geometry.dispose();
        if (material) material.dispose();
      };
    } catch (err) {
      console.warn("THREE JS Intro Animation failed:", err);
      // Fallback
      return () => {};
    }
"""

start_idx = content.find("const w = window.innerWidth;")
end_idx = content.find("  }, []);")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_effect + "\n" + content[end_idx:]
    with open("src/components/IntroAnimation.tsx", "w") as f:
        f.write(content)
else:
    print("Could not find replacement indices")


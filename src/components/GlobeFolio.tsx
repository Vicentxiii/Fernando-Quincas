import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, Move } from 'lucide-react';

interface GlobeFolioProps {
  images: string[];
  cardCount?: number;
  radius?: number;
}

interface CameraTween {
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  progress: number;
  duration: number;
  mode: 'select' | 'reset';
}

const HOVER_SCALE = 1.18;
const SELECTED_SCALE = 1.3;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function createCardTexture(source: HTMLImageElement): THREE.CanvasTexture {
  const w = 160;
  const h = 200;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const radius = 14;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(w - radius, 0);
  ctx.arcTo(w, 0, w, radius, radius);
  ctx.lineTo(w, h - radius);
  ctx.arcTo(w, h, w - radius, h, radius);
  ctx.lineTo(radius, h);
  ctx.arcTo(0, h, 0, h - radius, radius);
  ctx.lineTo(0, radius);
  ctx.arcTo(0, 0, radius, 0, radius);
  ctx.closePath();
  ctx.clip();

  const scale = Math.max(w / source.width, h / source.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (source.width - sw) / 2;
  const sy = (source.height - sh) / 2;
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, w, h);

  ctx.strokeStyle = 'rgba(224, 201, 149, 0.5)';
  ctx.lineWidth = 3;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export const GlobeFolio: React.FC<GlobeFolioProps> = ({
  images,
  cardCount = 180,
  radius = 11,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      const id = requestAnimationFrame(() => setShowOverlay(true));
      return () => {
        cancelAnimationFrame(id);
        setShowOverlay(false);
        document.body.style.overflow = '';
      };
    }
    document.body.style.overflow = '';
    setShowOverlay(false);
  }, [selectedIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (images.length === 0) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const canvas = renderer.domElement;
    canvas.setAttribute('aria-label', 'Esfera 3D com obras de Fernando Quincas. Arraste para girar e clique em um card para ampliar.');
    canvas.setAttribute('role', 'img');
    canvas.style.cursor = 'grab';

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(canvas);

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const count = Math.min(cardCount, isMobile ? Math.round(cardCount / 2) : cardCount);
    const sphereRadius = isMobile ? radius * 0.9 : radius * 1.7;
    const cardWidth = sphereRadius * 0.18;
    const cardHeight = sphereRadius * 0.225;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      (container.clientWidth || 1) / (container.clientHeight || 1),
      0.1,
      1000
    );
    const initialCameraPosition = new THREE.Vector3(0, sphereRadius * 0.06, sphereRadius * 2.8);
    camera.position.copy(initialCameraPosition);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.rotateSpeed = 0.55;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.target.set(0, 0, 0);
    controls.update();

    const sphere = new THREE.Group();
    scene.add(sphere);

    const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const uniqueImages: string[] = Array.from(new Set(images));
    const materialCache = new Map<string, THREE.MeshBasicMaterial>();
    const texturesBySource = new Map<string, THREE.CanvasTexture>();

    uniqueImages.forEach((src) => {
      materialCache.set(
        src,
        new THREE.MeshBasicMaterial({
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          visible: false,
        })
      );
    });

    const meshes: THREE.Mesh[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / Math.max(1, count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const pos = new THREE.Vector3(x, y, z).multiplyScalar(sphereRadius);

      const mesh = new THREE.Mesh(geometry, materialCache.get(images[i % images.length])!);
      mesh.position.copy(pos);
      mesh.lookAt(pos.x * 2, pos.y * 2, pos.z * 2);
      mesh.userData.sourceIndex = i;
      sphere.add(mesh);
      meshes.push(mesh);
    }

    const imageLoader = new THREE.ImageLoader();
    uniqueImages.forEach((src) => {
      imageLoader.load(
        src,
        (image) => {
          const texture = createCardTexture(image);
          texturesBySource.set(src, texture);
          const material = materialCache.get(src);
          if (material) {
            material.map = texture;
            material.needsUpdate = true;
            material.visible = true;
          }
          THREE.Cache.remove(src);
        },
        undefined,
        () => {
          const material = materialCache.get(src);
          if (material) material.visible = true;
        }
      );
    });

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered: THREE.Mesh | null = null;
    let selected: THREE.Mesh | null = null;
    let tween: CameraTween | null = null;
    let downX = 0;
    let downY = 0;

    const updateNdc = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateNdc(event.clientX, event.clientY);
      if (selected || tween) {
        if (hovered) hovered = null;
        canvas.style.cursor = 'grab';
        if (labelRef.current) labelRef.current.style.opacity = '0';
        return;
      }
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      hovered = hits.length > 0 ? (hits[0].object as THREE.Mesh) : null;
      canvas.style.cursor = hovered ? 'pointer' : 'grab';
      if (labelRef.current) {
        labelRef.current.style.opacity = hovered ? '1' : '0';
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      downX = event.clientX;
      downY = event.clientY;
    };

    const handlePointerUp = (event: PointerEvent) => {
      const distance = Math.hypot(event.clientX - downX, event.clientY - downY);
      if (distance > 6) return;
      if (selected || tween || !hovered) return;
      selectCard(hovered);
    };

    const selectCard = (mesh: THREE.Mesh) => {
      selected = mesh;
      controls.autoRotate = false;
      controls.enabled = false;
      const worldPos = mesh.getWorldPosition(new THREE.Vector3());
      const dir = worldPos.clone().normalize();
      const toPos = worldPos.clone().addScaledVector(dir, sphereRadius * 0.95);
      tween = {
        fromPos: camera.position.clone(),
        toPos,
        fromTarget: controls.target.clone(),
        toTarget: worldPos.clone(),
        progress: 0,
        duration: 1.5,
        mode: 'select',
      };
      canvas.style.cursor = 'grab';
      setSelectedIndex(mesh.userData.sourceIndex as number);
    };

    const resetView = () => {
      tween = {
        fromPos: camera.position.clone(),
        toPos: initialCameraPosition.clone(),
        fromTarget: controls.target.clone(),
        toTarget: new THREE.Vector3(0, 0, 0),
        progress: 0,
        duration: 1.3,
        mode: 'reset',
      };
      setSelectedIndex(null);
    };
    resetRef.current = resetView;

    const handleControlsStart = () => {
      canvas.style.cursor = 'grabbing';
    };
    const handleControlsEnd = () => {
      canvas.style.cursor = hovered && !selected ? 'pointer' : 'grab';
    };
    const handlePointerLeave = () => {
      if (!selected) {
        hovered = null;
        canvas.style.cursor = 'grab';
        if (labelRef.current) labelRef.current.style.opacity = '0';
      }
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    controls.addEventListener('start', handleControlsStart);
    controls.addEventListener('end', handleControlsEnd);

    const clock = new THREE.Clock();
    const worldPosition = new THREE.Vector3();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);

      if (tween) {
        tween.progress += delta / tween.duration;
        const eased = easeInOutCubic(Math.min(1, tween.progress));
        camera.position.lerpVectors(tween.fromPos, tween.toPos, eased);
        controls.target.lerpVectors(tween.fromTarget, tween.toTarget, eased);
        if (tween.progress >= 1) {
          if (tween.mode === 'reset') {
            selected = null;
            controls.autoRotate = true;
            controls.enabled = true;
          } else {
            controls.enabled = true;
          }
          tween = null;
        }
      }

      for (const mesh of meshes) {
        const targetScale =
          !selected && !tween && mesh === hovered ? HOVER_SCALE : mesh === selected ? SELECTED_SCALE : 1;
        const s = mesh.scale.x + (targetScale - mesh.scale.x) * 0.18;
        if (Math.abs(s - targetScale) > 0.0005) mesh.scale.setScalar(s);
      }

      if (hovered && !selected && !tween && labelRef.current) {
        hovered.getWorldPosition(worldPosition);
        worldPosition.project(camera);
        const label = labelRef.current;
        const width = container.clientWidth || 1;
        const height = container.clientHeight || 1;
        const x = (worldPosition.x * 0.5 + 0.5) * width;
        const y = (-worldPosition.y * 0.5 + 0.5) * height;
        label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      controls.removeEventListener('start', handleControlsStart);
      controls.removeEventListener('end', handleControlsEnd);
      controls.dispose();
      geometry.dispose();
      materialCache.forEach((material) => material.dispose());
      texturesBySource.forEach((texture) => texture.dispose());
      renderer.dispose();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, [images, cardCount, radius]);

  if (webglUnavailable) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" role="list" aria-label="Obras de Fernando Quincas">
        {images.slice(0, 12).map((src, index) => (
          <figure key={index} role="listitem">
            <img
              src={src}
              alt={`Obra de Fernando Quincas ${index + 1}`}
              loading="lazy"
              className="w-full aspect-[4/5] object-cover rounded-lg border border-[#C8A86B]/20"
            />
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className="relative pb-10 md:pb-12">
      <div
        ref={containerRef}
        className="w-full h-[60vh] min-h-[360px] max-h-[520px] md:h-[90vh] md:max-h-[1000px] lg:max-h-[1050px] cursor-grab select-none touch-none"
      />

      {/* Hover micro-label */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-200 z-10 flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#C8A86B]" />
        <span className="text-[9px] tracking-[0.25em] uppercase font-mono text-[#E0C995]">
          CLIQUE PARA VER
        </span>
      </div>

      {/* Idle instruction */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#FAF8F5]/45">
        <Move className="w-3.5 h-3.5 text-[#C8A86B]" />
        <span className="text-[9px] tracking-[0.25em] uppercase font-mono">
          ARRASTE PARA GIRAR • CLIQUE PARA EXPLORAR
        </span>
      </div>

      {/* Selection Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50">
          <div
            className={`absolute inset-0 bg-black/85 backdrop-blur-xl transition-opacity duration-500 ${
              showOverlay ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="relative h-full w-full flex flex-col items-center justify-center px-6">
            <img
              src={images[selectedIndex % images.length]}
              alt={`Obra de Fernando Quincas ${(selectedIndex % images.length) + 1}`}
              className={`w-auto h-[46vh] sm:h-[56vh] max-w-[92vw] object-contain rounded-2xl border border-[#C8A86B]/50 shadow-2xl transition-all duration-500 ${
                showOverlay ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            />
            <button
              onClick={() => resetRef.current()}
              aria-label="Afastar e voltar à visão completa da esfera"
              className={`mt-8 flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C8A86B]/50 bg-[#FAF8F5]/5 backdrop-blur-md text-[#FAF8F5] hover:bg-[#FAF8F5]/15 hover:border-[#C8A86B] text-[10px] tracking-[0.25em] uppercase font-mono transition-opacity duration-500 ${
                showOverlay ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <RotateCcw className="w-3 h-3 text-[#C8A86B]" />
              AFASTAR
            </button>
          </div>
        </div>
      )}

      {/* Visually hidden accessible description */}
      <p className="sr-only">
        {selectedIndex === null
          ? 'Galeria tridimensional das obras de Fernando Quincas. Arraste para girar a esfera e clique em uma obra para ampliá-la.'
          : `Obra ${(selectedIndex % images.length) + 1} de ${images.length} selecionada. Utilize o botão afastar para voltar à visão completa.`}
      </p>
    </div>
  );
};
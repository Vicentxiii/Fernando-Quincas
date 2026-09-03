import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { STORYBOOK_IMAGES } from '../data/storyBookImages';

const SITE_URL = 'https://fernandoquincas.com.br';

// --- adaptive helpers ---
function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  // @ts-ignore
  const mem = (navigator as any).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (mem && mem <= 4) return true;
  if (cores && cores <= 4 && isMobile) return true;
  return false;
}

export const StoryBookPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const total = STORYBOOK_IMAGES.length;

  // refs for three
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bookGroupRef = useRef<THREE.Group | null>(null);
  const leftMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const rightMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const flipMeshRef = useRef<THREE.Mesh | null>(null);
  const flipMatFrontRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const flipMatBackRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const texturesRef = useRef<Map<string, THREE.Texture>>(new Map());
  const loaderRef = useRef<THREE.TextureLoader | null>(null);
  const animationRef = useRef<number>(0);
  const flipProgressRef = useRef(0);
  const isFlippingRef = useRef(false);
  const targetPageRef = useRef(0);
  const dragRef = useRef({ startX: 0, startTime: 0, lastX: 0, velocity: 0, progress: 0 });
  const currentRef = useRef(0);
  const lowEnd = useRef(false);

  // keep current in ref
  useEffect(() => { currentRef.current = current; }, [current]);

  useDocumentMeta({
    title: 'StoryBook — Livro Histórico de Fernando Quincas | 51 Páginas de Feiras, Galpões e Obras Monumentais',
    description: 'Folheie o StoryBook 3D de Fernando Quincas: 51 páginas do acervo histórico com feiras antigas, galpões, esculturas gigantes em fibra de vidro e bastidores do ateliê. Experiência imersiva, mobile-first e indexável.',
    canonical: `${SITE_URL}/storybook`,
    image: `/Book/${STORYBOOK_IMAGES[0]?.filename}`,
    type: 'website',
    keywords: 'Fernando Quincas, StoryBook, livro histórico, escultor brasileiro, fibra de vidro, obras monumentais, feiras antigas, galpão ateliê, esculturas gigantes, acervo histórico, Blumenau',
  });

  // --- texture loader with cache + lazy ---
  const loadTexture = useCallback((src: string): Promise<THREE.Texture> => {
    const cached = texturesRef.current.get(src);
    if (cached) return Promise.resolve(cached);
    if (!loaderRef.current) loaderRef.current = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
      loaderRef.current!.load(
        src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.needsUpdate = true;
          texturesRef.current.set(src, tex);
          resolve(tex);
        },
        undefined,
        reject
      );
    });
  }, []);

  const updateMaterials = useCallback(async (index: number, flipProgress = 0, isDuringDrag = false) => {
    // index is current page (right page)
    const leftSrc = index > 0 ? STORYBOOK_IMAGES[index - 1].src : null;
    const rightSrc = STORYBOOK_IMAGES[index]?.src;
    const nextSrc = index + 1 < total ? STORYBOOK_IMAGES[index + 1].src : null;
    const prevSrc = index - 2 >= 0 ? STORYBOOK_IMAGES[index - 2].src : null;

    // preload neighbours
    const toPreload = [rightSrc, leftSrc, nextSrc, prevSrc].filter(Boolean) as string[];
    toPreload.forEach(s => { if (!texturesRef.current.has(s)) loadTexture(s).catch(()=>{}); });

    if (leftMatRef.current && leftSrc) {
      const tex = texturesRef.current.get(leftSrc);
      if (tex) {
        leftMatRef.current.map = tex;
        leftMatRef.current.needsUpdate = true;
      } else {
        loadTexture(leftSrc).then(t => {
          if (leftMatRef.current) { leftMatRef.current.map = t; leftMatRef.current.needsUpdate = true; }
        }).catch(()=>{});
      }
    } else if (leftMatRef.current && !leftSrc) {
      // cover - paper color
      leftMatRef.current.map = null;
      leftMatRef.current.color.set('#F0ECE1');
      leftMatRef.current.needsUpdate = true;
    }
    if (rightMatRef.current && rightSrc) {
      const tex = texturesRef.current.get(rightSrc);
      if (tex) {
        rightMatRef.current.map = tex;
        rightMatRef.current.needsUpdate = true;
      } else {
        loadTexture(rightSrc).then(t => {
          if (rightMatRef.current) { rightMatRef.current.map = t; rightMatRef.current.needsUpdate = true; }
        }).catch(()=>{});
      }
    }
    // flip mats
    if (flipMatFrontRef.current && flipMatBackRef.current) {
      // front shows current right page, back shows next page
      const frontSrc = rightSrc;
      const backSrc = nextSrc;
      if (frontSrc) {
        const tex = texturesRef.current.get(frontSrc);
        if (tex) { flipMatFrontRef.current.map = tex; flipMatFrontRef.current.needsUpdate = true; }
        else loadTexture(frontSrc).then(t=>{ flipMatFrontRef.current!.map=t; flipMatFrontRef.current!.needsUpdate=true; }).catch(()=>{});
      }
      if (backSrc) {
        const tex = texturesRef.current.get(backSrc);
        if (tex) { flipMatBackRef.current.map = tex; flipMatBackRef.current.needsUpdate = true; }
        else loadTexture(backSrc).then(t=>{ flipMatBackRef.current!.map=t; flipMatBackRef.current!.needsUpdate=true; }).catch(()=>{});
      } else {
        // if no next, back is paper
        flipMatBackRef.current.map = null;
        flipMatBackRef.current.color.set('#FAF8F5');
      }
      // during drag, also handle backward flip: when dragging right, front should be prev
      if (isDuringDrag && flipProgress < 0) {
        // backward: front is prev, back is current
        const bf = leftSrc;
        const bb = rightSrc;
        if (bf) {
          const tex = texturesRef.current.get(bf);
          if (tex) { flipMatFrontRef.current.map = tex; } else loadTexture(bf).then(t=>{flipMatFrontRef.current!.map=t;}).catch(()=>{});
        }
        if (bb) {
          const tex = texturesRef.current.get(bb);
          if (tex) { flipMatBackRef.current.map = tex; } else loadTexture(bb).then(t=>{flipMatBackRef.current!.map=t;}).catch(()=>{});
        }
      }
    }
  }, [loadTexture, total]);

  // --- init three ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    lowEnd.current = isLowEndDevice();
    const isMobile = window.innerWidth < 768;

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF8F5');
    // subtle fog for premium
    scene.fog = new THREE.Fog('#FAF8F5', 8, 14);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(isMobile ? 42 : 38, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, isMobile ? 4.2 : 5.0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowEnd.current,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowEnd.current ? 1.2 : isMobile ? 1.6 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !lowEnd.current;
    if (!lowEnd.current) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // lights - luxury editorial
    const ambient = new THREE.AmbientLight(0xfff6e8, 0.85);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xfff1c8, lowEnd.current ? 0.8 : 1.15);
    dir.position.set(2.5, 4, 2);
    dir.castShadow = !lowEnd.current;
    if (!lowEnd.current) {
      dir.shadow.mapSize.set(1024, 1024);
      dir.shadow.camera.near = 0.5;
      dir.shadow.camera.far = 12;
      dir.shadow.bias = -0.0005;
    }
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xc8d8ff, 0.28);
    fill.position.set(-2, 2, -1.5);
    scene.add(fill);
    const rim = new THREE.PointLight(0xc8a86b, 0.35, 10);
    rim.position.set(0, 2.5, -2);
    scene.add(rim);

    // floor - subtle shadow catcher
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.14 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.68;
    floor.receiveShadow = true;
    scene.add(floor);

    // book group
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);
    bookGroupRef.current = bookGroup;

    // book dimensions
    const W = isMobile ? 1.65 : 1.9;
    const H = isMobile ? 1.05 : 1.24;
    const THICK = 0.08;

    // cover back (thickness)
    const coverGeo = new THREE.BoxGeometry(W * 2 + 0.04, H + 0.06, THICK);
    const coverMat = new THREE.MeshStandardMaterial({ color: '#1E1D1A', roughness: 0.72, metalness: 0.04 });
    const cover = new THREE.Mesh(coverGeo, coverMat);
    cover.position.y = -0.02;
    cover.position.z = -THICK / 2 - 0.01;
    cover.castShadow = true;
    cover.receiveShadow = true;
    bookGroup.add(cover);
    // gold edge
    const edgeGeo = new THREE.BoxGeometry(W * 2 + 0.02, 0.015, THICK + 0.015);
    const edgeMat = new THREE.MeshStandardMaterial({ color: '#C8A86B', roughness: 0.35, metalness: 0.38 });
    const topEdge = new THREE.Mesh(edgeGeo, edgeMat);
    topEdge.position.set(0, H / 2 + 0.02, -THICK / 2);
    bookGroup.add(topEdge);
    const bottomEdge = topEdge.clone();
    bottomEdge.position.y = -H / 2 - 0.02;
    bookGroup.add(bottomEdge);

    // spine
    const spineGeo = new THREE.BoxGeometry(0.09, H + 0.06, THICK + 0.02);
    const spineMat = new THREE.MeshStandardMaterial({ color: '#1E1D1A', roughness: 0.68 });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, -0.02, -THICK / 2 - 0.01);
    bookGroup.add(spine);
    // title on spine
    // pages stack shadow
    const pagesBlockGeo = new THREE.BoxGeometry(W * 2 - 0.02, H - 0.02, THICK * 0.72);
    const pagesBlockMat = new THREE.MeshStandardMaterial({ color: '#FDFCFB', roughness: 0.95 });
    const pagesBlock = new THREE.Mesh(pagesBlockGeo, pagesBlockMat);
    pagesBlock.position.y = -0.02;
    pagesBlock.position.z = -THICK * 0.18;
    bookGroup.add(pagesBlock);

    // left page (static)
    const pageW = W;
    const pageH = H;
    const segX = lowEnd.current ? 14 : 24;
    const segY = lowEnd.current ? 8 : 12;
    const leftGeo = new THREE.PlaneGeometry(pageW, pageH, segX, segY);
    const leftMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    const leftMesh = new THREE.Mesh(leftGeo, leftMat);
    leftMesh.position.set(-pageW / 2 - 0.005, 0, 0.005);
    leftMesh.castShadow = true;
    leftMesh.receiveShadow = true;
    bookGroup.add(leftMesh);
    leftMatRef.current = leftMat;

    // right page (static)
    const rightGeo = new THREE.PlaneGeometry(pageW, pageH, segX, segY);
    const rightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    const rightMesh = new THREE.Mesh(rightGeo, rightMat);
    rightMesh.position.set(pageW / 2 + 0.005, 0, 0.005);
    rightMesh.castShadow = true;
    rightMesh.receiveShadow = true;
    bookGroup.add(rightMesh);
    rightMatRef.current = rightMat;

    // flipping page - high subdivision for curvature
    const flipGeo = new THREE.PlaneGeometry(pageW, pageH, lowEnd.current ? 18 : 32, segY);
    // store original positions for deformation
    const posAttr = flipGeo.attributes.position as THREE.BufferAttribute;
    const origPositions = new Float32Array(posAttr.array);
    (flipGeo as any).userData = { origPositions, segX, pageW, pageH };

    const flipMatFront = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, side: THREE.FrontSide });
    const flipMatBack = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, side: THREE.BackSide });
    // use two materials? Instead we use one mesh double side and swap? Better to have 2 meshes sharing geometry but different material sides and offset z by epsilon.
    // Simplest: single mesh with DoubleSide and we swap map based on progress threshold, but for real curl we need front/back distinct. We'll clone mesh.
    const flipMesh = new THREE.Mesh(flipGeo, flipMatFront);
    flipMesh.castShadow = true;
    flipMesh.receiveShadow = true;
    // pivot at spine (left edge) -> translate geometry
    flipGeo.translate(pageW / 2, 0, 0);
    flipMesh.position.set(0, 0, 0.015);
    // rotation pivot at origin (spine)
    bookGroup.add(flipMesh);
    flipMeshRef.current = flipMesh;
    flipMatFrontRef.current = flipMatFront;
    flipMatBackRef.current = flipMatBack;
    // second side mesh for back
    const flipMeshBack = new THREE.Mesh(flipGeo, flipMatBack);
    flipMeshBack.castShadow = true;
    flipMeshBack.position.copy(flipMesh.position);
    // we keep it as child same transform, but we will toggle visibility based on angle
    bookGroup.add(flipMeshBack);
    (flipMesh as any).backMesh = flipMeshBack;

    // subtle tilt for premium perspective
    bookGroup.rotation.x = -0.10;
    bookGroup.rotation.y = isMobile ? 0 : -0.06;
    bookGroup.position.y = 0.05;

    loaderRef.current = new THREE.TextureLoader();

    // initial textures
    updateMaterials(0).then(() => setLoaded(true));

    // render loop
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      // subtle floating
      const t = Date.now() * 0.0004;
      if (bookGroup && !isFlippingRef.current && !isDragging) {
        bookGroup.position.y = 0.05 + Math.sin(t) * 0.015;
        bookGroup.rotation.y = (isMobile ? 0 : -0.06) + Math.sin(t * 0.5) * 0.015;
      }
      // update flip mesh deformation based on flipProgressRef
      if (flipMeshRef.current) {
        const p = flipProgressRef.current; // -1 to 1, 0 idle, 1 forward, -1 backward
        const absP = Math.abs(p);
        const dir = p >= 0 ? 1 : -1;
        // visibility: front/back
        const frontMesh = flipMeshRef.current;
        const backMesh: THREE.Mesh = (frontMesh as any).backMesh;
        if (absP > 0.01) {
          frontMesh.visible = true;
          backMesh.visible = true;
          // compute rotation: forward = -PI * progress, backward = +PI * |progress| but mirrored
          const angle = dir > 0 ? -absP * Math.PI : absP * Math.PI;
          frontMesh.rotation.y = angle;
          backMesh.rotation.y = angle;
          // deform geometry
          const geo: any = frontMesh.geometry;
          const orig: Float32Array = geo.userData.origPositions;
          const pos = geo.attributes.position as THREE.BufferAttribute;
          const pageWidth = geo.userData.pageW;
          for (let i = 0; i < pos.count; i++) {
            const ox = orig[i * 3];
            const oy = orig[i * 3 + 1];
            // ox in [0, pageW] after translate
            const u = ox / pageWidth; // 0 spine, 1 edge
            // curvature: bend along cylinder. Use sine wave: z = sin(u * PI) * bend * sin(progress*PI)
            const bend = Math.sin(absP * Math.PI) * 0.28 * Math.sin(u * Math.PI);
            // also add slight lift
            const lift = Math.sin(absP * Math.PI) * 0.08 * (1 - u);
            let nx = ox;
            let ny = oy;
            let nz = bend + lift;
            // when near 90deg, also compress x slightly to fake perspective
            const compress = 1 - 0.08 * Math.sin(absP * Math.PI) * u;
            nx = ox * compress;
            pos.setXYZ(i, nx, ny, nz);
          }
          pos.needsUpdate = true;
          geo.computeVertexNormals();
          // shadow intensity
          const shadow = absP > 0.1 && absP < 0.9 ? 0.25 * Math.sin(absP * Math.PI) : 0;
          frontMesh.material && ((frontMesh.material as any).color && (frontMesh.material as THREE.MeshStandardMaterial).color.setHSL(0, 0, 1 - shadow * 0.12));
          // opacity hint for back
          const isFrontVisible = Math.abs(angle) < Math.PI / 2;
          frontMesh.visible = isFrontVisible;
          backMesh.visible = !isFrontVisible;
          // keep positions synced
          backMesh.position.copy(frontMesh.position);
          backMesh.rotation.copy(frontMesh.rotation);
          (backMesh.geometry as any).attributes.position.needsUpdate = true;
        } else {
          // idle hidden
          frontMesh.visible = false;
          backMesh.visible = false;
          frontMesh.rotation.y = 0;
          backMesh.rotation.y = 0;
          // reset geometry
          const geo: any = frontMesh.geometry;
          const orig: Float32Array = geo.userData.origPositions;
          const pos = geo.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < pos.count; i++) {
            pos.setXYZ(i, orig[i * 3], orig[i * 3 + 1], orig[i * 3 + 2]);
          }
          pos.needsUpdate = true;
          geo.computeVertexNormals();
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowEnd.current ? 1.25 : isMobile ? 1.7 : 2));
    };
    window.addEventListener('resize', onResize);
    // orientation change
    window.addEventListener('orientationchange', () => setTimeout(onResize, 300));

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize as any);
      // disposal
      renderer.dispose();
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
          else obj.material.dispose();
        }
      });
      texturesRef.current.forEach(t => t.dispose());
      texturesRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when current changes, update mats
  useEffect(() => {
    updateMaterials(current);
  }, [current, updateMaterials]);

  // --- flip logic ---
  const animateTo = useCallback((target: number, fromProgress: number, dir: number) => {
    isFlippingRef.current = true;
    const start = performance.now();
    const duration = 560;
    const startProgress = fromProgress;
    const delta = dir > 0 ? (1 - startProgress) : (-1 - startProgress); // target 1 or -1
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic - physics aprox

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = ease(t);
      const p = startProgress + delta * eased;
      flipProgressRef.current = p;
      if (t < 1) {
        animationRef.current = requestAnimationFrame(() => step(performance.now()));
      } else {
        // complete
        if (dir > 0) {
          // forward
          targetPageRef.current = Math.min(total - 1, target);
          setCurrent(targetPageRef.current);
        } else {
          // backward
          targetPageRef.current = Math.max(0, target);
          setCurrent(targetPageRef.current);
        }
        flipProgressRef.current = 0;
        isFlippingRef.current = false;
      }
    };
    step(performance.now());
  }, [total]);

  const goNext = useCallback(() => {
    if (isFlippingRef.current || isDragging) return;
    if (currentRef.current >= total - 1) return;
    setShowHint(false);
    const next = currentRef.current + 1;
    targetPageRef.current = next;
    // ensure next texture loaded for back face before anim
    const nextSrc = STORYBOOK_IMAGES[next]?.src;
    if (nextSrc && !texturesRef.current.has(nextSrc)) {
      loadTexture(nextSrc).then(() => {
        updateMaterials(currentRef.current, 0, false).then(() => {
          animateTo(next, 0, 1);
        });
      }).catch(() => animateTo(next, 0, 1));
    } else {
      updateMaterials(currentRef.current, 0, false).then(() => animateTo(next, 0, 1));
    }
  }, [animateTo, isDragging, loadTexture, total, updateMaterials]);

  const goPrev = useCallback(() => {
    if (isFlippingRef.current || isDragging) return;
    if (currentRef.current <= 0) return;
    setShowHint(false);
    const prev = currentRef.current - 1;
    targetPageRef.current = prev;
    // for backward, flip from left. We reuse same mesh but dir -1
    const prevSrc = STORYBOOK_IMAGES[prev]?.src;
    if (prevSrc && !texturesRef.current.has(prevSrc)) {
      loadTexture(prevSrc).then(() => {
        updateMaterials(currentRef.current, 0, false).then(() => {
          animateTo(prev, 0, -1);
        });
      }).catch(() => animateTo(prev, 0, -1));
    } else {
      updateMaterials(currentRef.current, 0, false).then(() => animateTo(prev, 0, -1));
    }
  }, [animateTo, isDragging, loadTexture, updateMaterials]);

  // pointer events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isFlippingRef.current) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current.startX = e.clientX;
    dragRef.current.lastX = e.clientX;
    dragRef.current.startTime = performance.now();
    dragRef.current.velocity = 0;
    dragRef.current.progress = 0;
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || isFlippingRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const delta = e.clientX - dragRef.current.startX;
    const velocity = e.clientX - dragRef.current.lastX;
    dragRef.current.velocity = velocity;
    dragRef.current.lastX = e.clientX;
    // threshold: 0.45 * width -> full flip. negative for prev.
    let progress = delta / (w * 0.42);
    progress = Math.max(-1, Math.min(1, progress));
    // only allow direction that has pages: if at 0 and progress >0 (trying prev? Actually drag left = negative? Let's define: swipe left (delta negative) = next, swipe right = prev.
    // Our progress: negative = next (left swipe), positive = prev (right swipe) but our earlier mapping was opposite. Normalize: drag left should go next.
    // So invert: progress = -delta / ...
    progress = -progress;
    // clamp to available pages
    if (progress > 0 && currentRef.current >= total - 1) progress = 0;
    if (progress < 0 && currentRef.current <= 0) progress = 0;
    dragRef.current.progress = progress;
    flipProgressRef.current = progress;
    // ensure materials reflect drag direction
    if (Math.abs(progress) > 0.02) {
      updateMaterials(currentRef.current, progress, true);
    }
    // prevent scroll when horizontal drag dominant
    if (Math.abs(delta) > 10) {
      e.preventDefault();
    }
  }, [isDragging, total, updateMaterials]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {}
    const p = dragRef.current.progress;
    const v = dragRef.current.velocity;
    const absP = Math.abs(p);
    const speed = Math.abs(v);
    const threshold = 0.28;
    const velocityThreshold = 8; // px per frame
    const shouldFlip = absP > threshold || speed > velocityThreshold;
    if (!shouldFlip) {
      // cancel - animate back to 0
      const startP = p;
      const start = performance.now();
      const dur = 260;
      const step = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        flipProgressRef.current = startP * (1 - eased);
        if (t < 1) requestAnimationFrame(() => step(performance.now()));
        else flipProgressRef.current = 0;
      };
      step(performance.now());
      return;
    }
    // complete flip
    setShowHint(false);
    if (p > 0) {
      // next
      const next = Math.min(total - 1, currentRef.current + 1);
      animateTo(next, p, 1);
    } else {
      // prev
      const prev = Math.max(0, currentRef.current - 1);
      animateTo(prev, p, -1);
    }
  }, [animateTo, isDragging, total]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // sitemap progress indicator already

  const pageNum = String(current + 1).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'StoryBook — Livro Histórico de Fernando Quincas',
    creator: { '@type': 'Person', name: 'Fernando Quincas', url: SITE_URL },
    about: 'Acervo histórico de 51 fotografias de feiras antigas, galpões e obras monumentais em fibra de vidro do escultor brasileiro Fernando Quincas',
    isAccessibleForFree: true,
    inLanguage: 'pt-BR',
    numberOfPages: total,
    image: STORYBOOK_IMAGES.slice(0, 6).map(i => i.contentUrl),
    hasPart: STORYBOOK_IMAGES.map((img, idx) => ({
      '@type': 'ImageObject',
      contentUrl: img.contentUrl,
      name: img.title,
      description: img.description,
      caption: img.caption,
      representativeOfPage: idx === 0,
      encodingFormat: 'image/jpeg',
      creator: { '@type': 'Person', name: 'Fernando Quincas' },
    })),
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A] flex flex-col selection:bg-[#C8A86B]/25">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Header Spacer because Header is fixed */}
      <div className="h-[86px] sm:h-[96px]" aria-hidden />

      {/* Intro editorial */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 pt-6 sm:pt-10 pb-4 text-center">
        <span className="inline-block font-mono text-[10px] tracking-[0.32em] uppercase text-[#C8A86B]">Acervo Histórico • 1980—2005</span>
        <h1 className="mt-3 font-display text-[28px] sm:text-[42px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#1E1D1A]">
          StoryBook<span className="font-serif italic font-light text-[#C8A86B]"> de</span> Fernando Quincas
        </h1>
        <p className="mt-4 font-serif text-[15px] sm:text-[17px] leading-7 text-[#2C2A26]/75 max-w-3xl mx-auto">
          51 páginas do livro fotografado página a página: feiras antigas, galpões do ateliê no Jaguari, esculturas gigantes em fibra de vidro,
          fontes, colunas e bastidores de quatro décadas. Deslize para folhear o livro físico em 3D — cada página também existe como imagem indexável para buscadores e IAs.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#8A82A5]">
          <span className="w-8 h-px bg-[#C8A86B]/30" aria-hidden />
          <span>Livro físico digitalizado • Edição única</span>
          <span className="w-8 h-px bg-[#C8A86B]/30" aria-hidden />
        </div>
      </section>

      {/* 3D Canvas */}
      <section aria-label="Livro 3D interativo" className="relative w-full max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/2.9] sm:aspect-[16/9.5] lg:aspect-[16/8.6] bg-[#FAF8F5] rounded-[18px] sm:rounded-[24px] border border-[#C8A86B]/12 shadow-[0_18px_48px_rgba(30,29,26,0.08),0_1px_0_rgba(200,168,107,0.12)] overflow-hidden select-none"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="application"
          aria-label="Livro 3D — arraste para folhear"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
            aria-hidden="true"
          />
          {/* Loading */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F5]/80 backdrop-blur-[2px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#C8A86B]/30 border-t-[#C8A86B] rounded-full animate-spin" aria-label="Carregando livro" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">Carregando StoryBook</span>
              </div>
            </div>
          )}
          {/* Hint first time mobile */}
          {showHint && loaded && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 pointer-events-none">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1E1D1A]/86 text-[#FAF8F5] backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.18)]">
                <span className="w-2 h-2 rounded-full bg-[#C8A86B] animate-pulse" aria-hidden />
                <span className="font-mono text-[11px] tracking-widest uppercase">Deslize para folhear</span>
                <span className="hidden sm:inline font-serif italic text-xs opacity-70">• arraste ou use ← →</span>
              </div>
            </div>
          )}
          {/* Page curl shadow gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#1E1D1A]/[0.055] to-transparent" aria-hidden />
          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(200,168,107,0.08)]" aria-hidden />
        </div>

        {/* Controls */}
        <div className="mt-4 sm:mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={current === 0 || isDragging}
              aria-label="Página anterior"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#C8A86B]/25 bg-white hover:border-[#C8A86B] hover:bg-[#FAF8F5] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M10 12L6 8L10 4" stroke="#1E1D1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              onClick={goNext}
              disabled={current >= total - 1 || isDragging}
              aria-label="Próxima página"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#C8A86B]/25 bg-white hover:border-[#C8A86B] hover:bg-[#FAF8F5] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M6 4L10 8L6 12" stroke="#1E1D1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="ml-2 font-mono text-[11px] tracking-[0.22em] text-[#8A82A5] tabular-nums">
              {pageNum} / {totalNum}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#8A82A5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6A7D69] animate-pulse" aria-hidden />
            <span>Arraste • Toque • Teclado ← →</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-serif italic text-xs text-[#8A82A5]">Livro físico • 51 páginas</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C8A86B]/12 border border-[#C8A86B]/18">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A86B]" aria-hidden />
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">WebGL</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-[#EAE5D8] overflow-hidden" aria-hidden>
          <div className="h-full bg-[#C8A86B] transition-all duration-500 ease-out" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>
      </section>

      {/* SEO / GEO - HTML semantico indexavel - imagens reais */}
      <article className="max-w-5xl mx-auto w-full px-6 sm:px-8 mt-10 sm:mt-14">
        <header className="border-t border-[#C8A86B]/15 pt-8">
          <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-[#1E1D1A]">Sobre este StoryBook — acervo histórico</h2>
          <p className="mt-3 font-sans text-[14px] leading-6 text-[#2C2A26]/75">
            O StoryBook reúne 51 fotografias do livro físico de Fernando Quincas, escultor brasileiro e mestre em fibra de vidro há quatro décadas.
            Cada página foi fotografada e renomeada semanticamente para descoberta por Google, Bing, Google Lens e IAs generativas (ChatGPT, Perplexity, Gemini).
            As imagens mostram feiras antigas, galpões do ateliê no Jaguari, transporte de esculturas gigantes em caminhões, fontes e cascatas para jardim, colunas gregas, vasos ornamentais,
            esculturas monumentais como a Boneca Eva (Playcenter, 45 m) e o Papai Noel gigante de Blumenau, além de bastidores de criação no galpão.
            Todas as imagens estão publicamente acessíveis em <code className="px-1.5 py-0.5 rounded bg-[#F0ECE1] text-[12px]">/Book/nome-do-arquivo.jpg</code> com metadata completa.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#1E1D1A] text-[#FAF8F5] font-mono text-[10px] tracking-widest uppercase">Escultor • Fernando Quincas</span>
            <span className="px-2.5 py-1 rounded-full border border-[#C8A86B]/20 bg-white font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">Fibra de vidro • Obras monumentais</span>
            <span className="px-2.5 py-1 rounded-full border border-[#C8A86B]/20 bg-white font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">Blumenau • Minas Gerais • Brasil</span>
          </div>
        </header>

        {/* Foto do StoryBook físico — capa solicitada */}
        <section aria-label="Foto do StoryBook físico" className="mt-8">
          <h3 className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#C8A86B]">O StoryBook físico</h3>
          <figure className="mt-3 rounded-2xl overflow-hidden border border-[#C8A86B]/15 bg-[#FDFCFB]">
            <img
              src={STORYBOOK_IMAGES[49].src}
              alt={STORYBOOK_IMAGES[49].alt}
              title={STORYBOOK_IMAGES[49].title}
              width={1200}
              height={900}
              loading="eager"
              decoding="async"
              className="w-full h-auto object-cover"
            />
            <figcaption className="px-4 py-3 bg-[#FAF8F5] font-serif italic text-sm text-[#2C2A26]/70">
              {STORYBOOK_IMAGES[49].caption} — capa do StoryBook físico.
            </figcaption>
          </figure>
        </section>

        {/* Gallery semantic - every image */}
        <section aria-label="Galeria indexável — todas as páginas do StoryBook" className="mt-10">
          <h3 className="font-display text-lg font-semibold text-[#1E1D1A]">Galeria indexável — 51 páginas</h3>
          <p className="mt-2 font-sans text-[13px] leading-6 text-[#2C2A26]/70">
            Cada imagem abaixo é a mesma utilizada como textura no livro 3D. Esta camada HTML garante que buscadores e IAs compreendam o conteúdo sem depender do canvas WebGL.
            Todas possuem <code>alt</code> descritivo, <code>title</code>, <code>width/height</code>, <code>loading</code> e <code>decoding</code> otimizados.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {STORYBOOK_IMAGES.map((img, idx) => (
              <figure
                key={img.filename}
                id={`storybook-page-${idx + 1}`}
                className="group rounded-2xl overflow-hidden border border-[#C8A86B]/15 bg-white shadow-[0_8px_22px_rgba(30,29,26,0.06)] hover:shadow-[0_12px_30px_rgba(30,29,26,0.10)] transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F0ECE1]">
                  <img
                    src={img.src}
                    alt={img.alt}
                    title={img.title}
                    width={1200}
                    height={900}
                    loading={idx < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={idx === current ? 'high' : 'auto'}
                    className={`w-full h-full object-cover transition-[transform,filter] duration-700 group-hover:scale-[1.02] ${idx === current ? 'ring-2 ring-[#C8A86B] ring-inset' : ''}`}
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-[#1E1D1A]/85 text-white font-mono text-[10px] tracking-widest">
                    {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  {idx === current && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-[#C8A86B] text-white font-mono text-[10px] tracking-widest uppercase">Aberta no livro</span>
                  )}
                </div>
                <figcaption className="px-4 py-3">
                  <h4 className="font-sans text-[12px] font-semibold leading-4 text-[#1E1D1A] line-clamp-2">{img.caption}</h4>
                  <p className="mt-1 font-serif italic text-xs leading-4 text-[#8A82A5] line-clamp-3">{img.description}</p>
                  <a
                    href={img.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase text-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
                  >
                    Abrir imagem original
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M3 7L7 3M7 3H4M7 3V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Concepts */}
        <section className="mt-10 rounded-2xl border border-[#C8A86B]/12 bg-[#FDFCFB] p-6 sm:p-7">
          <h3 className="font-display text-base font-semibold text-[#1E1D1A]">O que este StoryBook documenta</h3>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 font-sans text-[13px] leading-6 text-[#2C2A26]/75 list-disc pl-5">
            <li><strong>Feiras antigas</strong> — exposições de vasos, colunas gregas e esculturas gigantes em fibra de vidro nos anos 1980–1990.</li>
            <li><strong>Galpões do ateliê</strong> — Jaguari, Serra dos Órgãos, moldes, laminação, pintura PU e pátina mineral.</li>
            <li><strong>Obras monumentais</strong> — Boneca Eva de 45 m (Playcenter), Galinha de Monte Verde, Papai Noel gigante, cisnes, cavalinhos e grutas.</li>
            <li><strong>Paisagismo</strong> — fontes, cascatas, lagos ornamentais e jardins com esculturas para residências e praças.</li>
          </ul>
          <p className="mt-4 font-mono text-[11px] tracking-wide uppercase text-[#8A82A5]">Todas as páginas: public/Book • URLs públicas • Indexáveis • GEO ready</p>
        </section>
      </article>

      {/* Bottom spacer */}
      <div className="h-10 sm:h-14" aria-hidden />
    </main>
  );
};

export default StoryBookPage;

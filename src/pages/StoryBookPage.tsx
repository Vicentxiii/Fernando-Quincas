import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { STORYBOOK_IMAGES } from '../data/storyBookImages';

const SITE_URL = 'https://fernandoquincas.com.br';

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

// cover without stretch — mimics CSS object-fit: cover
function applyCover(texture: THREE.Texture, planeW: number, planeH: number) {
  const img = texture.image as HTMLImageElement | undefined;
  if (!img || !img.width || !img.height) return;
  const planeAspect = planeW / planeH;
  const imgAspect = img.width / img.height;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.center.set(0.5, 0.5);
  if (planeAspect > imgAspect) {
    // plane mais largo que imagem (imagem mais alta) — corta topo/baixo
    const scaleY = imgAspect / planeAspect;
    texture.repeat.set(1, scaleY);
    texture.offset.set(0, (1 - scaleY) / 2);
  } else {
    // plane mais alto que imagem (imagem mais larga) — corta laterais
    const scaleX = planeAspect / imgAspect;
    texture.repeat.set(scaleX, 1);
    texture.offset.set((1 - scaleX) / 2, 0);
  }
  texture.needsUpdate = true;
}

export const StoryBookPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const total = STORYBOOK_IMAGES.length;

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
  const flipProgressRef = useRef(0);
  const isFlippingRef = useRef(false);
  const targetPageRef = useRef(0);
  const dragRef = useRef({ startX: 0, lastX: 0, velocity: 0, progress: 0 });
  const currentRef = useRef(0);
  const lowEnd = useRef(false);
  const pageDimsRef = useRef({ w: 1.52, h: 1.08 });

  useEffect(() => { currentRef.current = current; }, [current]);

  useDocumentMeta({
    title: 'StoryBook — Livro Histórico de Fernando Quincas | 51 Páginas de Feiras, Galpões e Obras Monumentais',
    description: 'Folheie o StoryBook 3D de Fernando Quincas: 51 páginas do acervo histórico com feiras antigas, galpões, esculturas gigantes em fibra de vidro e bastidores do ateliê. Experiência imersiva, mobile-first e indexável.',
    canonical: `${SITE_URL}/storybook`,
    image: `/Book/${STORYBOOK_IMAGES[0]?.filename}`,
    type: 'website',
    keywords: 'Fernando Quincas, StoryBook, livro histórico, escultor brasileiro, fibra de vidro, obras monumentais, feiras antigas, galpão ateliê, esculturas gigantes, acervo histórico, Blumenau',
  });

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
          tex.anisotropy = 4;
          // cover sem esticar
          applyCover(tex, pageDimsRef.current.w, pageDimsRef.current.h);
          texturesRef.current.set(src, tex);
          resolve(tex);
        },
        undefined,
        reject
      );
    });
  }, []);

  const preloadAround = useCallback((index: number) => {
    const indices = [index, index + 1, index - 1, index + 2, index - 2].filter(i => i >= 0 && i < total);
    indices.forEach(i => {
      const src = STORYBOOK_IMAGES[i].src;
      if (!texturesRef.current.has(src)) loadTexture(src).catch(() => {});
    });
  }, [loadTexture, total]);

  const updateMaterials = useCallback(async (index: number) => {
    const leftSrc = index > 0 ? STORYBOOK_IMAGES[index - 1].src : null;
    const rightSrc = STORYBOOK_IMAGES[index]?.src;
    const nextSrc = index + 1 < total ? STORYBOOK_IMAGES[index + 1].src : null;

    // garante que texturas atuais estejam carregadas antes de exibir
    const needed: string[] = [];
    if (leftSrc) needed.push(leftSrc);
    if (rightSrc) needed.push(rightSrc);
    if (nextSrc) needed.push(nextSrc);
    await Promise.all(needed.map(s => loadTexture(s).catch(() => null)));

    if (leftMatRef.current) {
      if (leftSrc) {
        const tex = texturesRef.current.get(leftSrc)!;
        if (tex) {
          applyCover(tex, pageDimsRef.current.w, pageDimsRef.current.h);
          leftMatRef.current.map = tex;
          leftMatRef.current.color.set(0xffffff);
          leftMatRef.current.needsUpdate = true;
        }
      } else {
        // capa interna — papel texturizado claro, não bege chapado
        leftMatRef.current.map = null;
        leftMatRef.current.color.set('#F8F5EF');
        leftMatRef.current.needsUpdate = true;
      }
    }
    if (rightMatRef.current && rightSrc) {
      const tex = texturesRef.current.get(rightSrc)!;
      if (tex) {
        applyCover(tex, pageDimsRef.current.w, pageDimsRef.current.h);
        rightMatRef.current.map = tex;
        rightMatRef.current.color.set(0xffffff);
        rightMatRef.current.needsUpdate = true;
      }
    }
    if (flipMatFrontRef.current && flipMatBackRef.current) {
      const frontSrc = rightSrc;
      const backSrc = nextSrc;
      if (frontSrc) {
        const tex = texturesRef.current.get(frontSrc);
        if (tex) {
          applyCover(tex, pageDimsRef.current.w, pageDimsRef.current.h);
          flipMatFrontRef.current.map = tex;
          flipMatFrontRef.current.color.set(0xffffff);
          flipMatFrontRef.current.needsUpdate = true;
        }
      }
      if (backSrc) {
        const tex = texturesRef.current.get(backSrc);
        if (tex) {
          applyCover(tex, pageDimsRef.current.w, pageDimsRef.current.h);
          flipMatBackRef.current.map = tex;
          flipMatBackRef.current.color.set(0xffffff);
          flipMatBackRef.current.needsUpdate = true;
        } else {
          flipMatBackRef.current.map = null;
          flipMatBackRef.current.color.set('#F8F5EF');
        }
      } else {
        flipMatBackRef.current.map = null;
        flipMatBackRef.current.color.set('#F8F5EF');
      }
    }
    // preload vizinhos
    preloadAround(index);
  }, [loadTexture, preloadAround, total]);

  // init three — elegante e estável para mobile
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    lowEnd.current = isLowEndDevice();
    const isMobile = window.innerWidth < 768;

    // page dims elegantes — mobile-first
    const W = isMobile ? 1.42 : 1.58;
    const H = isMobile ? 1.02 : 1.18;
    pageDimsRef.current = { w: W, h: H };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F9F6F0');
    // sem fog agressivo — mantém nitidez das fotos
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(isMobile ? 46 : 40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.85, isMobile ? 3.85 : 4.65);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowEnd.current,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowEnd.current ? 1.2 : isMobile ? 1.7 : 1.9));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !lowEnd.current;
    if (!lowEnd.current) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // luz premium suave — sem brilho estourado
    const ambient = new THREE.AmbientLight(0xfff8ee, 0.92);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xfff1d6, lowEnd.current ? 0.85 : 1.0);
    key.position.set(2.2, 3.8, 2.0);
    key.castShadow = !lowEnd.current;
    if (!lowEnd.current) {
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 10;
      key.shadow.bias = -0.0006;
      key.shadow.radius = 6;
    }
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xdde8ff, 0.22);
    fill.position.set(-2.4, 1.8, -1.2);
    scene.add(fill);
    const rim = new THREE.PointLight(0xc8a86b, 0.18, 8);
    rim.position.set(0, 2.2, -1.8);
    scene.add(rim);

    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.09 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.72;
    floor.receiveShadow = true;
    scene.add(floor);

    const bookGroup = new THREE.Group();
    scene.add(bookGroup);
    bookGroupRef.current = bookGroup;

    const THICK = 0.07;

    // base do livro — couro escuro fosco elegante
    const coverGeo = new THREE.BoxGeometry(W * 2 + 0.03, H + 0.05, THICK);
    const coverMat = new THREE.MeshStandardMaterial({ color: '#1B1A18', roughness: 0.78, metalness: 0.02 });
    const cover = new THREE.Mesh(coverGeo, coverMat);
    cover.position.y = -0.015;
    cover.position.z = -THICK / 2 - 0.01;
    cover.castShadow = true;
    cover.receiveShadow = true;
    bookGroup.add(cover);

    const edgeGeo = new THREE.BoxGeometry(W * 2 + 0.015, 0.012, THICK + 0.01);
    const edgeMat = new THREE.MeshStandardMaterial({ color: '#C8A86B', roughness: 0.32, metalness: 0.28 });
    const topEdge = new THREE.Mesh(edgeGeo, edgeMat);
    topEdge.position.set(0, H / 2 + 0.018, -THICK / 2);
    bookGroup.add(topEdge);
    const bottomEdge = topEdge.clone();
    bottomEdge.position.y = -H / 2 - 0.018;
    bookGroup.add(bottomEdge);

    const spineGeo = new THREE.BoxGeometry(0.08, H + 0.05, THICK + 0.015);
    const spineMat = new THREE.MeshStandardMaterial({ color: '#1B1A18', roughness: 0.75 });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, -0.015, -THICK / 2 - 0.01);
    bookGroup.add(spine);

    const pagesBlockGeo = new THREE.BoxGeometry(W * 2 - 0.02, H - 0.015, THICK * 0.68);
    const pagesBlockMat = new THREE.MeshStandardMaterial({ color: '#FFFEFB', roughness: 0.96 });
    const pagesBlock = new THREE.Mesh(pagesBlockGeo, pagesBlockMat);
    pagesBlock.position.y = -0.015;
    pagesBlock.position.z = -THICK * 0.16;
    bookGroup.add(pagesBlock);

    const pageW = W;
    const pageH = H;
    const segX = lowEnd.current ? 16 : 28;
    const segY = lowEnd.current ? 10 : 14;

    const leftGeo = new THREE.PlaneGeometry(pageW, pageH, segX, segY);
    const leftMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88, metalness: 0, side: THREE.DoubleSide });
    const leftMesh = new THREE.Mesh(leftGeo, leftMat);
    leftMesh.position.set(-pageW / 2 - 0.004, 0, 0.006);
    leftMesh.castShadow = true;
    leftMesh.receiveShadow = true;
    bookGroup.add(leftMesh);
    leftMatRef.current = leftMat;

    const rightGeo = new THREE.PlaneGeometry(pageW, pageH, segX, segY);
    const rightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88, metalness: 0, side: THREE.DoubleSide });
    const rightMesh = new THREE.Mesh(rightGeo, rightMat);
    rightMesh.position.set(pageW / 2 + 0.004, 0, 0.006);
    rightMesh.castShadow = true;
    rightMesh.receiveShadow = true;
    bookGroup.add(rightMesh);
    rightMatRef.current = rightMat;

    const flipGeo = new THREE.PlaneGeometry(pageW, pageH, lowEnd.current ? 20 : 32, segY);
    const posAttr = flipGeo.attributes.position as THREE.BufferAttribute;
    const origPositions = new Float32Array(posAttr.array);
    (flipGeo as any).userData = { origPositions, segX, pageW, pageH };
    const flipMatFront = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.86, side: THREE.FrontSide });
    const flipMatBack = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.86, side: THREE.BackSide });
    const flipMesh = new THREE.Mesh(flipGeo, flipMatFront);
    flipMesh.castShadow = true;
    flipMesh.receiveShadow = true;
    flipGeo.translate(pageW / 2, 0, 0);
    flipMesh.position.set(0, 0, 0.018);
    bookGroup.add(flipMesh);
    flipMeshRef.current = flipMesh;
    flipMatFrontRef.current = flipMatFront;
    flipMatBackRef.current = flipMatBack;
    const flipMeshBack = new THREE.Mesh(flipGeo, flipMatBack);
    flipMeshBack.castShadow = true;
    flipMeshBack.position.copy(flipMesh.position);
    bookGroup.add(flipMeshBack);
    (flipMesh as any).backMesh = flipMeshBack;

    // pose elegante estática — sem floating automático
    bookGroup.rotation.x = -0.07;
    bookGroup.rotation.y = isMobile ? 0 : -0.035;
    bookGroup.rotation.z = 0;
    bookGroup.position.y = 0.02;

    loaderRef.current = new THREE.TextureLoader();
    // preload inicial — garante que a primeira imagem apareça nítida, sem esticar
    (async () => {
      await preloadAround(0);
      // espera texturas 0 e 1 carregarem antes de mostrar
      await Promise.all([
        loadTexture(STORYBOOK_IMAGES[0].src).catch(()=>null),
        STORYBOOK_IMAGES[1] ? loadTexture(STORYBOOK_IMAGES[1].src).catch(()=>null) : Promise.resolve(null),
      ]);
      await updateMaterials(0);
      setLoaded(true);
    })();

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (flipMeshRef.current) {
        const p = flipProgressRef.current;
        const absP = Math.abs(p);
        const dir = p >= 0 ? 1 : -1;
        const frontMesh = flipMeshRef.current;
        const backMesh: THREE.Mesh = (frontMesh as any).backMesh;
        if (absP > 0.008) {
          frontMesh.visible = true;
          backMesh.visible = true;
          const angle = dir > 0 ? -absP * Math.PI : absP * Math.PI;
          frontMesh.rotation.y = angle;
          backMesh.rotation.y = angle;
          const geo: any = frontMesh.geometry;
          const orig: Float32Array = geo.userData.origPositions;
          const pos = geo.attributes.position as THREE.BufferAttribute;
          const pageWidth = geo.userData.pageW;
          for (let i = 0; i < pos.count; i++) {
            const ox = orig[i * 3];
            const oy = orig[i * 3 + 1];
            const u = ox / pageWidth;
            // curvatura mais sutil e elegante — não deforma foto
            const bend = Math.sin(absP * Math.PI) * 0.18 * Math.sin(u * Math.PI);
            const lift = Math.sin(absP * Math.PI) * 0.045 * (1 - u);
            const compress = 1 - 0.04 * Math.sin(absP * Math.PI) * u;
            const nx = ox * compress;
            pos.setXYZ(i, nx, oy, bend + lift);
          }
          pos.needsUpdate = true;
          geo.computeVertexNormals();
          const isFrontVisible = Math.abs(angle) < Math.PI / 2 - 0.02;
          frontMesh.visible = isFrontVisible;
          backMesh.visible = !isFrontVisible;
          backMesh.position.copy(frontMesh.position);
          backMesh.rotation.copy(frontMesh.rotation);
          (backMesh.geometry as any).attributes.position.needsUpdate = true;
        } else {
          frontMesh.visible = false;
          backMesh.visible = false;
          frontMesh.rotation.y = 0;
          backMesh.rotation.y = 0;
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowEnd.current ? 1.2 : isMobile ? 1.65 : 1.85));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', () => setTimeout(onResize, 320));

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize as any);
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
  }, [loadTexture, preloadAround, updateMaterials]);

  useEffect(() => { updateMaterials(current); }, [current, updateMaterials]);

  const animateTo = useCallback((target: number, fromProgress: number, dir: number) => {
    isFlippingRef.current = true;
    const start = performance.now();
    const duration = 560;
    const startProgress = fromProgress;
    const delta = dir > 0 ? (1 - startProgress) : (-1 - startProgress);
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = ease(t);
      flipProgressRef.current = startProgress + delta * eased;
      if (t < 1) {
        requestAnimationFrame(() => step(performance.now()));
      } else {
        if (dir > 0) setCurrent(Math.min(total - 1, target));
        else setCurrent(Math.max(0, target));
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
    const nextSrc = STORYBOOK_IMAGES[next]?.src;
    if (nextSrc && !texturesRef.current.has(nextSrc)) {
      loadTexture(nextSrc).then(() => updateMaterials(currentRef.current).then(() => animateTo(next, 0, 1))).catch(() => animateTo(next, 0, 1));
    } else {
      updateMaterials(currentRef.current).then(() => animateTo(next, 0, 1));
    }
  }, [animateTo, isDragging, loadTexture, total, updateMaterials]);

  const goPrev = useCallback(() => {
    if (isFlippingRef.current || isDragging) return;
    if (currentRef.current <= 0) return;
    setShowHint(false);
    const prev = currentRef.current - 1;
    targetPageRef.current = prev;
    // para voltar, precisamos da textura da página anterior na frente do flip
    // garante que flip mostre prev -> current
    loadTexture(STORYBOOK_IMAGES[prev].src).then(async () => {
      // prepara flip com direção negativa: frente = prev, verso = current
      if (flipMatFrontRef.current && flipMatBackRef.current) {
        const prevTex = texturesRef.current.get(STORYBOOK_IMAGES[prev].src);
        const curTex = texturesRef.current.get(STORYBOOK_IMAGES[currentRef.current].src);
        if (prevTex) {
          applyCover(prevTex, pageDimsRef.current.w, pageDimsRef.current.h);
          flipMatFrontRef.current.map = prevTex; flipMatFrontRef.current.color.set(0xffffff); flipMatFrontRef.current.needsUpdate = true;
        }
        if (curTex) {
          applyCover(curTex, pageDimsRef.current.w, pageDimsRef.current.h);
          flipMatBackRef.current.map = curTex; flipMatBackRef.current.color.set(0xffffff); flipMatBackRef.current.needsUpdate = true;
        }
      }
      animateTo(prev, 0, -1);
    }).catch(() => animateTo(prev, 0, -1));
  }, [animateTo, isDragging, loadTexture, updateMaterials]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isFlippingRef.current) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current.startX = e.clientX;
    dragRef.current.lastX = e.clientX;
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
    let progress = delta / (w * 0.44);
    progress = Math.max(-1, Math.min(1, progress));
    progress = -progress; // swipe esquerda = próxima
    if (progress > 0 && currentRef.current >= total - 1) progress = 0;
    if (progress < 0 && currentRef.current <= 0) progress = 0;
    dragRef.current.progress = progress;
    flipProgressRef.current = progress;
    if (Math.abs(progress) > 0.015) {
      // durante drag, garante textura correta sem placeholder bege
      const dir = progress > 0 ? 1 : -1;
      if (dir > 0) {
        const nextSrc = STORYBOOK_IMAGES[currentRef.current + 1]?.src;
        if (nextSrc) {
          const tex = texturesRef.current.get(nextSrc);
          if (!tex) loadTexture(nextSrc).then(() => {
            const t = texturesRef.current.get(nextSrc);
            if (t && flipMatBackRef.current) {
              applyCover(t, pageDimsRef.current.w, pageDimsRef.current.h);
              flipMatBackRef.current.map = t; flipMatBackRef.current.color.set(0xffffff);
            }
          }).catch(()=>{});
          else if (flipMatBackRef.current && tex) {
            // garante que back está com next
            flipMatBackRef.current.map = tex;
          }
        }
      } else {
        const prevSrc = STORYBOOK_IMAGES[currentRef.current - 1]?.src;
        if (prevSrc) {
          const t = texturesRef.current.get(prevSrc);
          if (t && flipMatFrontRef.current) {
            applyCover(t, pageDimsRef.current.w, pageDimsRef.current.h);
            flipMatFrontRef.current.map = t; flipMatFrontRef.current.color.set(0xffffff);
          }
        }
      }
    }
    if (Math.abs(delta) > 8) e.preventDefault();
  }, [isDragging, loadTexture, total]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {}
    const p = dragRef.current.progress;
    const v = dragRef.current.velocity;
    const absP = Math.abs(p);
    const speed = Math.abs(v);
    const threshold = 0.26;
    const velocityThreshold = 9;
    const shouldFlip = absP > threshold || speed > velocityThreshold;
    if (!shouldFlip) {
      const startP = p;
      const start = performance.now();
      const dur = 280;
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
    setShowHint(false);
    if (p > 0) {
      const next = Math.min(total - 1, currentRef.current + 1);
      animateTo(next, p, 1);
    } else {
      const prev = Math.max(0, currentRef.current - 1);
      // para gesto de voltar, já preparamos frente como prev acima
      animateTo(prev, p, -1);
    }
  }, [animateTo, isDragging, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') { e.preventDefault(); setLightboxIndex(null); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); setLightboxIndex(i => i !== null ? Math.min(total - 1, i + 1) : i); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); setLightboxIndex(i => i !== null ? Math.max(0, i - 1) : i); return; }
      }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, lightboxIndex, total]);

  // trava scroll quando lightbox aberto (mobile)
  useEffect(() => {
    if (lightboxIndex !== null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [lightboxIndex]);

  const pageNum = String(current + 1).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');

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
    <main className="min-h-screen bg-[#F9F6F0] text-[#1E1D1A] flex flex-col selection:bg-[#C8A86B]/25">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="h-[84px] sm:h-[94px]" aria-hidden />
      <section className="max-w-5xl mx-auto px-6 sm:px-8 pt-6 sm:pt-8 pb-3 text-center">
        <span className="inline-block font-mono text-[10px] tracking-[0.32em] uppercase text-[#C8A86B]">Acervo Histórico • 1980—2005</span>
        <h1 className="mt-3 font-display text-[26px] sm:text-[40px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#1E1D1A]">
          StoryBook<span className="font-serif italic font-light text-[#C8A86B]"> de</span> Fernando Quincas
        </h1>
        <p className="mt-3 font-serif text-[14px] sm:text-[16px] leading-6 sm:leading-7 text-[#2C2A26]/75 max-w-3xl mx-auto">
          51 páginas fotografadas do livro físico: feiras antigas, galpões do ateliê no Jaguari e esculturas gigantes em fibra de vidro. Toque e arraste para folhear — imagens preservadas sem distorção.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#8A82A5]">
          <span className="w-8 h-px bg-[#C8A86B]/30" aria-hidden />
          <span>Livro físico digitalizado • Edição única</span>
          <span className="w-8 h-px bg-[#C8A86B]/30" aria-hidden />
        </div>
      </section>

      <section aria-label="Livro 3D interativo" className="relative w-full max-w-[1080px] mx-auto px-3 sm:px-6 lg:px-8">
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/2.85] sm:aspect-[16/9.2] lg:aspect-[16/8.4] bg-[#F9F6F0] rounded-[18px] sm:rounded-[24px] border border-[#C8A86B]/12 shadow-[0_14px_36px_rgba(30,29,26,0.07),0_1px_0_rgba(200,168,107,0.10)] overflow-hidden select-none"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="application"
          aria-label="Livro 3D — arraste para folhear"
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" aria-hidden="true" />
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#F9F6F0]/85 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#C8A86B]/30 border-t-[#C8A86B] rounded-full animate-spin" aria-label="Carregando livro" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">Carregando StoryBook</span>
              </div>
            </div>
          )}
          {showHint && loaded && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-5 pointer-events-none">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1E1D1A]/88 text-[#FAF8F5] backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.18)]">
                <span className="w-2 h-2 rounded-full bg-[#C8A86B] animate-pulse" aria-hidden />
                <span className="font-mono text-[11px] tracking-widest uppercase">Deslize para folhear</span>
                <span className="hidden sm:inline font-serif italic text-xs opacity-70">• arraste ou use ← →</span>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-[#1E1D1A]/[0.045] to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(200,168,107,0.07)]" aria-hidden />
        </div>

        <div className="mt-4 sm:mt-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={goPrev} disabled={current === 0 || isDragging} aria-label="Página anterior" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#C8A86B]/25 bg-white hover:border-[#C8A86B] active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-all">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M10 12L6 8L10 4" stroke="#1E1D1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={goNext} disabled={current >= total - 1 || isDragging} aria-label="Próxima página" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#C8A86B]/25 bg-white hover:border-[#C8A86B] active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-all">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M6 4L10 8L6 12" stroke="#1E1D1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="ml-2 font-mono text-[11px] tracking-[0.22em] text-[#8A82A5] tabular-nums">{pageNum} / {totalNum}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#8A82A5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6A7D69] animate-pulse" aria-hidden />
            <span>Arraste • Toque • Teclado ← →</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C8A86B]/10 border border-[#C8A86B]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A86B]" aria-hidden />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">WebGL</span>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-[#EAE5D8] overflow-hidden" aria-hidden>
          <div className="h-full bg-[#C8A86B] transition-all duration-500 ease-out" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>
      </section>

      <article className="max-w-5xl mx-auto w-full px-6 sm:px-8 mt-10 sm:mt-12">
        <header className="border-t border-[#C8A86B]/15 pt-7">
          <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-[#1E1D1A]">Sobre este StoryBook — acervo histórico</h2>
          <p className="mt-3 font-sans text-[14px] leading-6 text-[#2C2A26]/75">
            O StoryBook reúne 51 fotografias do livro físico de Fernando Quincas, mestre em fibra de vidro há quatro décadas. Cada página foi fotografada e renomeada semanticamente para descoberta por Google, Bing e IAs. As imagens mostram feiras antigas, galpões do ateliê no Jaguari, transporte de esculturas gigantes, fontes e colunas, e obras como a Boneca Eva (45 m) e o Papai Noel gigante de Blumenau. Todas em <code className="px-1.5 py-0.5 rounded bg-[#F0ECE1] text-[12px]">/Book/nome-do-arquivo.jpg</code>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#1E1D1A] text-[#FAF8F5] font-mono text-[10px] tracking-widest uppercase">Escultor • Fernando Quincas</span>
            <span className="px-2.5 py-1 rounded-full border border-[#C8A86B]/20 bg-white font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">Fibra de vidro • Obras monumentais</span>
            <span className="px-2.5 py-1 rounded-full border border-[#C8A86B]/20 bg-white font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">Blumenau • Minas Gerais • Brasil</span>
          </div>
        </header>

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

        <section aria-label="Galeria indexável — todas as páginas do StoryBook" className="mt-10">
          <h3 className="font-display text-lg font-semibold text-[#1E1D1A]">Galeria indexável — 51 páginas</h3>
          <p className="mt-2 font-sans text-[13px] leading-6 text-[#2C2A26]/70">
            Cada imagem abaixo é a mesma do livro 3D, em HTML semântico para buscadores e IAs, com <code>alt</code>, <code>title</code>, <code>width/height</code> e <code>loading</code> otimizados — sem distorção.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {STORYBOOK_IMAGES.map((img, idx) => (
              <figure key={img.filename} id={`storybook-page-${idx + 1}`} className="group rounded-2xl overflow-hidden border border-[#C8A86B]/15 bg-white shadow-[0_8px_22px_rgba(30,29,26,0.06)] hover:shadow-[0_12px_30px_rgba(30,29,26,0.10)] transition-shadow">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Abrir ${img.caption} em tela cheia`}
                  className="relative aspect-[4/3] overflow-hidden bg-[#F0ECE1] w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A86B] focus-visible:ring-inset"
                >
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
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-[#1E1D1A]/0 group-hover:bg-[#1E1D1A]/12">
                    <span className="px-3 py-1.5 rounded-full bg-white/92 text-[#1E1D1A] font-mono text-[11px] tracking-widest uppercase shadow-sm">Toque para ampliar</span>
                  </span>
                </button>
                <figcaption className="px-4 py-3">
                  <h4 className="font-sans text-[12px] font-semibold leading-4 text-[#1E1D1A] line-clamp-2">{img.caption}</h4>
                  <p className="mt-1 font-serif italic text-xs leading-4 text-[#8A82A5] line-clamp-3">{img.description}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button onClick={() => setLightboxIndex(idx)} className="inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase text-[#1E1D1A] bg-[#F0ECE1] hover:bg-[#C8A86B]/20 px-2.5 py-1 rounded-full transition-colors">
                      Ampliar
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M3 7L7 3M7 3H4M7 3V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <a href={img.src} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase text-[#8A82A5] hover:text-[#C8A86B] transition-colors">
                      Original
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M3 7L7 3M7 3H4M7 3V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[#C8A86B]/12 bg-[#FDFCFB] p-6 sm:p-7">
          <h3 className="font-display text-base font-semibold text-[#1E1D1A]">O que este StoryBook documenta</h3>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 font-sans text-[13px] leading-6 text-[#2C2A26]/75 list-disc pl-5">
            <li><strong>Feiras antigas</strong> — vasos, colunas gregas e esculturas gigantes em fibra de vidro nos anos 1980–1990.</li>
            <li><strong>Galpões do ateliê</strong> — Jaguari, Serra dos Órgãos, moldes, laminação, pintura PU e pátina mineral.</li>
            <li><strong>Obras monumentais</strong> — Boneca Eva 45 m, Galinha de Monte Verde, Papai Noel gigante, cisnes, cavalinhos e grutas.</li>
            <li><strong>Paisagismo</strong> — fontes, cascatas, lagos ornamentais e jardins com esculturas.</li>
          </ul>
          <p className="mt-4 font-mono text-[11px] tracking-wide uppercase text-[#8A82A5]">Todas as páginas: public/Book • URLs públicas • Indexáveis • GEO ready</p>
        </section>
      </article>
      <div className="h-10 sm:h-14" aria-hidden />

      {/* Lightbox mobile-first — sempre com botão Voltar visível */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[80] bg-[#0F0E0D]/92 backdrop-blur-[6px] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ${String(lightboxIndex + 1).padStart(2, '0')} de ${String(total).padStart(2, '0')} ampliada`}
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxIndex(null); }}
        >
          {/* Header — Voltar sempre visível */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 shrink-0">
            <button
              onClick={() => setLightboxIndex(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#1E1D1A] font-mono text-[12px] tracking-[0.14em] uppercase shadow-[0_4px_16px_rgba(0,0,0,0.18)] active:scale-[0.98] transition-transform min-h-[44px] min-w-[88px] justify-center"
              aria-label="Voltar para galeria"
              autoFocus
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Voltar
            </button>
            <span className="font-mono text-[11px] tracking-[0.22em] text-white/75 tabular-nums">
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Fechar imagem ampliada"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/14 active:bg-white/20 text-white flex items-center justify-center border border-white/15 shrink-0 min-w-[44px] min-h-[44px] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Imagem — toque na imagem não fecha, apenas no fundo */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 overflow-auto gap-4">
            <img
              src={STORYBOOK_IMAGES[lightboxIndex].src}
              alt={STORYBOOK_IMAGES[lightboxIndex].alt}
              title={STORYBOOK_IMAGES[lightboxIndex].title}
              width={1600}
              height={1200}
              decoding="async"
              className="max-w-full max-h-[62vh] sm:max-h-[68vh] w-auto h-auto object-contain rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.45)] bg-white"
              draggable={false}
            />
            <div className="max-w-2xl w-full text-center px-2">
              <h3 className="font-sans text-[13px] sm:text-sm font-semibold leading-4 text-white">{STORYBOOK_IMAGES[lightboxIndex].caption}</h3>
              <p className="mt-1.5 font-serif italic text-xs sm:text-[13px] leading-5 text-white/68 line-clamp-3">{STORYBOOK_IMAGES[lightboxIndex].description}</p>
            </div>
          </div>

          {/* Footer — navegação com alvos mínimos 44px */}
          <div className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-white/10 shrink-0 bg-[#0F0E0D]/40">
            <button
              onClick={() => setLightboxIndex(i => i !== null ? Math.max(0, i - 1) : i)}
              disabled={lightboxIndex === 0}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-[#1E1D1A] disabled:opacity-30 disabled:cursor-not-allowed font-mono text-[11px] tracking-[0.16em] uppercase min-h-[44px] active:scale-[0.98] transition-transform"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="hidden sm:block"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Anterior
            </button>
            <a
              href={STORYBOOK_IMAGES[lightboxIndex].src}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase text-white/60 hover:text-white transition-colors px-2"
            >
              Abrir original
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M3 7L7 3M7 3H4M7 3V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <button
              onClick={() => setLightboxIndex(i => i !== null ? Math.min(total - 1, i + 1) : i)}
              disabled={lightboxIndex === total - 1}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#C8A86B] text-[#1E1D1A] disabled:opacity-30 disabled:cursor-not-allowed font-mono text-[11px] tracking-[0.16em] uppercase min-h-[44px] active:scale-[0.98] transition-transform"
            >
              Próxima
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="hidden sm:block"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default StoryBookPage;

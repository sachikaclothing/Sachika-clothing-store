import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sun, Moon, Eye, Camera } from 'lucide-react';

export default function ThreeDCanvas({ 
  product, 
  height = "520px", 
  interactive = true, 
  autoRotateDefault = true,
  showControls = true 
}) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
  const [lightingPreset, setLightingPreset] = useState('royal'); // 'royal', 'daylight', 'candle'
  const [activeColor, setActiveColor] = useState(product?.colorHex || '#c03d5d');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cameraAngle, setCameraAngle] = useState('front');

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const garmentMaterialsRef = useRef([]);
  const lightsRef = useRef({});
  const cameraRef = useRef(null);
  const mannequinGroupRef = useRef(null);

  // Update active color when product changes
  useEffect(() => {
    if (product?.colorHex) {
      setActiveColor(product.colorHex);
    }
  }, [product]);

  // Update materials when activeColor changes
  useEffect(() => {
    if (garmentMaterialsRef.current.length > 0) {
      const col = new THREE.Color(activeColor);
      garmentMaterialsRef.current.forEach(mat => {
        if (mat.name === 'garmentMain') {
          mat.color.copy(col);
        }
      });
    }
  }, [activeColor]);

  // Update lighting preset
  useEffect(() => {
    const { keyLight, fillLight, rimLight, ambientLight } = lightsRef.current;
    if (!keyLight || !fillLight || !rimLight || !ambientLight) return;

    if (lightingPreset === 'royal') {
      keyLight.color.setHex(0xfff1cf);
      keyLight.intensity = 2.2;
      fillLight.color.setHex(0xfce7f3);
      fillLight.intensity = 1.0;
      rimLight.color.setHex(0xd4af37);
      rimLight.intensity = 1.8;
      ambientLight.intensity = 0.9;
    } else if (lightingPreset === 'daylight') {
      keyLight.color.setHex(0xffffff);
      keyLight.intensity = 2.0;
      fillLight.color.setHex(0xe0f2fe);
      fillLight.intensity = 1.2;
      rimLight.color.setHex(0xffffff);
      rimLight.intensity = 1.2;
      ambientLight.intensity = 1.2;
    } else if (lightingPreset === 'candle') {
      keyLight.color.setHex(0xffa94d);
      keyLight.intensity = 2.5;
      fillLight.color.setHex(0x732338);
      fillLight.intensity = 0.8;
      rimLight.color.setHex(0xffd166);
      rimLight.intensity = 2.2;
      ambientLight.intensity = 0.6;
    }
  }, [lightingPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 400;
    const heightPx = container.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(42, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.3, 4.6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff1cf, 2.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfce7f3, 1.0);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    lightsRef.current = { keyLight, fillLight, rimLight, ambientLight };

    // SHOWROOM PEDESTAL
    const pedestalGroup = new THREE.Group();
    
    // Wooden circular platform
    const platformGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.14, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x24141E,
      roughness: 0.35,
      metalness: 0.1
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.25;
    platform.receiveShadow = true;
    pedestalGroup.add(platform);

    // Brass outer ring trim
    const ringGeo = new THREE.TorusGeometry(1.65, 0.03, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.18;
    pedestalGroup.add(ring);

    // Floor shadow soft circle
    const shadowGeo = new THREE.RingGeometry(0.1, 1.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = Math.PI / 2;
    shadowMesh.position.y = -1.24;
    pedestalGroup.add(shadowMesh);

    scene.add(pedestalGroup);

    // MANNEQUIN & GARMENT GROUP
    const mannequinGroup = new THREE.Group();
    mannequinGroupRef.current = mannequinGroup;
    scene.add(mannequinGroup);

    // Stand pole (brushed brass)
    const poleGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.5, 24);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      metalness: 0.8,
      roughness: 0.3
    });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = -0.5;
    mannequinGroup.add(pole);

    // Stand 3-prong base or round brass base
    const baseGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.08, 32);
    const baseMesh = new THREE.Mesh(baseGeo, poleMat);
    baseMesh.position.y = -1.18;
    mannequinGroup.add(baseMesh);

    // DRESS FORM BODY (Torso)
    const linenMat = new THREE.MeshStandardMaterial({
      color: 0xede4d3,
      roughness: 0.85,
      metalness: 0.05
    });

    // Neck finial (brushed brass top cap)
    const finialGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.14, 24);
    const finial = new THREE.Mesh(finialGeo, poleMat);
    finial.position.y = 1.38;
    mannequinGroup.add(finial);

    const finialTopGeo = new THREE.SphereGeometry(0.065, 24, 24);
    const finialTop = new THREE.Mesh(finialTopGeo, poleMat);
    finialTop.position.y = 1.48;
    mannequinGroup.add(finialTop);

    // Torso inner mannequin form
    const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.22, 24);
    const neck = new THREE.Mesh(neckGeo, linenMat);
    neck.position.y = 1.25;
    mannequinGroup.add(neck);

    // GARMENT CREATION
    garmentMaterialsRef.current = [];

    const garmentColor = new THREE.Color(activeColor);
    const goldColor = new THREE.Color(0xd4af37);

    // Silk / Chanderi physical material
    const silkMat = new THREE.MeshPhysicalMaterial({
      name: 'garmentMain',
      color: garmentColor,
      roughness: 0.42,
      metalness: 0.15,
      clearcoat: 0.3,
      clearcoatRoughness: 0.3,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xfff0f5),
      side: THREE.DoubleSide
    });
    garmentMaterialsRef.current.push(silkMat);

    // Gold zari embroidered trim material
    const goldZariMat = new THREE.MeshStandardMaterial({
      name: 'garmentTrim',
      color: goldColor,
      roughness: 0.25,
      metalness: 0.88
    });
    garmentMaterialsRef.current.push(goldZariMat);

    // 1. CHEST & BODICE
    const bodiceGeo = new THREE.CylinderGeometry(0.28, 0.23, 0.45, 32);
    const bodice = new THREE.Mesh(bodiceGeo, silkMat);
    bodice.position.y = 0.95;
    bodice.castShadow = true;
    mannequinGroup.add(bodice);

    // Bust shaping spheres for realistic ethnic tailoring silhouette
    const bustLeftGeo = new THREE.SphereGeometry(0.13, 24, 24);
    const bustLeft = new THREE.Mesh(bustLeftGeo, silkMat);
    bustLeft.position.set(0.11, 0.98, 0.13);
    bustLeft.scale.set(1.0, 1.1, 0.9);
    mannequinGroup.add(bustLeft);

    const bustRight = bustLeft.clone();
    bustRight.position.x = -0.11;
    mannequinGroup.add(bustRight);

    // Shoulder line
    const shoulderGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.18, 32);
    const shoulder = new THREE.Mesh(shoulderGeo, silkMat);
    shoulder.position.y = 1.14;
    shoulder.scale.set(1.05, 1.0, 0.65);
    mannequinGroup.add(shoulder);

    // Waist taper
    const waistGeo = new THREE.CylinderGeometry(0.22, 0.27, 0.35, 32);
    const waist = new THREE.Mesh(waistGeo, silkMat);
    waist.position.y = 0.62;
    waist.castShadow = true;
    mannequinGroup.add(waist);

    // Neckline embroidery / Gota Patti Yoke
    const yokeGeo = new THREE.TorusGeometry(0.16, 0.02, 16, 32);
    const yoke = new THREE.Mesh(yokeGeo, goldZariMat);
    yoke.rotation.x = Math.PI / 2.3;
    yoke.position.set(0, 1.12, 0.1);
    mannequinGroup.add(yoke);

    // Center vertical embroidered placket
    const placketGeo = new THREE.BoxGeometry(0.04, 0.38, 0.02);
    const placket = new THREE.Mesh(placketGeo, goldZariMat);
    placket.position.set(0, 0.88, 0.22);
    mannequinGroup.add(placket);

    // Mini decorative gold buttons on placket
    for (let i = 0; i < 4; i++) {
      const btnGeo = new THREE.SphereGeometry(0.012, 12, 12);
      const btn = new THREE.Mesh(btnGeo, goldZariMat);
      btn.position.set(0, 1.0 - i * 0.08, 0.235);
      mannequinGroup.add(btn);
    }

    // SLEEVES (Three-quarter tailored sleeves)
    const sleeveGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.58, 24);
    
    // Left Sleeve
    const sleeveLeft = new THREE.Mesh(sleeveGeo, silkMat);
    sleeveLeft.position.set(0.39, 0.86, 0.02);
    sleeveLeft.rotation.z = -0.32;
    mannequinGroup.add(sleeveLeft);

    const cuffLeftGeo = new THREE.TorusGeometry(0.08, 0.012, 16, 32);
    const cuffLeft = new THREE.Mesh(cuffLeftGeo, goldZariMat);
    cuffLeft.rotation.x = Math.PI / 2;
    cuffLeft.position.set(0.48, 0.61, 0.02);
    mannequinGroup.add(cuffLeft);

    // Right Sleeve
    const sleeveRight = new THREE.Mesh(sleeveGeo, silkMat);
    sleeveRight.position.set(-0.39, 0.86, 0.02);
    sleeveRight.rotation.z = 0.32;
    mannequinGroup.add(sleeveRight);

    const cuffRight = cuffLeft.clone();
    cuffRight.position.set(-0.48, 0.61, 0.02);
    mannequinGroup.add(cuffRight);

    // CATEGORY SPECIFIC GEOMETRY (Short Kurti vs Long Anarkali vs 3pc Suit)
    const category = product?.category || 'Short Kurti';
    const config = product?.model3DConfig || {};

    if (category === 'Short Kurti' || config.type === 'short_kurti') {
      // Flared Hip-Length Hem (29 inches)
      const skirtGeo = new THREE.CylinderGeometry(0.27, 0.44, 0.48, 36, 1, true);
      const skirt = new THREE.Mesh(skirtGeo, silkMat);
      skirt.position.y = 0.24;
      skirt.castShadow = true;
      mannequinGroup.add(skirt);

      // Gold bottom lace border
      const hemBorderGeo = new THREE.TorusGeometry(0.44, 0.015, 16, 48);
      const hemBorder = new THREE.Mesh(hemBorderGeo, goldZariMat);
      hemBorder.rotation.x = Math.PI / 2;
      hemBorder.position.y = 0.01;
      mannequinGroup.add(hemBorder);

      // Side Slits indication
      const slitLeftGeo = new THREE.BoxGeometry(0.015, 0.32, 0.02);
      const slitLeft = new THREE.Mesh(slitLeftGeo, goldZariMat);
      slitLeft.position.set(0.35, 0.18, 0);
      mannequinGroup.add(slitLeft);

      const slitRight = slitLeft.clone();
      slitRight.position.x = -0.35;
      mannequinGroup.add(slitRight);

    } else if (category === 'Long Kurti' || config.type === 'long_anarkali') {
      // 32-Kali Sweeping Flare down to -0.7
      const anarkaliGeo = new THREE.CylinderGeometry(0.27, 0.86, 1.15, 48, 1, true);
      const anarkali = new THREE.Mesh(anarkaliGeo, silkMat);
      anarkali.position.y = -0.12;
      anarkali.castShadow = true;
      mannequinGroup.add(anarkali);

      // Double heavy Banarasi zari border at hemline
      const zariBandGeo = new THREE.CylinderGeometry(0.84, 0.86, 0.16, 48, 1, true);
      const zariBand = new THREE.Mesh(zariBandGeo, goldZariMat);
      zariBand.position.y = -0.62;
      mannequinGroup.add(zariBand);

      const hemBorderGeo = new THREE.TorusGeometry(0.86, 0.02, 16, 48);
      const hemBorder = new THREE.Mesh(hemBorderGeo, goldZariMat);
      hemBorder.rotation.x = Math.PI / 2;
      hemBorder.position.y = -0.7;
      mannequinGroup.add(hemBorder);

    } else {
      // 3-PIECE SUIT (Kurti + Straight Silk Pants + Flowing Organza Dupatta)
      // Kurti Body down to knees
      const kurtiGeo = new THREE.CylinderGeometry(0.27, 0.46, 0.92, 36, 1, true);
      const kurti = new THREE.Mesh(kurtiGeo, silkMat);
      kurti.position.y = 0.02;
      kurti.castShadow = true;
      mannequinGroup.add(kurti);

      // Kurti hem border
      const hemBorder = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.015, 16, 48), goldZariMat);
      hemBorder.rotation.x = Math.PI / 2;
      hemBorder.position.y = -0.44;
      mannequinGroup.add(hemBorder);

      // Tailored Silk Pants (legs peeking below kurti down to -0.95)
      const pantsMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.secondaryColor || '#aa820a'),
        roughness: 0.5,
        metalness: 0.2
      });
      garmentMaterialsRef.current.push(pantsMat);

      const legGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.65, 24);
      const legLeft = new THREE.Mesh(legGeo, pantsMat);
      legLeft.position.set(0.12, -0.68, 0);
      mannequinGroup.add(legLeft);

      const legRight = legLeft.clone();
      legRight.position.x = -0.12;
      mannequinGroup.add(legRight);

      // FLOWING TRANSLUCENT ORGANZA DUPATTA DRAPE
      // Elegant curved curve draped from left shoulder across front to right hip & trailing down
      const dupattaMat = new THREE.MeshPhysicalMaterial({
        name: 'dupatta',
        color: new THREE.Color(config.secondaryColor || '#d4af37'),
        transparent: true,
        opacity: 0.85,
        roughness: 0.3,
        sheen: 1.0,
        sheenColor: new THREE.Color(0xffffff),
        side: THREE.DoubleSide
      });
      garmentMaterialsRef.current.push(dupattaMat);

      // Diagonal front sash
      const drapeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.35, 1.15, 0.15), // Left shoulder
        new THREE.Vector3(-0.15, 0.9, 0.28),  // Across bust
        new THREE.Vector3(0.15, 0.55, 0.28),  // Mid torso
        new THREE.Vector3(0.38, 0.15, 0.22),  // Right hip
        new THREE.Vector3(0.44, -0.45, 0.18)  // Trailing fall
      ]);
      const drapeGeo = new THREE.TubeGeometry(drapeCurve, 32, 0.11, 16, false);
      const dupatta = new THREE.Mesh(drapeGeo, dupattaMat);
      dupatta.scale.set(1.0, 1.0, 0.25); // flattened cloth fold appearance
      mannequinGroup.add(dupatta);

      // Back drape hanging from shoulder
      const backDrapeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.35, 1.15, 0.12),
        new THREE.Vector3(-0.38, 0.7, -0.15),
        new THREE.Vector3(-0.4, 0.1, -0.18),
        new THREE.Vector3(-0.42, -0.6, -0.16)
      ]);
      const backDrape = new THREE.Mesh(
        new THREE.TubeGeometry(backDrapeCurve, 24, 0.12, 16, false),
        dupattaMat
      );
      backDrape.scale.set(1.0, 1.0, 0.25);
      mannequinGroup.add(backDrape);
    }

    // INTERACTION HANDLING (Drag to Orbit, Wheel to Zoom)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handlePointerDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = {
        x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
        y: e.clientY || (e.touches && e.touches[0].clientY) || 0
      };
    };

    const handlePointerMove = (e) => {
      if (!isDragging || !interactive) return;
      const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = currentX - previousMousePosition.x;
      const deltaY = currentY - previousMousePosition.y;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.005;

      // Limit pitch
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));

      previousMousePosition = { x: currentX, y: currentY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);

    // ANIMATION LOOP
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate && !isDragging) {
        targetRotationY += 0.008;
      }

      // Smooth damping interpolation
      mannequinGroup.rotation.y += (targetRotationY - mannequinGroup.rotation.y) * 0.08;
      mannequinGroup.rotation.x += (targetRotationX - mannequinGroup.rotation.x) * 0.08;

      // Gentle breathing idle float
      const elapsed = clock.getElapsedTime();
      mannequinGroup.position.y = Math.sin(elapsed * 1.5) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handlePointerDown);
      domElement.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product, interactive]);

  // Adjust zoom
  const handleZoom = (factor) => {
    if (!cameraRef.current) return;
    const newZ = cameraRef.current.position.z * factor;
    if (newZ >= 2.2 && newZ <= 6.5) {
      cameraRef.current.position.z = newZ;
      setZoomLevel(Math.round((4.6 / newZ) * 100) / 100);
    }
  };

  // Adjust camera angle view
  const setAngle = (angle) => {
    setCameraAngle(angle);
    if (!mannequinGroupRef.current) return;
    if (angle === 'front') {
      mannequinGroupRef.current.rotation.y = 0;
    } else if (angle === 'side') {
      mannequinGroupRef.current.rotation.y = Math.PI / 2;
    } else if (angle === 'back') {
      mannequinGroupRef.current.rotation.y = Math.PI;
    } else if (angle === 'detail') {
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 1.0, 2.5); // close up on neckline & embroidery
      }
    }
  };

  const handleTakeSnapshot = () => {
    if (!rendererRef.current) return;
    try {
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${product?.name || 'ethnic-outfit'}-3d-look.png`;
      a.click();
    } catch (e) {
      console.error('Snapshot error', e);
    }
  };

  const samplePalette = [
    { name: 'Ruby Wine', hex: '#c03d5d' },
    { name: 'Imperial Maroon', hex: '#732338' },
    { name: 'Royal Peacock', hex: '#1a365d' },
    { name: 'Emerald Forest', hex: '#14532d' },
    { name: 'Haldi Gold', hex: '#b8860b' },
    { name: 'Pastel Lilac', hex: '#7b68ee' }
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#1b0a2a] via-[#160824] to-[#0d0416] border border-amber-500/20 shadow-2xl flex flex-col items-center">
      
      {/* 3D Canvas Mount */}
      <div 
        ref={mountRef} 
        style={{ height, width: '100%' }}
        className="cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating 3D Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Live 360° 3D Mannequin</span>
      </div>

      {/* Drag Hint */}
      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white/80 text-[11px] font-medium border border-white/10 flex items-center gap-1.5 pointer-events-none">
        <RotateCw className="w-3 h-3 text-amber-400" />
        <span>Drag to rotate • Pinch to zoom</span>
      </div>

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-3 inset-x-3 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
          
          {/* Angle buttons */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
            <button 
              onClick={() => setAngle('front')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${cameraAngle === 'front' ? 'bg-amber-500 text-black shadow' : 'hover:bg-white/10 text-white/80'}`}
            >
              Front
            </button>
            <button 
              onClick={() => setAngle('side')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${cameraAngle === 'side' ? 'bg-amber-500 text-black shadow' : 'hover:bg-white/10 text-white/80'}`}
            >
              Side
            </button>
            <button 
              onClick={() => setAngle('back')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${cameraAngle === 'back' ? 'bg-amber-500 text-black shadow' : 'hover:bg-white/10 text-white/80'}`}
            >
              Back
            </button>
            <button 
              onClick={() => setAngle('detail')}
              className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 ${cameraAngle === 'detail' ? 'bg-amber-500 text-black shadow' : 'hover:bg-white/10 text-white/80'}`}
              title="Close-up Embroidery Detail"
            >
              <Eye className="w-3 h-3" />
              <span>Detail</span>
            </button>
          </div>

          {/* Colorway Switcher Preview */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-amber-200/80 mr-1 hidden sm:inline">Color Silk:</span>
            {samplePalette.map((c) => (
              <button
                key={c.hex}
                onClick={() => setActiveColor(c.hex)}
                title={c.name}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${activeColor === c.hex ? 'border-amber-400 scale-125 ring-2 ring-amber-400/40' : 'border-white/30 hover:scale-110'}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Lighting & Rotation Controls */}
          <div className="flex items-center gap-2">
            {/* Lighting Modes */}
            <div className="flex items-center bg-white/10 p-1 rounded-lg">
              <button 
                onClick={() => setLightingPreset('royal')}
                title="Royal Boutique Glow"
                className={`p-1 rounded ${lightingPreset === 'royal' ? 'bg-amber-500 text-black' : 'text-white/70 hover:text-white'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setLightingPreset('daylight')}
                title="Bright Daylight"
                className={`p-1 rounded ${lightingPreset === 'daylight' ? 'bg-amber-500 text-black' : 'text-white/70 hover:text-white'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setLightingPreset('candle')}
                title="Warm Festive Ambient"
                className={`p-1 rounded ${lightingPreset === 'candle' ? 'bg-amber-500 text-black' : 'text-white/70 hover:text-white'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Auto-rotate Toggle */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? "Pause 360 Spin" : "Start 360 Spin"}
              className={`p-1.5 rounded-lg border transition ${autoRotate ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-white/10 border-white/20 text-white/70 hover:text-white'}`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </button>

            {/* Zoom In/Out */}
            <div className="flex items-center bg-white/10 rounded-lg overflow-hidden border border-white/10">
              <button 
                onClick={() => handleZoom(0.85)} 
                className="p-1.5 hover:bg-white/20 text-white/80 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleZoom(1.18)} 
                className="p-1.5 hover:bg-white/20 text-white/80 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Snapshot Capture */}
            <button
              onClick={handleTakeSnapshot}
              title="Save 3D Photo to Share"
              className="p-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

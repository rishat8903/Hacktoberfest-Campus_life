import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Bus,
  FileText,
  HeartPulse,
  Radio,
  Layers,
} from 'lucide-react';
import { ActiveTab, Language } from '../types/campus';

interface Campus3DHeroProps {
  activeTab: ActiveTab;
  onNavigateTab: (tab: ActiveTab) => void;
  language: Language;
}

export const Campus3DHero: React.FC<Campus3DHeroProps> = ({
  activeTab,
  onNavigateTab,
  language,
}) => {
  const isBn = language === 'bn';
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = mountRef.current;
    if (!canvas || !container || isMinimized) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight || 200;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Core 3D Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Glowing Geometric Core (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0x044e33,
      emissiveIntensity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // 2. Outer Faceted Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // 3. Dual Gyroscopic Orbit Rings
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.025, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x312e81,
      emissiveIntensity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.5, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x78350f,
      emissiveIntensity: 0.3,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 4. 4 Satellite Node Spheres (representing the 4 campus modules)
    const satellites: THREE.Mesh[] = [];
    const colors = [0x10b981, 0xf59e0b, 0x3b82f6, 0xf43f5e];
    for (let i = 0; i < 4; i++) {
      const satGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satellites.push(satMesh);
      scene.add(satMesh);
    }

    // 5. Floating Star Particles Field
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xa7f3d0,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x6366f1, 2.0);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    // Mouse interaction for smooth parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.0;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Rotate central core
      coreMesh.rotation.y = elapsedTime * 0.4 + mouseX;
      coreMesh.rotation.x = elapsedTime * 0.25 - mouseY;

      cageMesh.rotation.y = -elapsedTime * 0.35 + mouseX;
      cageMesh.rotation.z = elapsedTime * 0.2;

      // Spin orbital rings
      ring1.rotation.z = elapsedTime * 0.5;
      ring2.rotation.z = -elapsedTime * 0.4;

      // Move satellites in smooth orbits around the core
      for (let i = 0; i < satellites.length; i++) {
        const angle = elapsedTime * 0.8 + (i * Math.PI) / 2;
        const radius = 2.2 + (i % 2) * 0.4;
        satellites[i].position.x = Math.cos(angle) * radius;
        satellites[i].position.y = Math.sin(angle * 1.2) * (1.1 + (i % 2) * 0.3);
        satellites[i].position.z = Math.sin(angle) * radius;
      }

      // Slowly drift starfield
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = elapsedTime * 0.02;

      camera.position.x = mouseX * 0.6;
      camera.position.y = -mouseY * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 200;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [isMinimized]);

  return (
    <div className="relative mb-5 no-print">
      <div
        ref={mountRef}
        className={`relative overflow-hidden rounded-3xl transition-all duration-300 border border-slate-800/80 shadow-lg ${
          isMinimized
            ? 'h-14 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 px-5 flex items-center justify-between border-emerald-900/40'
            : 'h-48 sm:h-52 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white p-5 sm:p-6 border-emerald-800/40'
        }`}
      >
        {/* Background Canvas for Three.js 3D Interactive Core */}
        {!isMinimized && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block opacity-85" />
          </div>
        )}

        {/* Ambient subtle blur glow */}
        <div className="absolute -top-12 right-1/4 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-52 h-52 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Minimized Bar State */}
        {isMinimized ? (
          <div className="w-full flex items-center justify-between z-10 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-white font-display">
                IIUC CampusMate • Academic & Student Services
              </span>
            </div>

            <button
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition cursor-pointer"
            >
              <span>Show 3D View</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Expanded Interactive 3D Hero Layout */
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top row: Pill badge & Minimize toggle */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 backdrop-blur-md border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>IIUC Kumira Campus • Academic & Student Life Services</span>
              </div>

              <button
                onClick={() => setIsMinimized(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-medium text-slate-300 transition cursor-pointer"
                title="Collapse Banner"
              >
                <span>Minimize</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Middle: Clean typography */}
            <div className="max-w-xl">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display leading-tight">
                {isBn ? 'আইআইইউসি কুমিরা ক্যাম্পাস ডেইলি পোর্টাল' : 'IIUC Kumira Campus Academic Portal'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 line-clamp-2 leading-relaxed">
                {isBn
                  ? 'লেকচার নোট থেকে কুইজ, কুমিরা বাস শিডিউল, A4 ল্যাব কভার ও ছুটির দরখাস্ত এবং মানসিক স্বাস্থ্য পরামর্শ।'
                  : 'Study notes to quiz, live Kumira bus timetable, 1-click A4 lab covers & leave letters, and confidential student support.'}
              </p>
            </div>

            {/* Bottom: 4 Interactive Pillar Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                {
                  id: 'study' as ActiveTab,
                  label: 'Study Hub & Quiz',
                  icon: BookOpen,
                  color: 'hover:border-emerald-400 text-emerald-300',
                },
                {
                  id: 'bus' as ActiveTab,
                  label: 'Kumira Bus Navigator',
                  icon: Bus,
                  color: 'hover:border-amber-400 text-amber-300',
                },
                {
                  id: 'notices' as ActiveTab,
                  label: 'Lab Cover & Leave Gen',
                  icon: FileText,
                  color: 'hover:border-blue-400 text-blue-300',
                },
                {
                  id: 'wellbeing' as ActiveTab,
                  label: 'Care & Mental Health AI',
                  icon: HeartPulse,
                  color: 'hover:border-rose-400 text-rose-300',
                },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = activeTab === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => onNavigateTab(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-900 font-bold shadow-md scale-105'
                        : `bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10 ${p.color}`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

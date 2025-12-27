"use client";

import React, { useState, useEffect, Suspense, useLayoutEffect } from "react";
import { Menu, ArrowRight, Droplets } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Float,
  PresentationControls,
  ContactShadows,
  Center,
} from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  [key: string]: any;
}

const Model: React.FC<ModelProps> = (props) => {
  const { scene } = useGLTF("/serum.glb");

  useLayoutEffect(() => {
    scene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.frustumCulled = false;

        if (mesh.material && !Array.isArray(mesh.material)) {
            const material = mesh.material as THREE.MeshStandardMaterial;

            if (material.map) {
              material.map.anisotropy = 16;
            }

            const isGlass =
              material.name.toLowerCase().includes("glass") ||
              mesh.name.toLowerCase().includes("body") ||
              mesh.name.toLowerCase().includes("glass");

            if (isGlass) {
              material.transparent = true;
              material.opacity = 0.6;
              material.color.set("#FFE4E6"); // Baby Pink Tint
              material.roughness = 0.1; // Ensure it stays glossy
              material.needsUpdate = true;
            }
        }
      }
    });
  }, [scene]);

  return (
    <Center>
      <primitive object={scene} {...props} />
    </Center>
  );
};

useGLTF.preload("/serum.glb");

const App: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1C1C1E] selection:bg-[#FF0055] selection:text-white font-sans overflow-x-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400&family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&display=swap');
          
          .font-fraunces { font-family: 'Fraunces', serif; }
          .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
          
          /* Custom Grid Pattern for Background */
          .bg-grid-pattern {
            background-image: linear-gradient(#1C1C1E 0.5px, transparent 0.5px), linear-gradient(90deg, #1C1C1E 0.5px, transparent 0.5px);
            background-size: 40px 40px;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
        `}
      </style>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

        <div
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#FFD6D6] rounded-full blur-[120px] opacity-40 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)`,
          }}
        />

        <div
          className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-[#FF0055] rounded-full blur-[150px] opacity-[0.08] transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 transition-all duration-300 ${
          scrolled
            ? "bg-[#FBFBFB]/80 backdrop-blur-md border-b border-[#1C1C1E]/5"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center group cursor-pointer">
          <img
            src="/AetherLogo.png"
            alt="Aether Skincare"
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 font-jetbrains text-xs tracking-widest">
          {["FORMULATIONS", "PHILOSOPHY", "JOURNAL"].map((item) => (
            <a key={item} href="#" className="relative group">
              <span className="group-hover:text-[#FF0055] transition-colors">
                {item}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#FF0055] transition-all group-hover:w-full"></span>
            </a>
          ))}
          <button className="px-6 py-2 border border-[#1C1C1E] hover:bg-[#1C1C1E] hover:text-white transition-all duration-300">
            [ SHOP ]
          </button>
        </div>

        <button className="md:hidden">
          <Menu strokeWidth={1} />
        </button>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 container mx-auto min-h-screen flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 mb-16 lg:mb-0 relative">
          <div className="inline-flex items-center gap-3 mb-8 border-l border-[#FF0055] pl-4">
            <span className="font-jetbrains text-[10px] uppercase tracking-[0.2em] text-[#1C1C1E]/60">
              Serum_04 // Barrier Support
            </span>
          </div>

          <h1 className="font-fraunces text-6xl md:text-8xl leading-[0.9] mb-8 text-[#1C1C1E]">
            The{" "}
            <span className="italic font-light text-[#FF0055]">Chemistry</span>
            <br />
            of <span className="font-normal">Resilience.</span>
          </h1>

          <p className="font-jetbrains text-sm leading-relaxed text-[#1C1C1E]/70 max-w-md mb-12 border-l border-[#1C1C1E]/20 pl-6 ml-2">
            This is not a moisturizer; it is a structural intervention.
            Formulated with 5.0% Niacinamide and bio-identical lipids to
            engineer defense against environmental stress.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <button className="group relative px-8 py-4 bg-[#1C1C1E] text-white font-jetbrains text-xs tracking-widest overflow-hidden">
              <span className="relative z-10 group-hover:text-[#1C1C1E] transition-colors duration-300 flex items-center gap-2">
                INITIATE PROTOCOL <ArrowRight size={14} />
              </span>
              <div className="absolute inset-0 bg-[#FF0055] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>

            <button className="group px-8 py-4 border border-[#1C1C1E] text-[#1C1C1E] font-jetbrains text-xs tracking-widest hover:bg-[#F3F4F6] transition-colors flex items-center gap-2">
              <Droplets
                size={14}
                className="group-hover:text-[#FF0055] transition-colors"
              />
              VIEW FULL INGREDIENTS
            </button>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-8 border-t border-[#1C1C1E]/10 pt-8 max-w-lg">
            {[
              { label: "NIACINAMIDE", val: "5.0%" },
              { label: "CERAMIDE NP", val: "2.5%" },
              { label: "pH LEVEL", val: "5.5" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-fraunces text-2xl md:text-3xl text-[#1C1C1E] mb-1">
                  {stat.val}
                </div>
                <div className="font-jetbrains text-[9px] uppercase tracking-widest text-[#1C1C1E]/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center h-[600px] relative">
          <div className="w-full h-full relative z-20">
            <Canvas camera={{ position: [0, 0, 8], fov: 40 }} dpr={[1, 2]}>
              <ambientLight intensity={0.5} />
              <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1}
              />
              <Environment preset="studio" />{" "}
              <PresentationControls
                global={true}
                rotation={[0, 0.3, 0]}
                polar={[-Infinity, Infinity]}
                azimuth={[-Infinity, Infinity]}
              >
                <Float
                  rotationIntensity={0.4}
                  floatIntensity={1}
                  floatingRange={[-0.2, 0.2]}
                >
                  <Suspense fallback={null}>
                    <Model scale={1.0} position={[0, -0.5, 0]} />
                  </Suspense>
                </Float>
              </PresentationControls>
              {/* Soft Contact Shadow */}
              <ContactShadows
                position={[0, -2.5, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4}
                color="#FF0055"
              />
            </Canvas>
          </div>

          <div className="absolute top-[15%] left-[10%] w-4 h-4 border-l border-t border-[#1C1C1E]/30 pointer-events-none"></div>
          <div className="absolute bottom-[15%] right-[10%] w-4 h-4 border-r border-b border-[#1C1C1E]/30 pointer-events-none"></div>

          <div className="absolute top-[35%] right-[5%] lg:right-[10%] flex items-center gap-2 pointer-events-none">
            <div className="w-12 h-[1px] bg-[#1C1C1E]/30"></div>
            <span className="font-jetbrains text-[9px] text-[#1C1C1E]/60 tracking-widest">
              3D_MODEL_VIEW
            </span>
          </div>

          <div className="absolute inset-[10%] bg-white/40 backdrop-blur-[2px] -z-10 rounded-[40px] border border-white/50 shadow-xl transform rotate-[-3deg] scale-90 pointer-events-none"></div>
        </div>
      </main>

      <div className="border-y border-[#1C1C1E]/5 py-4 bg-white overflow-hidden relative">
        <div className="flex gap-12 animate-marquee whitespace-nowrap opacity-60">
          {Array(10)
            .fill("HYALURONIC_ACID // NIACINAMIDE // CERAMIDE_NP // ")
            .map((text, i) => (
              <span key={i} className="font-jetbrains text-xs tracking-[0.2em]">
                {text}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
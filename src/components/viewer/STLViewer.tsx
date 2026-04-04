'use client';

import { useMemo, useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
  Stage,
  Bounds,
  useBounds,
  ContactShadows,
  Environment
} from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { Html } from '@react-three/drei';
import { HoleFeature, BendFeature } from '@/types/viewer';

/**
 * Handle type for imperatively controlling the viewer
 */
export interface STLViewerHandle {
  resetView: () => void;
  setOrientation: (view: 'top' | 'front' | 'side' | 'iso') => void;
  zoom: (delta: number) => void;
  setZoom: (value: number) => void;
  setMode: (mode: '2D' | '3D') => void;
}

interface STLModelProps {
  buffer: ArrayBuffer;
  color?: string;
  finishType?: 'anodizing' | 'powder_coating' | 'raw';
  serviceMode?: 'none' | 'tapping' | 'bending' | 'countersink' | 'engraving';
}

function STLModel({
  buffer,
  color = '#94a3b8',
  finishType = 'raw',
  viewMode,
  serviceMode = 'none'
}: STLModelProps & { viewMode: '2D' | '3D' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const opacityRef = useRef(0.94);
  const isTechnical = serviceMode !== 'none';

  // Animation & Material Lerping
  useFrame((state, delta) => {
    const targetOpacity = isTechnical ? 0.15 : 0.94;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, delta * 10);

    if (meshRef.current) {
      if (Array.isArray(meshRef.current.material)) {
        meshRef.current.material.forEach(m => {
          m.opacity = opacityRef.current;
          m.transparent = true;
          m.depthWrite = !isTechnical;
          // In technical mode, we want subtle phong shading even for ghosting
          if (isTechnical && m instanceof THREE.MeshPhongMaterial) {
            m.shininess = 30;
            m.specular = new THREE.Color(0xffffff);
          }
        });
      } else {
        meshRef.current.material.opacity = opacityRef.current;
        meshRef.current.material.transparent = true;
        meshRef.current.material.depthWrite = !isTechnical;
        if (isTechnical && meshRef.current.material instanceof THREE.MeshPhongMaterial) {
          meshRef.current.material.shininess = 30;
          meshRef.current.material.specular = new THREE.Color(0xffffff);
        }
      }
      meshRef.current.renderOrder = 0;
    }

    if (edgesRef.current) {
      const edgeMat = edgesRef.current.material as THREE.LineBasicMaterial;
      edgeMat.opacity = isTechnical ? 0.75 : 0;
      edgesRef.current.visible = isTechnical;
    }
  });

  const geometry = useMemo(() => {
    const loader = new STLLoader();
    const geo = loader.parse(buffer);
    geo.computeBoundingBox();
    geo.center();
    return geo;
  }, [buffer]);

  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry, 25), [geometry]);

  // Clean up geometries
  useEffect(() => {
    return () => {
      edgesGeometry.dispose();
    };
  }, [edgesGeometry]);

  const roughness = finishType === 'anodizing' ? 0.35 : finishType === 'powder_coating' ? 0.8 : 0.45;
  const metalness = finishType === 'powder_coating' ? 0.1 : 0.85;

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} castShadow={!isTechnical} receiveShadow={!isTechnical}>
        {isTechnical ? (
          <meshPhongMaterial
            color={0xeeeeee}
            transparent
            opacity={0.15}
            shininess={30}
            specular={new THREE.Color(0xffffff)}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={2}
            polygonOffsetUnits={1}
          />
        ) : viewMode === '2D' ? (
          <meshBasicMaterial color="#334155" />
        ) : (
          <meshStandardMaterial
            color={color}
            roughness={roughness}
            metalness={metalness}
            envMapIntensity={finishType === 'anodizing' ? 1.5 : 1}
            transparent={finishType !== 'raw'}
            opacity={opacityRef.current}
          />
        )}
      </mesh>

      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color={0x2a2a2a} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

function HoleOverlays({ holes, hoveredIndex, isTechnical }: { holes: HoleFeature[], hoveredIndex?: number, isTechnical?: boolean }) {
  return (
    <>
      {holes.map((hole, idx) => {
        const isHovered = hoveredIndex === idx;

        const cylinderDir = new THREE.Vector3(0, 1, 0);
        const holeNormal = new THREE.Vector3(hole.normal.x, hole.normal.y, hole.normal.z);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(cylinderDir, holeNormal);

        return (
          <group key={idx} position={[hole.center.x, hole.center.y, hole.center.z]} renderOrder={10}>
            <group quaternion={quaternion}>
              {/* Main Hole Cylinder */}
              <mesh renderOrder={999}>
                <cylinderGeometry args={[hole.radius, hole.radius, hole.depth, 32]} />
                <meshStandardMaterial
                  color={isHovered ? "#3b82f6" : (isTechnical ? "#000000" : "#22d3ee")}
                  transparent={!isTechnical}
                  opacity={1}
                  roughness={0.9}
                  metalness={0.1}
                  side={THREE.DoubleSide}
                  depthTest={false}
                />
              </mesh>
            </group>

            {isHovered && (
              <Html distanceFactor={10}>
                <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-blue-500/50 shadow-xl shadow-blue-500/20 whitespace-nowrap pointer-events-none select-none animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-[9px] font-black uppercase tracking-tighter leading-none">Detected Hole {idx + 1}</p>
                  </div>
                  <p className="text-[11px] font-mono font-bold">Ø {(hole.radius * 2).toFixed(2)}mm × {hole.depth.toFixed(1)}mm</p>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

function BendOverlays({ bends }: { bends: BendFeature[] }) {
  return (
    <>
      {bends.map((bend, idx) => {
        const start = new THREE.Vector3(bend.start.x, bend.start.y, bend.start.z);
        const end = new THREE.Vector3(bend.end.x, bend.end.y, bend.end.z);

        return (
          <group key={idx} renderOrder={20}>
            {/* The Bend Axis Line */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([...start.toArray(), ...end.toArray()]), 3]}
                />
              </bufferGeometry>
              <lineDashedMaterial
                color="#f59e0b"
                dashSize={1}
                gapSize={0.5}
                linewidth={3}
                transparent
                opacity={0.9}
                depthTest={false}
              />
            </line>

            {/* Optional: Glow effect for bend lines */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([...start.toArray(), ...end.toArray()]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color="#fbbf24"
                transparent
                opacity={0.3}
                depthTest={false}
              />
            </line>
          </group>
        );
      })}
    </>
  );
}

/**
 * Internal component to handle camera logic within the Canvas
 */
function ViewHandler({
  onMount,
  orthographic,
  viewMode,
  serviceMode
}: {
  onMount: (handle: STLViewerHandle) => void,
  orthographic: boolean,
  viewMode: '2D' | '3D',
  serviceMode?: string
}) {
  const { camera, controls } = useThree();
  const bounds = useBounds();

  const resetView = useCallback(() => {
    bounds.refresh().clip().fit();
  }, [bounds]);

  const setOrientation = useCallback((view: 'top' | 'front' | 'side' | 'iso') => {
    const distance = 5; // Default distance

    // We'll reset first to ensure we have clear bounds
    bounds.refresh().clip().fit();

    switch (view) {
      case 'top':
        camera.position.set(0, distance, 0);
        break;
      case 'front':
        camera.position.set(0, 0, distance);
        break;
      case 'side':
        camera.position.set(distance, 0, 0);
        break;
      case 'iso':
        camera.position.set(distance, distance, distance);
        break;
    }

    camera.lookAt(0, 0, 0);
    if (controls) {
      // @ts-ignore
      controls.target.set(0, 0, 0);
      // @ts-ignore
      controls.update();
    }
  }, [camera, controls, bounds]);

  const zoom = useCallback((delta: number) => {
    const factor = delta > 0 ? 0.9 : 1.1;
    camera.position.multiplyScalar(factor);
    camera.updateProjectionMatrix();
  }, [camera]);

  const setZoom = useCallback((value: number) => {
    // We'll treat 0-1 as a scale between a "near" and "far" position
    const minDistance = 1;
    const maxDistance = 15;
    const targetDistance = maxDistance - (value * (maxDistance - minDistance));

    const direction = camera.position.clone().normalize();
    camera.position.copy(direction.multiplyScalar(targetDistance));
    camera.updateProjectionMatrix();
  }, [camera]);

  // Handle technical mode transition
  useEffect(() => {
    if (serviceMode && serviceMode !== 'none') {
      setOrientation('iso');
      // If camera is orthographic, adjust zoom
      if (orthographic && camera instanceof THREE.OrthographicCamera) {
        bounds.refresh().clip().fit();
      }
    }
  }, [serviceMode, setOrientation, orthographic, camera, bounds]);

  // Handle mode transitions
  useEffect(() => {
    if (viewMode === '2D') {
      setOrientation('top');
      camera.lookAt(0, 0, 0);
    }
  }, [viewMode, setOrientation, camera]);

  useEffect(() => {
    onMount({ resetView, setOrientation, zoom, setZoom, setMode: () => { } });
  }, [onMount, resetView, setOrientation, zoom, setZoom]);

  return null;
}

interface STLViewerProps {
  buffer: ArrayBuffer;
  className?: string;
  onCameraChange?: (camera: THREE.Camera) => void;
  orthographic?: boolean;
  initialMode?: '2D' | '3D';
  color?: string;
  finishType?: 'anodizing' | 'powder_coating' | 'raw';
  holes?: HoleFeature[];
  bends?: BendFeature[];
  showHoles?: boolean;
  showBends?: boolean;
  hoveredHoleIndex?: number;
  serviceMode?: 'none' | 'tapping' | 'bending' | 'countersink' | 'engraving';
}

/**
 * 3D Canvas for viewing STL models.
 */
export const STLViewer = forwardRef<STLViewerHandle, STLViewerProps>(
  ({
    buffer,
    className,
    orthographic = false,
    initialMode = '3D',
    color,
    finishType,
    holes = [],
    bends = [],
    showHoles = true,
    showBends = true,
    hoveredHoleIndex,
    serviceMode = 'none'
  }, ref) => {
    const [viewMode, setViewMode] = useState<'2D' | '3D'>(initialMode);
    const [viewHandle, setViewHandle] = useState<STLViewerHandle | null>(null);

    useImperativeHandle(ref, () => ({
      resetView: () => viewHandle?.resetView(),
      setOrientation: (view) => viewHandle?.setOrientation(view),
      zoom: (delta) => viewHandle?.zoom(delta),
      setZoom: (value) => viewHandle?.setZoom(value),
      setMode: (mode) => setViewMode(mode)
    }), [viewHandle]);

    return (
      <div className={`relative bg-white rounded-xl overflow-hidden group ${className}`}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor('#ffffff');
          }}
        >
          <color attach="background" args={['#ffffff']} />

          {(viewMode === '2D' || serviceMode !== 'none') ? (
            <OrthographicCamera
              makeDefault
              position={[0, 10, 0]}
              zoom={50}
              up={[0, 0, -1]}
            />
          ) : (
            <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={45} />
          )}

          <ambientLight intensity={serviceMode !== 'none' ? 0.4 : 0.7} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={serviceMode !== 'none' ? 1.0 : 1}
            castShadow={serviceMode === 'none'}
          />

          <Stage
            intensity={viewMode === '2D' ? 1 : 0.4}
            environment={viewMode === '2D' || serviceMode !== 'none' ? undefined : "city"}
            adjustCamera={false}
            shadows={viewMode === '2D' || serviceMode !== 'none' ? false : { type: 'contact', opacity: 0.15, blur: 3 }}
          >
            <Bounds fit clip observe margin={1.2}>
              <STLModel
                buffer={buffer}
                viewMode={viewMode}
                color={color}
                finishType={finishType}
                serviceMode={serviceMode}
              />
              {showHoles && <HoleOverlays holes={holes} hoveredIndex={hoveredHoleIndex} isTechnical={serviceMode !== 'none'} />}
              {showBends && <BendOverlays bends={bends} />}
              <ViewHandler
                onMount={setViewHandle}
                orthographic={viewMode === '2D' || serviceMode !== 'none'}
                viewMode={viewMode}
                serviceMode={serviceMode}
              />
            </Bounds>
          </Stage>

          <OrbitControls
            makeDefault
            minPolarAngle={viewMode === '2D' ? 0 : 0}
            maxPolarAngle={viewMode === '2D' ? 0 : Math.PI}
            enableRotate={viewMode === '3D'}
            enableDamping
            dampingFactor={0.1}
            rotateSpeed={0.5}
          />

          {viewMode === '3D' && serviceMode === 'none' && (
            <ContactShadows
              resolution={1024}
              scale={15}
              blur={2.5}
              opacity={0.2}
              far={10}
              color="#000000"
            />
          )}

          {viewMode === '3D' && serviceMode === 'none' && <Environment preset="city" />}
        </Canvas>

        {serviceMode !== 'none' && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-[#2F5FA7] border px-3 py-1.5 rounded-lg border-[#2F5FA7] shadow-lg shadow-blue-500/20 translate-y-[-2px]">
              <p className="text-[10px] font-mono font-black text-white uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Service: {serviceMode}
              </p>
            </div>
          </div>
        )}

        {/* Technical Orientation Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className="flex flex-col bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <button
              onClick={() => viewHandle?.setOrientation('top')}
              className="px-3 py-2 hover:bg-blue-50 text-[9px] font-black text-slate-400 hover:text-[#2F5FA7] transition-colors border-b border-slate-100"
            >
              TOP
            </button>
            <button
              onClick={() => viewHandle?.setOrientation('iso')}
              className="px-3 py-2 hover:bg-blue-50 text-[9px] font-black text-slate-400 hover:text-[#2F5FA7] transition-colors"
            >
              ISO
            </button>
          </div>
        </div>

        {/* Focus Indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2F5FA7] animate-pulse" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live 3D Geometry</span>
        </div>
      </div>
    );
  }
);

STLViewer.displayName = 'STLViewer';

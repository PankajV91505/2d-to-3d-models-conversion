import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center, useGLTF } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useLoader } from "@react-three/fiber";
import { RotateCcw, Download, AlertCircle, Box } from "lucide-react";

function GLBModel({ url }) {
    const { scene } = useGLTF(url);
    return (
        <Center>
            <primitive object={scene} scale={2} />
        </Center>
    );
}

function OBJModel({ url }) {
    const obj = useLoader(OBJLoader, url);
    return (
        <Center>
            <primitive object={obj} scale={2} />
        </Center>
    );
}

function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#6366f1" wireframe />
        </mesh>
    );
}

function ModelScene({ url, isOBJ }) {
    return (
        <Suspense fallback={<LoadingFallback />}>
            {isOBJ ? <OBJModel url={url} /> : <GLBModel url={url} />}
            <Environment preset="city" />
        </Suspense>
    );
}

export default function ModelViewer({ modelUrl }) {
    const controlsRef = useRef();
    const [error, setError] = useState(null);

    const isOBJ = modelUrl && (modelUrl.endsWith(".obj") || modelUrl.endsWith(".OBJ"));

    useEffect(() => {
        setError(null);
    }, [modelUrl]);

    const resetCamera = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    const downloadModel = () => {
        if (modelUrl) {
            const ext = modelUrl.split(".").pop() || "glb";
            const a = document.createElement("a");
            a.href = modelUrl;
            a.download = `3dforge-model.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    if (!modelUrl) {
        return (
            <div className="aspect-square flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl rounded-2xl relative overflow-hidden group">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
                
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700/50 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                    <Box className="w-10 h-10 text-slate-500 opacity-70" strokeWidth={1.5} />
                </div>
                <div className="text-center z-10">
                    <p className="text-base font-medium text-slate-300">Awaiting Image</p>
                    <p className="text-sm text-slate-500 mt-1">Your 3D model will appear here</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="aspect-square flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-red-900/50 shadow-2xl rounded-2xl p-6 relative overflow-hidden text-center z-10">
                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-2 z-10">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <div className="text-center z-10">
                    <p className="text-base font-medium text-red-300">Failed to load 3D model</p>
                    <p className="text-sm text-red-400/70 mt-1">The file may be corrupted</p>
                </div>
                <button onClick={downloadModel} className="btn-secondary py-2 px-6 text-sm mt-4 z-10 border-red-500/30 hover:bg-red-500/10">
                    Download file instead
                </button>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 shadow-2xl rounded-2xl group w-full">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
            
            {/* Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={resetCamera}
                    className="p-2.5 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md rounded-xl border border-white/10 text-slate-300 hover:text-white transition-all hover:scale-105"
                    title="Reset View"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
                <button
                    onClick={downloadModel}
                    className="p-2.5 bg-primary-600/80 hover:bg-primary-500 backdrop-blur-md rounded-xl border border-primary-400/30 text-white transition-all hover:scale-105"
                    title="Download Model"
                >
                    <Download className="w-4 h-4" />
                </button>
            </div>

            {/* Format badge */}
            <div className="absolute top-4 left-4 z-10">
                <span className="text-[10.5px] font-bold uppercase tracking-wider px-3 py-1.5 bg-slate-800/80 backdrop-blur-md rounded-lg border border-white/10 text-slate-300 shadow-sm">
                    {isOBJ ? "OBJ" : "GLB"}
                </span>
            </div>

            {/* 3D Canvas */}
            <div className="aspect-square w-full model-viewer-canvas cursor-grab active:cursor-grabbing">
                <Canvas
                    camera={{ position: [0, 1.5, 3], fov: 50 }}
                    gl={{ preserveDrawingBuffer: true, alpha: true }}
                    onError={() => setError(true)}
                >
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[10, 10, 10]} intensity={1.5} />
                    <pointLight position={[-10, -10, -10]} intensity={1} />
                    <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} />

                    <ModelScene url={modelUrl} isOBJ={isOBJ} />

                    <OrbitControls
                        ref={controlsRef}
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        autoRotate={true}
                        autoRotateSpeed={1.5}
                        makeDefault
                    />
                </Canvas>
            </div>

            {/* Footer overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[11px] font-medium text-slate-300/90 bg-slate-900/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 tracking-wide shadow-lg">
                    Drag to rotate • Scroll to zoom • Right-click to pan
                </p>
            </div>
        </div>
    );
}

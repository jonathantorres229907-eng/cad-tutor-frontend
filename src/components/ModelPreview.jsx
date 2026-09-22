import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";

export default function ModelPreview({ stlData }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!stlData || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;

    // Scene + camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(80, 80, 120);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 1.0);
    directional.position.set(100, 150, 200);
    scene.add(directional);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.autoUpdate = false;
    rendererRef.current = renderer;

    // Clear container and append
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Loader
    const loader = new STLLoader();

    // Helper: detect ASCII vs binary
    const isAsciiSTL = (u8) => {
      if (!(u8 && u8.length >= 5)) return false;
      try {
        // check first 5 bytes for 'solid'
        const header = new TextDecoder("utf-8").decode(u8.subarray(0, 5));
        return header.toLowerCase() === "solid";
      } catch {
        return false;
      }
    };

    // Parse geometry safely
    let geometry = null;
    try {
      if (stlData instanceof ArrayBuffer) {
        // If backend returned ArrayBuffer directly
        const u8 = new Uint8Array(stlData);
        if (isAsciiSTL(u8)) {
          const text = new TextDecoder("utf-8").decode(u8);
          geometry = loader.parse(text);
        } else {
          geometry = loader.parse(u8.buffer);
        }
      } else if (stlData instanceof Uint8Array) {
        if (isAsciiSTL(stlData)) {
          const text = new TextDecoder("utf-8").decode(stlData);
          geometry = loader.parse(text);
        } else {
          geometry = loader.parse(stlData.buffer);
        }
      } else if (typeof stlData === "string") {
        geometry = loader.parse(stlData);
      } else {
        // try to coerce
        const u8 = new Uint8Array(stlData);
        if (isAsciiSTL(u8)) {
          geometry = loader.parse(new TextDecoder("utf-8").decode(u8));
        } else {
          geometry = loader.parse(u8.buffer);
        }
      }
    } catch (err) {
      console.error("STL parse error:", err);
      // show fallback visual or return early
      return;
    }

    if (!geometry) {
      console.error("No geometry parsed from STL.");
      return;
    }

    // Ensure geometry has normals
    if (!geometry.hasAttribute("normal")) {
      geometry.computeVertexNormals();
    }

    // Center and scale to fit
    geometry.center();
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;
    if (bbox) {
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const scale = 60 / maxDim; // scale to a comfortable size
        geometry.scale(scale, scale, scale);
      }
    }

    // Material (use DoubleSide while debugging missing faces)
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      metalness: 0.25,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Resize handling
    const onResize = () => {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };
    window.addEventListener("resize", onResize);

    // Animation
    let rafId = null;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      mesh.rotation.z += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
      controls.dispose();
      scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
      // force context loss to free GPU memory
      try {
        renderer.forceContextLoss();
      } catch (e) {}
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [stlData]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "400px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    />
  );
}

"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Stars, Sphere, Environment } from "@react-three/drei"
import type * as THREE from "three"

function FloatingCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#ff6b35"
          metalness={0.7}
          roughness={0.3}
          emissive="#ff6b35"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  )
}

function FloatingOctahedron({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.4
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#ffaa33"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffaa33"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

function FloatingTorus({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.3, 0.12, 16, 32]} />
        <meshStandardMaterial
          color="#ff8844"
          metalness={0.9}
          roughness={0.1}
          emissive="#ff8844"
          emissiveIntensity={0.25}
        />
      </mesh>
    </Float>
  )
}

function CentralSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  return (
    <mesh ref={meshRef}>
      <Sphere args={[0.8, 64, 64]}>
        <meshStandardMaterial
          color="#ff6b35"
          metalness={0.6}
          roughness={0.4}
          emissive="#ff6b35"
          emissiveIntensity={0.2}
          wireframe
        />
      </Sphere>
    </mesh>
  )
}

export function Hero3DScene() {
  const [isLowPerf, setIsLowPerf] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const cores = navigator.hardwareConcurrency || 2
      setIsLowPerf(isMobile || cores < 4)
    }
  }, [])

  return (
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={isLowPerf ? [1, 1] : [1, 2]} performance={{ min: 0.5 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} intensity={0.6} color="#ff6b35" />
          <pointLight position={[5, 5, 5]} intensity={0.4} color="#ffaa33" />

          <Stars radius={50} depth={50} count={isLowPerf ? 500 : 1000} factor={2} saturation={0} fade speed={0.5} />

          <CentralSphere />

          <FloatingCube position={[-2, 1, 0]} />
          <FloatingCube position={[2.5, -0.5, -1]} />
          <FloatingOctahedron position={[1.5, 1.5, 0.5]} />
          <FloatingOctahedron position={[-1.8, -1, -0.5]} />
          <FloatingTorus position={[0, -1.5, 1]} />
          <FloatingTorus position={[-2.5, 0.5, -1.5]} />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}

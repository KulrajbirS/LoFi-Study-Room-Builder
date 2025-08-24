import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

// Sophisticated study room theme
const theme = {
  background: '#f7f7f5', // Warm off-white
  floorColor: '#8B4513', // Rich walnut wood
  wallColor: '#faf9f6', // Warm white with cream undertone
  accentWallColor: '#4a5568', // Sophisticated charcoal gray
  ceilingColor: '#ffffff', // Clean white ceiling
  lightColor: '#fff8e7', // Warm white light
  lightIntensity: 0.9,
  ambientIntensity: 0.4
};

// 3D Furniture Components
const Desk = ({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Desktop */}
      <Box ref={meshRef} args={[2, 0.1, 1]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Legs */}
      <Box args={[0.1, 0.8, 0.1]} position={[-0.8, 0.4, -0.4]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Box args={[0.1, 0.8, 0.1]} position={[0.8, 0.4, -0.4]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Box args={[0.1, 0.8, 0.1]} position={[-0.8, 0.4, 0.4]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Box args={[0.1, 0.8, 0.1]} position={[0.8, 0.4, 0.4]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Drawer */}
      <Box args={[0.6, 0.15, 0.4]} position={[0.5, 0.8, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8)} />
      </Box>
    </group>
  );
};

const Chair = ({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = 0.5 + Math.sin(Date.now() * 0.003) * 0.05;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Seat */}
      <Box ref={meshRef} args={[0.6, 0.1, 0.6]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Backrest */}
      <Box args={[0.6, 0.8, 0.1]} position={[0, 0.8, -0.25]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Legs */}
      <Box args={[0.05, 0.5, 0.05]} position={[-0.25, 0.25, -0.25]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7)} />
      </Box>
      <Box args={[0.05, 0.5, 0.05]} position={[0.25, 0.25, -0.25]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7)} />
      </Box>
      <Box args={[0.05, 0.5, 0.05]} position={[-0.25, 0.25, 0.25]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7)} />
      </Box>
      <Box args={[0.05, 0.5, 0.05]} position={[0.25, 0.25, 0.25]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7)} />
      </Box>
    </group>
  );
};

const Bookshelf = ({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  
  return (
    <group position={position} onClick={onClick}>
      {/* Main frame */}
      <Box ref={meshRef} args={[1.5, 2, 0.4]} position={[0, 1, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Shelves */}
      {[0.3, 0.8, 1.3, 1.8].map((y, index) => (
        <Box key={index} args={[1.4, 0.05, 0.35]} position={[0, y, 0]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.9)} />
        </Box>
      ))}
      {/* Books */}
      {Array.from({ length: 20 }, (_, i) => (
        <Box
          key={i}
          args={[0.08, 0.25, 0.15]}
          position={[
            -0.6 + (i % 5) * 0.3,
            0.45 + Math.floor(i / 5) * 0.5,
            0.1
          ]}
        >
          <meshStandardMaterial 
            color={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][i % 5]} 
          />
        </Box>
      ))}
    </group>
  );
};

const Plant = ({ position, color, isSelected, onClick }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Pot */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Leaves */}
      <group ref={meshRef}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 0.4,
              0.6 + Math.sin((i / 8) * Math.PI * 2) * 0.2,
              Math.sin((i / 8) * Math.PI * 2) * 0.4
            ]}
            rotation={[0, (i / 8) * Math.PI * 2, 0]}
          >
            <sphereGeometry args={[0.15, 8, 6]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Lamp = ({ position, color, isSelected, onClick, lightIntensity = 1 }) => {
  const lightRef = useRef();
  
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = lightIntensity * (0.8 + Math.sin(Date.now() * 0.005) * 0.2);
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.1, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* Lampshade */}
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.3, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.8, 0]}
        color="#ffaa66"
        intensity={lightIntensity * 2}
        distance={5}
        decay={1}
      />
    </group>
  );
};

// Main Room Component
const Room = ({ roomSettings, roomItems, selectedItem, onItemSelect }) => {
  const { scene } = useThree();
  const lightingMultiplier = (roomSettings?.lighting || 50) / 100;

  // Update scene background
  useEffect(() => {
    scene.background = new THREE.Color(theme.background);
  }, [scene]);

  const renderFurnitureItem = (item, index) => {
    const isSelected = selectedItem === index;
    const onClick = () => onItemSelect(index);
    
    // Convert 2D position to 3D
    const position = [
      (item.x - 400) / 100, // Center and scale
      0,
      (item.y - 300) / 100
    ];

    const itemProps = {
      position,
      color: item.color,
      isSelected,
      onClick
    };

    if (item.id.startsWith('desk')) {
      return <Desk key={index} {...itemProps} />;
    } else if (item.id.startsWith('chair')) {
      return <Chair key={index} {...itemProps} />;
    } else if (item.id.startsWith('bookshelf')) {
      return <Bookshelf key={index} {...itemProps} />;
    } else if (item.id.startsWith('plant')) {
      return <Plant key={index} {...itemProps} />;
    } else if (item.id.startsWith('lamp')) {
      return <Lamp key={index} {...itemProps} lightIntensity={lightingMultiplier} />;
    }
    
    // Default cube for unknown items
    return (
      <Box key={index} args={[1, 1, 1]} position={position} onClick={onClick}>
        <meshStandardMaterial color={item.color} />
      </Box>
    );
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={theme.ambientIntensity * lightingMultiplier} color={theme.lightColor} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={theme.lightIntensity * lightingMultiplier}
        color={theme.lightColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Room Structure */}
      {/* Hardwood Floor with wood grain effect */}
      <Plane
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={theme.floorColor}
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>
      
      {/* Floor planks effect - subtle lines to simulate wood planks */}
      {Array.from({ length: 10 }, (_, i) => (
        <Box 
          key={`plank-${i}`}
          args={[20, 0.02, 0.1]} 
          position={[0, 0.01, -9 + (i * 2)]}
        >
          <meshStandardMaterial color="#654321" opacity={0.3} transparent />
        </Box>
      ))}
      
      {/* Back Wall - Accent Wall */}
      <Plane
        args={[20, 10]}
        position={[0, 5, -10]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={theme.accentWallColor}
          roughness={0.9}
        />
      </Plane>
      
      {/* Left Wall - Warm white */}
      <Plane
        args={[20, 10]}
        position={[-10, 5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={theme.wallColor} />
      </Plane>
      
      {/* Right Wall - Warm white */}
      <Plane
        args={[20, 10]}
        position={[10, 5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={theme.wallColor} />
      </Plane>
      
      {/* Ceiling - Clean white */}
      <Plane
        args={[20, 20]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 10, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={theme.ceilingColor} />
      </Plane>
      
      {/* Crown molding on ceiling */}
      <Box args={[20, 0.2, 0.3]} position={[0, 9.9, -10]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      <Box args={[0.3, 0.2, 20]} position={[-10, 9.9, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      <Box args={[0.3, 0.2, 20]} position={[10, 9.9, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Baseboards */}
      <Box args={[20, 0.3, 0.2]} position={[0, 0.15, -9.9]}>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      <Box args={[0.2, 0.3, 20]} position={[-9.9, 0.15, 0]}>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      <Box args={[0.2, 0.3, 20]} position={[9.9, 0.15, 0]}>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      
      {/* Recessed ceiling lights */}
      {Array.from({ length: 4 }, (_, i) => (
        <group key={`ceiling-light-${i}`}>
          <mesh position={[
            -6 + (i % 2) * 12, 
            9.8, 
            -3 + Math.floor(i / 2) * 6
          ]}>
            <cylinderGeometry args={[0.8, 0.8, 0.1, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#fff8e7" emissiveIntensity={0.2} />
          </mesh>
          <pointLight
            position={[
              -6 + (i % 2) * 12, 
              9.5, 
              -3 + Math.floor(i / 2) * 6
            ]}
            color={theme.lightColor}
            intensity={lightingMultiplier * 0.3}
            distance={8}
            decay={1}
          />
        </group>
      ))}
      
      {/* Wall texture on accent wall - subtle vertical lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <Box 
          key={`wall-texture-${i}`}
          args={[0.05, 8, 0.05]} 
          position={[-8 + (i * 2), 4, -9.95]}
        >
          <meshStandardMaterial 
            color={theme.accentWallColor} 
            transparent 
            opacity={0.8}
          />
        </Box>
      ))}
      
      {/* Furniture Items */}
      {roomItems.map(renderFurnitureItem)}
      
      {/* Selected item indicator */}
      {selectedItem !== null && roomItems[selectedItem] && (
        <Text
          position={[
            (roomItems[selectedItem].x - 400) / 100,
            3,
            (roomItems[selectedItem].y - 300) / 100
          ]}
          fontSize={0.5}
          color="#ffaa00"
          anchorX="center"
          anchorY="middle"
        >
          {roomItems[selectedItem].name}
        </Text>
      )}
    </>
  );
};


// Main Canvas Component
const RoomCanvas3D = ({ roomItems, onItemMove, onItemSelect, selectedItem, roomSettings }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw', 
      height: '100vh'
    }}>
      <Canvas
        shadows
        camera={{ position: [12, 8, 12], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Room
          roomSettings={roomSettings}
          roomItems={roomItems}
          selectedItem={selectedItem}
          onItemSelect={onItemSelect}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={8}
          maxDistance={25}
          target={[0, 3, 0]}
        />
      </Canvas>
    </div>
  );
};

export default RoomCanvas3D;
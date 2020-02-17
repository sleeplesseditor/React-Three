import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useAnimatedLayout } from './Layouts';

const scratchObject3D = new THREE.Object3D();

function updatedInstanceMeshMatrices({ mesh, data }) {
  if (!mesh) return;

  for(let i = 0; i < data.length; ++i){
    const {x, y, z} = data[i];

    scratchObject3D.position.set(x, y, z);
    scratchObject3D.rotation.set(0.5 * Math.PI, 0, 0);
    scratchObject3D.updateMatrix();
    mesh.setMatrixAt(i, scratchObject3D.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}

const InstancedPoints = ({ data, layout }) => {
  const meshRef = React.useRef();
  const numPoints = data.length;

  useAnimatedLayout({ 
    data, 
    layout, 
    onFrame: () => {
      updatedInstanceMeshMatrices({ mesh: meshRef.current, data })
    },
  });

  useEffect(() => {
    updatedInstanceMeshMatrices({ mesh: meshRef.current, data });
  }, [data, layout]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, numPoints]}
      frustumCulled={false}
    >
      <cylinderBufferGeometry attach="geometry" args={[0.5, 0.5, 0.15, 32]} />
      <meshStandardMaterial attach="material" color="#fff" />
    </instancedMesh>
  )
}

export default InstancedPoints;
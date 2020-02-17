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

const SELECTED_COLOR = '#6f6';
const DEFAULT_COLOR = '#fff';

const scratchColor = new THREE.Color();

const usePointColors = ({ data, selectedPoint }) => {
  const numPoints = data.length;
  const colorAttrib = React.useRef();
  const colorArray = React.useMemo(() => new Float32Array(numPoints * 3), [numPoints]);

  useEffect(() => {
    for(let i = 0; i < data.length; ++i){
      scratchColor.set(data[i] === selectedPoint ? SELECTED_COLOR : DEFAULT_COLOR);
      scratchColor.toArray(colorArray, i * 3);
    }
    colorAttrib.current.needsUpdate = true;
  }, [data, selectedPoint, colorArray]);

  return { colorAttrib, colorArray };
}

const useMousePointInteraction = ({ data, selectedPoint, onSelectPoint }) => {
  const mouseDownRef = React.useRef([0, 0]);
  const handlePointerDown = e => {
    mouseDownRef.current[0] = e.clientX;
    mouseDownRef.current[1] = e.clientY;
  };

  const handleClick = event => {
    const { instanceId, clientX, clientY } = event;
    const downDistance = Math.sqrt(
      Math.pow(mouseDownRef.current[0] - clientX, 2) +
        Math.pow(mouseDownRef.current[1] - clientY, 2)
    );

    // Skip click if dragged more than 5px distance
    if (downDistance > 5) {
      event.stopPropagation();
      return;
    }

    const index = instanceId;
    const point = data[index];

    console.log('got point =', point);
    if (point === selectedPoint) {
      onSelectPoint(null);
    } else {
      onSelectPoint(point);
    }
  };

  return { handlePointerDown, handleClick };
};

const InstancedPoints = ({ data, layout, selectedPoint, onSelectPoint }) => {
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
  
  const { handleClick, handlePointerDown } = useMousePointInteraction({
    data,
    selectedPoint,
    onSelectPoint
  });
  const { colorAttrib, colorArray } = usePointColors({ data, selectedPoint });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, numPoints]}
      frustumCulled={false}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
    >
      <cylinderBufferGeometry attach="geometry" args={[0.5, 0.5, 0.15, 32]}>
        <instancedBufferAttribute
          ref={colorAttrib}
          attachObject={['attributes', 'color']}
          args={[colorArray, 3]}
        />
      </cylinderBufferGeometry>
      <meshStandardMaterial
        attach="material"
        vertexColors={THREE.VertexColors}
      />
    </instancedMesh>
  )
}

export default InstancedPoints;
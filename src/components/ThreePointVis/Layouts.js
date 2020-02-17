import React from 'react';
import { useSpring } from 'react-spring/three';

function gridLayout(data) {
  const numPoints = data.length;
  const numCols = Math.ceil(Math.sqrt(numPoints));
  const numRows = numCols;

  for(let i = 0; i < numPoints; ++i) {
    const datum = data[i];
    const col = (i % numCols) - numCols / 2;
    const row = Math.floor(i / numCols) - numRows / 2;

    datum.x = col * 1.05;
    datum.y = row * 1.05;
    datum.z = 0;
  }
}

function spiralLayout(data) {
  // Equidistant points on spiral
  let theta = 0;
  for (let i = 0; i < data.length; ++i) {
    const datum = data[i];
    const radius = Math.max(1, Math.sqrt(i + 1) * 0.8);
    theta += Math.asin(1 / radius) * 1;

    datum.x = radius * Math.cos(theta);
    datum.y = radius * Math.sin(theta);
    datum.z = 0;
  }
}

export const useLayout = ({ data, layout = 'grid' }) => {
  React.useEffect(() => {
    switch(layout) {
      case 'spiral':
        spiralLayout(data);
        break;
      case 'grid':
        default: {
          gridLayout(data);
        }
    }
  }, [data, layout]);
};

function useSourceTargetLayout({ data, layout}) {
  React.useEffect(() => {
    for (let i = 0; i < data.length; ++i) {
      data[i].sourceX = data[i].x || 0;
      data[i].sourceY = data[i].y || 0;
      data[i].sourceZ = data[i].z || 0;
    }
  }, [data, layout]);

  useLayout({ data, layout });

  React.useEffect(() => {
    for (let i = 0; i < data.length; ++i) {
      data[i].targetX = data[i].x || 0;
      data[i].targetY = data[i].y || 0;
      data[i].targetZ = data[i].z || 0;
    }
  }, [data, layout]);
};

function interploateSourceTarget(data, progress){
  for (let i = 0; i < data.length; ++i) {
    data[i].x = (1 - progress) * data[i].sourceX + progress * data[i].targetX;
    data[i].y = (1 - progress) * data[i].sourceY + progress * data[i].targetY;
    data[i].z = (1 - progress) * data[i].sourceZ + progress * data[i].targetZ;
  }
};

export function useAnimatedLayout({ data, layout, onFrame }) {
  // Compute layout with original source and end position target
  useSourceTargetLayout({ data, layout });

  const prevLayout = React.useRef(layout);
  const animProps = useSpring({
    animationProgress: 1,
    from: { animationProgress: 0 },
    reset: layout !== prevLayout.current,
    onFrame: ({ animationProgress }) => {
      // Interpolate based on progress
      interploateSourceTarget(data, animationProgress);
      // Callback to indicate data has been updated
      onFrame({ animationProgress });
    },
  });
  prevLayout.current = layout;

  return animProps;
}
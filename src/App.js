import React, { useState } from 'react';
import Header from './components/Header/Header';
import ThreePointVis from './components/ThreePointVis/ThreePointVis';
import './App.scss';

const data = new Array(10000).fill(0).map((d, id) => ({ id }));

function App() {
  const [layout, setLayout] = useState('grid');
  const [selectedPoint, setSelectedPoint] = useState(null);

  const visRef = React.useRef();
  const handleResetCamera = () => {
    visRef.current.resetCamera();
  }

  return (
    <React.Fragment>
    <Header />
    <div className="App">
      <div className="vis-container">
        <ThreePointVis
          ref={visRef}
          data={data} 
          layout={layout}
          selectedPoint={selectedPoint}
          onSelectPoint={setSelectedPoint} 
        />
      </div>
      <div className="controls">
        <strong>Layouts</strong>
        <div className="controls__buttons-container">
          <button 
            onClick={() => setLayout('grid')}
            className={layout === 'grid' ? 'active' : undefined}
          >
            Grid
          </button>
          <button 
            onClick={() => setLayout('spiral')}
            className={layout === 'spiral' ? 'active' : undefined}
          >
            Spiral
          </button>
        </div>
        <button
          className="controls__reset-button"
          onClick={handleResetCamera}
        >
          Reset Camera
        </button>
        {selectedPoint && (
          <div className="controls__selected-point">
            You selected <strong>{selectedPoint.id}</strong>
          </div>
        )}
      </div>
    </div>
    </React.Fragment>
  );
}

export default App;

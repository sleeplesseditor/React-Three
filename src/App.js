import React, { useState } from 'react';
import Header from './components/Header/Header';
import ThreePointVis from './components/ThreePointVis/ThreePointVis';
import './App.scss';

const data = new Array(100000).fill(0).map((d, id) => ({ id }));

function App() {
  const [layout, setLayout] = useState('grid');

  return (
    <React.Fragment>
    <Header />
    <div className="App">
      <div className="vis-container">
        <ThreePointVis data={data} layout={layout} />
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
      </div>
    </div>
    </React.Fragment>
  );
}

export default App;

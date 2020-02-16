import React from 'react';
import ThreePointVis from './components/ThreePointVis/ThreePointVis';
import './App.css';

const data = new Array(1000).fill(0).map((d, id) => ({ id }))

function App() {
  return (
    <div className="App">
      <div className="vis-container">
        <ThreePointVis data={data} />
      </div>
    </div>
  );
}

export default App;

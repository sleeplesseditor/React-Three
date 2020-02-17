import React from 'react';
import Header from './components/Header/Header';
import ThreePointVis from './components/ThreePointVis/ThreePointVis';
import './App.css';

const data = new Array(100000).fill(0).map((d, id) => ({ id }));

function App() {
  return (
    <React.Fragment>
    <Header />
    <div className="App">
      <div className="vis-container">
        <ThreePointVis data={data} />
      </div>
    </div>
    </React.Fragment>
  );
}

export default App;

import React from 'react';
import Pocetna from './pages/pocetnaStrana/components/Pocetna';
import Glavna from './pages/pocetnaStrana/components/Glavna';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { PocModalProvider } from './globalne/PocModalContext'

function App() {
  return (
    <Router>
      <PocModalProvider>
          <Routes>
              <Route path="/" /*exact*/ element={<Pocetna/>} />
              <Route path="/glavna" element={<Glavna br_poteza={0} br_slicica={0}/>} />
          </Routes>
      </PocModalProvider>
    </Router>
  );
}

export default App;

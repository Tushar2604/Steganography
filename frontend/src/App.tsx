import { useState } from 'react';
import Home from './components/Home';
import Encode from './components/Encode';
import Decode from './components/Decode';

type Page = 'home' | 'encode' | 'decode';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <>
      {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
      {currentPage === 'encode' && <Encode onNavigate={setCurrentPage} />}
      {currentPage === 'decode' && <Decode onNavigate={setCurrentPage} />}
    </>
  );
}

export default App;

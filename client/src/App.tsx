import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FAFAFA] font-sans text-stone-800">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import { Toaster } from 'react-hot-toast';
import { PredictionProvider } from './context/PredictionContext';
import { ThemeProvider } from './context/ThemeContext';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Toaster position="top-right" />
    <Navbar />
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <PredictionProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/predict" element={<Prediction />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </PredictionProvider>
    </ThemeProvider>
  );
}

export default App;

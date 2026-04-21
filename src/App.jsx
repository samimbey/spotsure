import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import CameraPage from './pages/Camera';
import History from './pages/History';
import MapView from './pages/MapView';
import ScanDetail from './pages/ScanDetail';
import Settings from './pages/Settings';
import About from './pages/About';
import PermissionsGate from './components/PermissionsGate';

const PageSlide = ({ children }) => (
  <motion.div
    initial={{ x: 40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -40, opacity: 0 }}
    transition={{ duration: 0.18, ease: 'easeInOut' }}
    style={{ width: '100%' }}
  >
    {children}
  </motion.div>
);

const MainApp = () => {
  const location = useLocation();
  return (
    <PermissionsGate>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route path="/" element={<PageSlide><CameraPage /></PageSlide>} />
            <Route path="/history" element={<PageSlide><History /></PageSlide>} />
            <Route path="/map" element={<PageSlide><MapView /></PageSlide>} />
            <Route path="/scan/:id" element={<PageSlide><ScanDetail /></PageSlide>} />
            <Route path="/settings" element={<PageSlide><Settings /></PageSlide>} />
            <Route path="/about" element={<PageSlide><About /></PageSlide>} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </PermissionsGate>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <MainApp />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App
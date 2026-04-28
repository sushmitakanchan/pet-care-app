import { useContext, useEffect, useRef } from 'react'
import "./index.css";
import { PetContext, PetProvider } from './context/PetContext';
import Pets from './components/Pets'
import PetCareZone from './components/PetCareZone';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import WalkTracker from './components/WalkTracker';
import BathTracker from './components/BathTracker';
import FeedTracker from './components/FeedTracker';
import PlayTracker from './components/PlayTracker';
import BasicInfo from './components/BasicInfo';
import AdditionalInfo from './components/AdditionalInfo';
import WalkSchedule from './components/WalkSchedule';
import BathSchedule from './components/BathSchedule';
import FeedSchedule from './components/FeedSchedule';
import PlaySchedule from './components/PlaySchedule';
import PetAttributeBars from './components/PetAttributesBars';

const RedirectWithToast = ({ to, message }) => {
  const { addToast } = useContext(PetContext);
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    addToast?.(message);
  }, [addToast, message]);
  return <Navigate to={to} replace />;
};

const ProtectedRoute = ({ children, requireName = false }) => {
  const { activePetId, petInfo } = useContext(PetContext);
  if (!activePetId) return <Navigate to="/" replace />;
  if (requireName && !petInfo?.basic?.name) {
    return <RedirectWithToast to="/basic-info" message="Pet must have a name. Please fill Basic Info first." />;
  }
  return children;
};

function App() {
  return (
    <PetProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Pets />} />
          <Route path='/basic-info' element={<ProtectedRoute><BasicInfo /></ProtectedRoute>} />
          <Route path='/additional-info' element={<ProtectedRoute requireName><AdditionalInfo /></ProtectedRoute>} />
          <Route path='/pet-care-zone' element={<ProtectedRoute requireName><PetCareZone /></ProtectedRoute>} />
          <Route path='/pet-walk' element={<ProtectedRoute requireName><WalkTracker /></ProtectedRoute>} />
          <Route path='/pet-bath' element={<ProtectedRoute requireName><BathTracker /></ProtectedRoute>} />
          <Route path='/pet-feed' element={<ProtectedRoute requireName><FeedTracker /></ProtectedRoute>} />
          <Route path='/pet-play' element={<ProtectedRoute requireName><PlayTracker /></ProtectedRoute>} />
          <Route path='/walk-schedule' element={<ProtectedRoute requireName><WalkSchedule /></ProtectedRoute>} />
          <Route path='/bath-schedule' element={<ProtectedRoute requireName><BathSchedule /></ProtectedRoute>} />
          <Route path='/feed-schedule' element={<ProtectedRoute requireName><FeedSchedule /></ProtectedRoute>} />
          <Route path='/play-schedule' element={<ProtectedRoute requireName><PlaySchedule /></ProtectedRoute>} />
          <Route path='/pet-care-zone/pet-moods' element={<ProtectedRoute requireName><PetAttributeBars /></ProtectedRoute>} />
        </Routes>
      </Router>
    </PetProvider>
  )
}

export default App

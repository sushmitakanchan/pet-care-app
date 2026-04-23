import { useContext } from 'react'
import "./index.css";
import { PetContext, PetProvider } from './context/PetContext';
import ChooseYourPet from './components/ChooseYourPet'
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

const ProtectedRoute = ({ children, requireName = false }) => {
  const { pet, petInfo } = useContext(PetContext);
  if (!pet) return <Navigate to="/" replace />;
  if (requireName && !petInfo?.basic?.name) return <Navigate to="/basic-info" replace />;
  return children;
};

function App() {
  return (
    <PetProvider>
      <Router>
        <Routes>
          <Route path='/' element={<ChooseYourPet />} />
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

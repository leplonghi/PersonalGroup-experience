import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, UserRole, Protocol } from '../types';
import { getProtocolById, subscribeToActiveStaff } from '../firebase';
import StudentHub from './StudentHub';
import { PersonalHome } from '../components/home/PersonalHome';
import { Icons } from '../constants';

interface HomeProps {
  user: User;
  onStartSession?: (student?: User) => void;
}

const Home: React.FC<HomeProps> = ({ user, onStartSession }) => {
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loadingProtocol, setLoadingProtocol] = useState(false);
  const [activeStaff, setActiveStaff] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToActiveStaff((staff) => {
      setActiveStaff(staff);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user.currentCycle?.protocolId) {
      setLoadingProtocol(true);
      getProtocolById(user.currentCycle.protocolId)
        .then(setProtocol)
        .finally(() => setLoadingProtocol(false));
    }
  }, [user.currentCycle?.protocolId]);

  if (user.role === UserRole.PERSONAL) {
    return <PersonalHome user={user} />;
  }

  if (user.role === UserRole.CHEFE || user.role === UserRole.ADMIN) {
    return <Navigate to="/management" replace />;
  }

  return (
    <div className="bg-app transition-colors duration-1000 relative">
      <div className="precision-bg">
        <StudentHub 
            user={user} 
            onStartSession={() => onStartSession?.()}
            onNavigateTo={(target) => navigate(target)}
        />
      </div>

    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, X, MapPin, Star, Utensils, Calendar } from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AdminPortal from './components/AdminPortal';
import Login from './components/Login';

const API_URL = 'http://localhost:4000/api';

const MOCK_USERS = [
  { id: '1', name: 'Elena', age: 28, bio: 'Coffee lover & hiker.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=687' },
  { id: '2', name: 'James', age: 31, bio: 'Software engineer by day.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=687' },
];

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);
  const [view, setView] = useState('discover'); // discover, restaurants

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => signOut(auth);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F0F1B' }}>
      <div style={{ color: '#B87333', fontSize: '20px' }}>Loading...</div>
    </div>
  );

  if (!user) return <Login />;

  const handleSwipe = async (dir) => {
    try {
      await axios.post(`${API_URL}/matches/swipe`, {
        userId: 'web-user',
        targetUserId: currentUser.id,
        direction: dir
      });
      if (dir === 'right') alert("Match! Check out curated restaurants.");
      // Move to next
      setCurrentUser(MOCK_USERS[1]);
    } catch (e) {
      console.log('API Offline, simulating swipe');
      setCurrentUser(MOCK_USERS[1]);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0F0F1B', color: 'white' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#1E1E2E', padding: '32px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <h1 style={{ color: '#B87333', fontSize: '24px', marginBottom: '40px' }}>Pike Place Pair</h1>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button onClick={() => setView('discover')} style={{ background: 'none', border: 'none', color: view === 'discover' ? '#B87333' : '#A0A0B0', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px' }}>
            <Heart size={20} /> Discover
          </button>
          <button onClick={() => setView('restaurants')} style={{ background: 'none', border: 'none', color: view === 'restaurants' ? '#B87333' : '#A0A0B0', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px' }}>
            <Utensils size={20} /> Curated Dates
          </button>
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <button onClick={() => setView('admin')} style={{ background: 'none', border: 'none', color: view === 'admin' ? '#B87333' : '#A0A0B0', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', opacity: 0.8 }}>
               <MapPin size={18} /> Admin Panel
             </button>
             <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#FF5252', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', opacity: 0.7 }}>
               Logout
             </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        
        {view === 'discover' ? (
          <div style={{ width: '400px', backgroundColor: '#1E1E2E', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <img src={currentUser.image} style={{ width: '100%', height: '500px', objectFit: 'cover' }} alt="Profile" />
            <div style={{ padding: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '28px' }}>{currentUser.name}, {currentUser.age}</h2>
              <p style={{ color: '#A0A0B0', marginTop: '8px' }}>{currentUser.bio}</p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '32px' }}>
                <button onClick={() => handleSwipe('left')} style={{ flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(255,82,82,0.1)', border: 'none', color: '#FF5252', cursor: 'pointer' }}><X size={24} style={{ margin: '0 auto' }} /></button>
                <button onClick={() => handleSwipe('right')} style={{ flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(184,115,51,0.1)', border: 'none', color: '#B87333', cursor: 'pointer' }}><Heart size={24} style={{ margin: '0 auto' }} /></button>
              </div>
            </div>
          </div>
        ) : view === 'restaurants' ? (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '32px' }}>Top Picks in Seattle</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {[
                { name: 'The Pink Door', cuisine: 'Italian', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
                { name: 'Canlis', cuisine: 'Modern American', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400' }
              ].map(r => (
                <div key={r.name} style={{ backgroundColor: '#1E1E2E', borderRadius: '24px', overflow: 'hidden' }}>
                   <img src={r.img} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                   <div style={{ padding: '20px' }}>
                      <h3 style={{ margin: 0 }}>{r.name}</h3>
                      <p style={{ color: '#A0A0B0', fontSize: '14px' }}>{r.cuisine} • 10% Discount</p>
                      <button style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#B87333', border: 'none', color: 'white', fontWeight: 'bold' }}>Book Now</button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <AdminPortal />
        )}

        {/* Rain Effect Texture Placeholder */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', opacity: 0.05, backgroundImage: 'url(https://www.transparenttextures.com/patterns/rain.png)' }}></div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, X, MapPin, Star, Utensils, Calendar, ShieldAlert, Loader2 } from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AdminPortal from './components/AdminPortal';
import Login from './components/Login';
import Onboarding from './components/Onboarding';

const API_URL = 'http://localhost:4000/api';

const MOCK_USERS = [
  { id: '1', name: 'Elena', age: 28, bio: 'Coffee lover & hiker.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=687' },
  { id: '2', name: 'James', age: 31, bio: 'Software engineer by day.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=687' },
  { id: '3', name: 'Sophie', age: 26, bio: "Artist living in Capitol Hill.", image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=687' },
];

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleChecking, setRoleChecking] = useState(false);
  const [discoverUsers, setDiscoverUsers] = useState(MOCK_USERS);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [view, setView] = useState('discover'); 

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const fetchDiscoverUsers = async (uid) => {
    try {
      const res = await axios.get(`${API_URL}/users/discover`, { params: { userId: uid } });
      if (res.data && res.data.length > 0) {
        setDiscoverUsers(res.data);
      }
      // else keep MOCK_USERS as default
    } catch (e) {
      console.warn('Discover API unavailable, using mock users');
    }
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    }
  };

  const currentUser = discoverUsers[currentUserIndex % discoverUsers.length];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserProfile(firebaseUser.uid);
        await fetchDiscoverUsers(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchUserProfile = async (uid) => {
    setRoleChecking(true);
    try {
      const res = await axios.get(`${API_URL}/admin/users`); // We'll just find our user in the list for now
      const profile = res.data.find(u => u.userId === uid);
      setUserProfile(profile);
      if (profile?.role === 'admin') {
        setView('admin');
      } else {
        setView('discover');
      }
    } catch (e) {
      console.error("Error fetching role:", e);
    } finally {
      setRoleChecking(false);
    }
  };

  const handleLogout = () => signOut(auth);

  // --- Premium Bumble-Style Splash Screen ---
  if (loading || roleChecking) return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#0F0F1B',
      background: 'radial-gradient(circle at center, #1E1E2E 0%, #0F0F1B 100%)'
    }}>
      <div style={{ position: 'relative', marginBottom: '40px' }}>
        <div style={{ 
          width: '120px', height: '120px', borderRadius: '40px', backgroundColor: '#B87333', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 50px rgba(184, 115, 51, 0.3)',
          animation: 'pulse 2s infinite'
        }}>
          <Heart size={60} color="white" fill="white" />
        </div>
      </div>
      <h2 style={{ color: 'white', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '14px', opacity: 0.6 }}>
        Authenticating...
      </h2>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );

  if (!user) return <Login />;

  // --- Show Onboarding for New Users (Force for missing Work/Bio) ---
  if (user && !loading && !roleChecking && (!userProfile || !userProfile.work || !userProfile.bio)) {
    return <Onboarding user={user} onComplete={() => fetchUserProfile(user.uid)} />;
  }

  const handleSwipe = async (dir) => {
    x.set(0);
    const target = discoverUsers[currentUserIndex % discoverUsers.length];
    try {
      await axios.post(`${API_URL}/matches/swipe`, {
        userId: user.uid,
        targetUserId: target.userId || target.id,
        direction: dir
      });
    } catch (e) {
      // swipe still advances even if backend is offline
    }
    setCurrentUserIndex((prev) => prev + 1);
  };

  // --- Unauthorized View ---
  if (view === 'admin' && userProfile?.role !== 'admin') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F0F1B', color: 'white', textAlign: 'center', padding: '40px' }}>
        <div style={{ maxWidth: '400px' }}>
          <ShieldAlert size={80} color="#FF5252" style={{ marginBottom: '24px' }} />
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Admin Access Required</h1>
          <p style={{ color: '#A0A0B0', marginBottom: '32px' }}>
            You are currently logged in as a <b>{userProfile?.role || 'User'}</b>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setView('discover')} style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
              Go Back to App
            </button>
            <button 
              onClick={async () => {
                await axios.post(`${API_URL}/admin/users/update-role`, { userId: user.uid, role: 'admin' });
                fetchUserProfile(user.uid);
              }}
              style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#B87333', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              DEBUG: Promote me to Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0F0F1B', color: 'white' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#1E1E2E', padding: '32px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <Heart size={32} color="#B87333" fill="#B87333" />
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Pike Place Pair</h1>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button onClick={() => setView('discover')} style={{ 
            background: view === 'discover' ? 'rgba(184, 115, 51, 0.1)' : 'none', 
            border: 'none', color: view === 'discover' ? '#B87333' : '#A0A0B0', 
            padding: '16px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' 
          }}>
            <Heart size={20} /> Discover
          </button>
          <button onClick={() => setView('restaurants')} style={{ 
            background: view === 'restaurants' ? 'rgba(184, 115, 51, 0.1)' : 'none', 
            border: 'none', color: view === 'restaurants' ? '#B87333' : '#A0A0B0', 
            padding: '16px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' 
          }}>
            <Utensils size={20} /> Curated Dates
          </button>
          
          {userProfile?.role === 'admin' && (
            <button onClick={() => setView('admin')} style={{ 
              background: view === 'admin' ? 'rgba(184, 115, 51, 0.1)' : 'none', 
              border: 'none', color: view === 'admin' ? '#B87333' : '#A0A0B0', 
              padding: '16px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px'
            }}>
              <MapPin size={20} /> Admin Panel
            </button>
          )}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
             <img src={userProfile?.profileImage || user.photoURL || 'https://via.placeholder.com/40'} style={{ width: '40px', height: '40px', borderRadius: '12px' }} />
             <div>
               <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{userProfile?.name || 'User'}</p>
               <p style={{ margin: 0, fontSize: '11px', color: '#606070', textTransform: 'uppercase' }}>{userProfile?.role || 'Guest'}</p>
             </div>
           </div>
           <button onClick={handleLogout} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,82,82,0.1)', border: 'none', color: '#FF5252', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
             Logout
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {view === 'admin' ? (
          <AdminPortal />
        ) : (
          <div style={{ padding: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', perspective: '1000px' }}>
            {view === 'discover' ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentUserIndex}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ x: x.get() > 0 ? 500 : -500, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ 
                    width: '400px', backgroundColor: '#1E1E2E', borderRadius: '32px', 
                    overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', 
                    border: '1px solid rgba(255,255,255,0.05)', position: 'relative',
                    cursor: 'grab', x, rotate, opacity
                  }}
                >
                  <img src={currentUser.image} style={{ width: '100%', height: '500px', objectFit: 'cover', pointerEvents: 'none' }} alt="Profile" />
                  <div style={{ padding: '32px', pointerEvents: 'none' }}>
                    <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{currentUser.name}, {currentUser.age}</h2>
                    <p style={{ color: '#A0A0B0', marginTop: '12px', lineHeight: '1.6' }}>{currentUser.bio}</p>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                      <div style={{ flex: 1, height: '64px', borderRadius: '20px', backgroundColor: 'rgba(255,82,82,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5252' }}><X size={28} /></div>
                      <div style={{ flex: 1, height: '64px', borderRadius: '20px', backgroundColor: 'rgba(184,115,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B87333' }}><Heart size={28} /></div>
                    </div>
                  </div>

                  {/* Swipe Indicators */}
                  <motion.div style={{ opacity: likeOpacity, position: 'absolute', top: '40px', left: '40px', border: '4px solid #4CAF50', color: '#4CAF50', padding: '10px 20px', borderRadius: '12px', fontSize: '24px', fontWeight: 'bold', rotate: '-15deg', pointerEvents: 'none' }}>LIKE</motion.div>
                  <motion.div style={{ opacity: nopeOpacity, position: 'absolute', top: '40px', right: '40px', border: '4px solid #FF5252', color: '#FF5252', padding: '10px 20px', borderRadius: '12px', fontSize: '24px', fontWeight: 'bold', rotate: '15deg', pointerEvents: 'none' }}>NOPE</motion.div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div style={{ width: '100%', maxWidth: '900px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '40px' }}>Top Picks for Tonight</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                  {[
                    { name: 'The Pink Door', cuisine: 'Italian', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', hood: 'Pike Place' },
                    { name: 'Canlis', cuisine: 'Modern American', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', hood: 'Queen Anne' }
                  ].map(r => (
                    <div key={r.name} style={{ backgroundColor: '#1E1E2E', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <img src={r.img} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                       <div style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px' }}>{r.name}</h3>
                            <span style={{ color: '#B87333', fontWeight: 'bold' }}>10% OFF</span>
                          </div>
                          <p style={{ color: '#A0A0B0', fontSize: '14px', marginBottom: '24px' }}>{r.cuisine} • {r.hood}</p>
                          <button style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: '#B87333', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>Reserve a Table</button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

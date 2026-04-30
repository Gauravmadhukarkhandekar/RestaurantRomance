import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, Edit, Save, X, Utensils, MapPin, List, Grid, Users, Calendar, Search } from 'lucide-react';

const AdminPortal = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState('restaurants'); // restaurants, bookings, users
  const [viewMode, setViewMode] = useState('table'); // table, grid
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    neighborhood: 'Belltown',
    description: '',
    discount: '10%'
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRestaurants(list);
    } catch (e) {
      console.error("Error fetching restaurants: ", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await deleteDoc(doc(db, "restaurants", id));
        setRestaurants(restaurants.filter(r => r.id !== id));
      } catch (e) {
        console.error("Error deleting: ", e);
      }
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400';
      
      if (imageFile) {
        const storageRef = ref(storage, `restaurants/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "restaurants"), {
        ...newRestaurant,
        image: imageUrl,
        rating: 4.5,
        createdAt: new Date()
      });

      setIsAdding(false);
      setNewRestaurant({ name: '', cuisine: '', neighborhood: 'Belltown', description: '', discount: '10%' });
      setImageFile(null);
      fetchRestaurants();
    } catch (e) {
      alert("Error adding restaurant. Make sure your Firebase config is correct.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TableHeader = ({ children }) => (
    <th style={{ textAlign: 'left', padding: '16px', color: '#A0A0B0', fontWeight: '500', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {children}
    </th>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header & Tabs */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#B87333', marginBottom: '24px', fontSize: '32px' }}>Admin Dashboard</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '14px' }}>
            {[
              { id: 'restaurants', icon: <Utensils size={18} />, label: 'Restaurants' },
              { id: 'bookings', icon: <Calendar size={18} />, label: 'Bookings' },
              { id: 'users', icon: <Users size={18} />, label: 'Users' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  backgroundColor: activeTab === tab.id ? '#B87333' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#A0A0B0',
                  transition: 'all 0.3s'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#606070' }} />
              <input 
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '10px 12px 10px 40px', background: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', width: '240px' }}
              />
            </div>
            {activeTab === 'restaurants' && (
              <button 
                onClick={() => setIsAdding(true)}
                style={{ backgroundColor: '#B87333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
              >
                + Add New
              </button>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'restaurants' && (
        <>
          {/* View Toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '12px' }}>
            <button onClick={() => setViewMode('table')} style={{ background: 'none', border: 'none', color: viewMode === 'table' ? '#B87333' : '#606070', cursor: 'pointer' }}><List size={20} /></button>
            <button onClick={() => setViewMode('grid')} style={{ background: 'none', border: 'none', color: viewMode === 'grid' ? '#B87333' : '#606070', cursor: 'pointer' }}><Grid size={20} /></button>
          </div>

          {isAdding && (
             <div style={{ backgroundColor: '#1E1E2E', padding: '32px', borderRadius: '24px', marginBottom: '40px', border: '1px solid rgba(184, 115, 51, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h2 style={{ margin: 0 }}>Add Restaurant</h2>
                  <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', color: '#A0A0B0', cursor: 'pointer' }}><X /></button>
                </div>
                <form onSubmit={handleAddRestaurant} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <input placeholder="Name" required value={newRestaurant.name} onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})} style={{ padding: '12px', background: '#0F0F1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                  <input placeholder="Cuisine" required value={newRestaurant.cuisine} onChange={e => setNewRestaurant({...newRestaurant, cuisine: e.target.value})} style={{ padding: '12px', background: '#0F0F1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                  <select value={newRestaurant.neighborhood} onChange={e => setNewRestaurant({...newRestaurant, neighborhood: e.target.value})} style={{ padding: '12px', background: '#0F0F1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}>
                    <option>Belltown</option><option>Capitol Hill</option><option>Ballard</option><option>Queen Anne</option>
                  </select>
                  <input placeholder="Discount (e.g. 10%)" value={newRestaurant.discount} onChange={e => setNewRestaurant({...newRestaurant, discount: e.target.value})} style={{ padding: '12px', background: '#0F0F1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                  <input type="file" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#A0A0B0', gridColumn: 'span 2' }} />
                  <button type="submit" disabled={loading} style={{ gridColumn: 'span 2', padding: '16px', backgroundColor: '#B87333', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'Adding...' : 'Save Restaurant'}
                  </button>
                </form>
             </div>
          )}

          {viewMode === 'table' ? (
            <div style={{ backgroundColor: '#1E1E2E', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Cuisine</TableHeader>
                    <TableHeader>Neighborhood</TableHeader>
                    <TableHeader>Discount</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {filteredRestaurants.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={r.image} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        <span style={{ fontWeight: '500' }}>{r.name}</span>
                      </td>
                      <td style={{ padding: '16px', color: '#A0A0B0' }}>{r.cuisine}</td>
                      <td style={{ padding: '16px', color: '#A0A0B0' }}>{r.neighborhood}</td>
                      <td style={{ padding: '16px' }}><span style={{ color: '#B87333', background: 'rgba(184,115,51,0.1)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{r.discount}</span></td>
                      <td style={{ padding: '16px' }}>
                        <button onClick={() => handleDeleteRestaurant(r.id)} style={{ background: 'none', border: 'none', color: '#FF5252', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {filteredRestaurants.map(r => (
                <div key={r.id} style={{ backgroundColor: '#1E1E2E', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img src={r.image} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0 }}>{r.name}</h3>
                      <button onClick={() => handleDeleteRestaurant(r.id)} style={{ color: '#FF5252', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                    <p style={{ color: '#A0A0B0', fontSize: '14px' }}>{r.cuisine} • {r.neighborhood}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'bookings' && (
        <div style={{ textAlign: 'center', padding: '80px', backgroundColor: '#1E1E2E', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <Calendar size={48} style={{ color: '#606070', marginBottom: '16px' }} />
          <h3>No active bookings yet</h3>
          <p style={{ color: '#A0A0B0' }}>When users reserve tables via the mobile app, they will appear here.</p>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ textAlign: 'center', padding: '80px', backgroundColor: '#1E1E2E', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <Users size={48} style={{ color: '#606070', marginBottom: '16px' }} />
          <h3>Users list</h3>
          <p style={{ color: '#A0A0B0' }}>A table of all registered users will be displayed here.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;

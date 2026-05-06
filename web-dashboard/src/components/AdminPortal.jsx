import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { 
  Plus, Trash2, Edit, Save, X, Utensils, MapPin, List, Grid, Users, 
  Calendar, Search, ChevronRight, Settings, LayoutDashboard, 
  UserCircle, LogOut, CheckCircle2, MoreVertical, Menu as MenuIcon
} from 'lucide-react';

const API_URL = 'http://localhost:4000/api';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', description: '' });
  
  // Forms
  const [newRestaurant, setNewRestaurant] = useState({
    name: '', cuisine: '', neighborhood: 'Belltown', description: '', discount: '10%', menu: []
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Restaurants from AWS Backend
      const resSnap = await axios.get(`${API_URL}/restaurants`);
      setRestaurants(resSnap.data.map(d => ({ id: d.restaurantId, ...d })));
      
      const userRes = await axios.get(`${API_URL}/admin/users`);
      setUsers(userRes.data.map(u => ({ id: u.userId, ...u })));

      const bookSnap = await axios.get(`${API_URL}/bookings`);
      setBookings(bookSnap.data.map(d => ({ id: d.bookingId, ...d })));
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400';
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const res = await axios.post(`${API_URL}/admin/upload`, formData);
        imageUrl = res.data.url;
      }

      await axios.post(`${API_URL}/restaurants`, { 
        ...newRestaurant, 
        image: imageUrl 
      });

      setIsAdding(false);
      setNewRestaurant({ name: '', cuisine: '', neighborhood: 'Belltown', description: '', discount: '10%', menu: [] });
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Error adding restaurant. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  // UI Components
  const SidebarItem = ({ id, icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{ 
        width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderRadius: '16px', border: 'none', cursor: 'pointer',
        backgroundColor: activeTab === id ? 'rgba(184, 115, 51, 0.15)' : 'transparent',
        color: activeTab === id ? '#B87333' : '#A0A0B0',
        transition: 'all 0.3s', marginBottom: '8px', fontSize: '15px', fontWeight: activeTab === id ? '600' : '500'
      }}
    >
      {icon} {label}
    </button>
  );

  const StatCard = ({ label, value, icon, color }) => (
    <div style={{ backgroundColor: '#1E1E2E', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', flex: 1, minWidth: '240px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#A0A0B0', margin: '0 0 8px', fontSize: '14px' }}>{label}</p>
          <h2 style={{ margin: 0, fontSize: '32px' }}>{value}</h2>
        </div>
        <div style={{ backgroundColor: `${color}20`, color: color, padding: '12px', borderRadius: '16px' }}>{icon}</div>
      </div>
    </div>
  );

  const RenderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <StatCard label="Total Restaurants" value={restaurants.length} icon={<Utensils />} color="#B87333" />
        <StatCard label="Total Users" value={users.length || '2'} icon={<Users />} color="#4CAF50" />
        <StatCard label="Pending Bookings" value={bookings.length || '0'} icon={<Calendar />} color="#2196F3" />
      </div>

      <div style={{ backgroundColor: '#1E1E2E', padding: '32px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ margin: '0 0 24px' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#B87333' }}></div>
              <p style={{ margin: 0, flex: 1 }}>New restaurant <b>The Pink Door</b> was added to <b>Belltown</b></p>
              <span style={{ color: '#606070', fontSize: '12px' }}>2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.post(`${API_URL}/admin/users/update-role`, { userId, role: newRole });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const RenderTable = (type) => {
    const data = type === 'restaurants' ? restaurants : type === 'users' ? users : bookings;
    const columns = {
      restaurants: ['Name', 'Cuisine', 'Neighborhood', 'Menu', 'Actions'],
      users: ['User', 'Email', 'Role', 'Status', 'Actions'],
      bookings: ['Restaurant', 'User', 'Date & Time', 'Status', 'Actions']
    };

    return (
      <div style={{ backgroundColor: '#1E1E2E', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              {columns[type].map(c => (
                <th key={c} style={{ textAlign: 'left', padding: '20px', color: '#A0A0B0', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={item.image || item.profileImage || 'https://via.placeholder.com/40'} style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#606070' }}>{item.id.slice(0,8)}...</div>
                      </div>
                   </div>
                </td>
                <td style={{ padding: '20px', color: '#A0A0B0' }}>{item.email || item.cuisine || item.restaurantName}</td>
                <td style={{ padding: '20px', color: '#A0A0B0' }}>
                   {type === 'users' ? (
                     <select 
                       value={item.role || 'user'} 
                       onChange={(e) => handleRoleChange(item.id, e.target.value)}
                       style={{ background: '#0F0F1B', color: item.role === 'admin' ? '#B87333' : '#A0A0B0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 8px' }}
                     >
                       <option value="user">User</option>
                       <option value="admin">Admin</option>
                     </select>
                   ) : (
                     item.neighborhood || '2026-04-30'
                   )}
                </td>
                <td style={{ padding: '20px' }}>
                   {type === 'restaurants' ? (
                     <button 
                       onClick={() => setSelectedRestaurant(item)}
                       style={{ background: 'rgba(184, 115, 51, 0.1)', color: '#B87333', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                     >
                       Manage Menu ({item.menu?.length || 0})
                     </button>
                   ) : (
                     <span style={{ backgroundColor: 'rgba(76,175,80,0.1)', color: '#4CAF50', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>Active</span>
                   )}
                </td>
                <td style={{ padding: '20px' }}>
                   <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ background: 'none', border: 'none', color: '#A0A0B0', cursor: 'pointer' }}><Edit size={18} /></button>
                      <button onClick={() => handleDelete(type, item.id)} style={{ background: 'none', border: 'none', color: '#FF5252', cursor: 'pointer' }}><Trash2 size={18} /></button>
                   </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#606070' }}>No {type} found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Delete this ${type.slice(0,-1)}?`)) {
      try {
        let endpoint = `${API_URL}/${type}/${id}`;
        if (type === 'users') endpoint = `${API_URL}/admin/users/${id}`; // Admin endpoint for users
        
        await axios.delete(endpoint);
        fetchData();
      } catch (e) {
        console.error("Delete error:", e);
        alert("Failed to delete. Check console.");
      }
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0F0F1B', color: 'white' }}>
      {/* Sidebar Navigation */}
      <div style={{ width: '280px', backgroundColor: '#1E1E2E', padding: '32px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{ backgroundColor: '#B87333', padding: '8px', borderRadius: '10px' }}><LayoutDashboard size={24} color="white" /></div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Admin Panel</h2>
        </div>

        <div style={{ flex: 1 }}>
          <SidebarItem id="dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarItem id="restaurants" icon={<Utensils size={20} />} label="Restaurants" />
          <SidebarItem id="bookings" icon={<Calendar size={20} />} label="Bookings" />
          <SidebarItem id="users" icon={<Users size={20} />} label="User Profiles" />
          <SidebarItem id="settings" icon={<Settings size={20} />} label="Settings" />
        </div>

        <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Admin User</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#A0A0B0' }}>Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px', fontSize: '32px' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p style={{ color: '#A0A0B0', margin: 0 }}>Management console for Pike Place Pair</p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#606070' }} />
              <input 
                placeholder="Search anything..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '12px 16px 12px 44px', backgroundColor: '#1E1E2E', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', color: 'white', width: '280px' }} 
              />
            </div>
            {activeTab === 'restaurants' && (
              <button 
                onClick={() => setIsAdding(true)}
                style={{ backgroundColor: '#B87333', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={20} /> Add New
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        {isAdding && activeTab === 'restaurants' ? (
           <div style={{ backgroundColor: '#1E1E2E', padding: '40px', borderRadius: '32px', border: '1px solid rgba(184, 115, 51, 0.2)', marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h2 style={{ margin: 0 }}>Create Restaurant Profile</h2>
                <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', color: '#A0A0B0', cursor: 'pointer' }}><X /></button>
              </div>
              <form onSubmit={handleAddRestaurant} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#A0A0B0' }}>Restaurant Name</label>
                  <input required value={newRestaurant.name} onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})} style={{ padding: '14px', background: '#0F0F1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#A0A0B0' }}>Cuisine Type</label>
                  <input required value={newRestaurant.cuisine} onChange={e => setNewRestaurant({...newRestaurant, cuisine: e.target.value})} style={{ padding: '14px', background: '#0F0F1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#A0A0B0' }}>Neighborhood</label>
                  <select value={newRestaurant.neighborhood} onChange={e => setNewRestaurant({...newRestaurant, neighborhood: e.target.value})} style={{ padding: '14px', background: '#0F0F1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}>
                    <option>Belltown</option><option>Capitol Hill</option><option>Ballard</option><option>Queen Anne</option><option>Pike Place Market</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#A0A0B0' }}>Discount Text</label>
                  <input value={newRestaurant.discount} onChange={e => setNewRestaurant({...newRestaurant, discount: e.target.value})} style={{ padding: '14px', background: '#0F0F1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#A0A0B0' }}>Cover Image</label>
                  <input type="file" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#A0A0B0' }} />
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#A0A0B0' }}>About Restaurant</label>
                  <textarea rows="4" value={newRestaurant.description} onChange={e => setNewRestaurant({...newRestaurant, description: e.target.value})} style={{ padding: '14px', background: '#0F0F1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
                </div>
                <button type="submit" disabled={loading} style={{ gridColumn: 'span 2', padding: '18px', backgroundColor: '#B87333', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                  {loading ? 'Creating...' : 'Create Professional Profile'}
                </button>
              </form>
           </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <RenderDashboard />}
            {activeTab === 'restaurants' && RenderTable('restaurants')}
            {activeTab === 'users' && RenderTable('users')}
            {activeTab === 'bookings' && RenderTable('bookings')}
            {activeTab === 'settings' && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#A0A0B0' }}>
                <Settings size={64} style={{ marginBottom: '24px', opacity: 0.2 }} />
                <h3>System Settings</h3>
                <p>Configure API endpoints, S3 Buckets, and Email notifications.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;


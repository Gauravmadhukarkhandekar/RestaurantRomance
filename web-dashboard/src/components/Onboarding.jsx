import React, { useState } from 'react';
import { Camera, Briefcase, User, ChevronRight, Check, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const Onboarding = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    work: '',
    bio: '',
    image: null
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await axios.post(`${API_URL}/admin/upload`, form);
      setFormData({ ...formData, image: res.data.url });
    } catch (e) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/users/sync`, {
        userId: user.uid,
        name: formData.name,
        email: user.email,
        profileImage: formData.image,
        work: formData.work,
        bio: formData.bio
      });
      onComplete();
    } catch (e) {
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#0F0F1B', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '60px' }}>
           {[1,2,3].map(i => (
             <div key={i} style={{ flex: 1, height: '6px', backgroundColor: i <= step ? '#B87333' : 'rgba(255,255,255,0.1)', borderRadius: '3px', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="initial" animate="enter" exit="exit" style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: 'rgba(184, 115, 51, 0.1)', padding: '24px', borderRadius: '24px', display: 'inline-block', marginBottom: '32px' }}>
                <User size={40} color="#B87333" />
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>What's your name?</h2>
              <p style={{ color: '#A0A0B0', fontSize: '18px', marginBottom: '40px' }}>Let's start with the basics.</p>
              <input 
                autoFocus
                placeholder="First Name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '24px', backgroundColor: '#1E1E2E', border: '1px solid rgba(184, 115, 51, 0.3)', borderRadius: '24px', color: 'white', fontSize: '20px', textAlign: 'center', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} 
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="initial" animate="enter" exit="exit" style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: 'rgba(184, 115, 51, 0.1)', padding: '24px', borderRadius: '24px', display: 'inline-block', marginBottom: '32px' }}>
                <Briefcase size={40} color="#B87333" />
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>What do you do?</h2>
              <p style={{ color: '#A0A0B0', fontSize: '18px', marginBottom: '40px' }}>Your profession tells a story.</p>
              <input 
                autoFocus
                placeholder="Profession (e.g. Architect)" 
                value={formData.work} 
                onChange={e => setFormData({...formData, work: e.target.value})}
                style={{ width: '100%', padding: '24px', backgroundColor: '#1E1E2E', border: '1px solid rgba(184, 115, 51, 0.3)', borderRadius: '24px', color: 'white', fontSize: '20px', textAlign: 'center', outline: 'none', marginBottom: '20px' }} 
              />
              <textarea 
                placeholder="Write a short bio..." 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})}
                style={{ width: '100%', padding: '24px', backgroundColor: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', color: 'white', fontSize: '18px', height: '140px', outline: 'none', resize: 'none' }} 
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="initial" animate="enter" exit="exit" style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '220px', height: '280px', margin: '0 auto 40px' }}>
                 <div style={{ width: '100%', height: '100%', backgroundColor: '#1E1E2E', borderRadius: '32px', border: '2px dashed rgba(184, 115, 51, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                    {formData.image ? (
                      <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={formData.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Camera size={56} color="#606070" />
                    )}
                 </div>
                 <label style={{ position: 'absolute', bottom: '-15px', right: '-15px', backgroundColor: '#B87333', padding: '16px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 10px 20px rgba(184, 115, 51, 0.4)', transition: 'transform 0.2s' }}>
                    <Plus size={24} color="white" />
                    <input type="file" hidden onChange={handleUpload} />
                 </label>
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>Profile Photo</h2>
              <p style={{ color: '#A0A0B0', fontSize: '18px', marginBottom: '40px' }}>Make a great first impression!</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading || (step === 1 && !formData.name) || (step === 3 && !formData.image)}
          onClick={() => step < 3 ? setStep(step + 1) : handleFinish()}
          style={{ 
            marginTop: '60px', width: '100%', padding: '24px', backgroundColor: '#B87333', color: 'white', border: 'none', borderRadius: '24px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', boxShadow: '0 20px 40px rgba(184, 115, 51, 0.2)', transition: 'all 0.3s'
          }}
        >
          {loading ? <Loader2 className="animate-spin" /> : step === 3 ? 'Start Matching' : 'Continue'}
          {!loading && <ChevronRight size={24} />}
        </motion.button>
      </div>
    </div>
  );
};

export default Onboarding;

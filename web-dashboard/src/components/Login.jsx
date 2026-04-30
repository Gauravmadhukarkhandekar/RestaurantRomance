import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Heart, Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle at center, #1E1E2E 0%, #0F0F1B 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '440px', 
        backgroundColor: 'rgba(30, 30, 46, 0.8)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '32px', 
        padding: '48px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        border: '1px solid rgba(184, 115, 51, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative element */}
        <div style={{ 
          position: 'absolute', 
          top: '-100px', 
          right: '-100px', 
          width: '200px', 
          height: '200px', 
          background: 'rgba(184, 115, 51, 0.1)', 
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}></div>

        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            backgroundColor: 'rgba(184, 115, 51, 0.1)', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            border: '1px solid rgba(184, 115, 51, 0.3)'
          }}>
            <Heart size={32} color="#B87333" fill="#B87333" style={{ opacity: 0.8 }} />
          </div>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px' }}>
            {isLogin ? 'Welcome Back' : 'Join the Romance'}
          </h1>
          <p style={{ color: '#A0A0B0', fontSize: '16px' }}>
            {isLogin ? 'Manage your curated date experiences' : 'Start your journey with Pike Place Pair'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#606070" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '16px 16px 16px 48px', 
                backgroundColor: '#0F0F1B', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '16px', 
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#606070" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '16px 16px 16px 48px', 
                backgroundColor: '#0F0F1B', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '16px', 
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#FF5252', fontSize: '14px', margin: 0, textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '12px',
              padding: '18px', 
              backgroundColor: '#B87333', 
              color: 'white', 
              border: 'none', 
              borderRadius: '16px', 
              fontSize: '16px',
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s, background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ padding: '0 15px', color: '#606070', fontSize: '14px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{ 
              padding: '16px', 
              backgroundColor: 'transparent', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.2)', 
              borderRadius: '16px', 
              fontSize: '16px',
              fontWeight: '500', 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
            Continue with Google
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#A0A0B0', 
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

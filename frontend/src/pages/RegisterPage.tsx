import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AxiosError } from 'axios';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#fff', padding: '36px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '360px' }}>
        <h1 style={{ textAlign: 'center', color: '#4F46E5', marginBottom: '8px' }}>📅 Smart Schedule Pro</h1>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '24px', fontSize: '14px' }}>Create your account</p>

        {error && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', value: name, setter: setName, type: 'text', placeholder: 'Farrisu Deen' },
            { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'you@example.com' },
            { label: 'Password (min 6 chars)', value: password, setter: setPassword, type: 'password', placeholder: '••••••' },
          ].map(field => (
            <div key={field.label} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>{field.label}</label>
              <input
                type={field.type} value={field.value}
                onChange={e => field.setter(e.target.value)} required
                placeholder={field.placeholder}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <button
            type="submit" disabled={isLoading}
            style={{ width: '100%', padding: '11px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: 'bold' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

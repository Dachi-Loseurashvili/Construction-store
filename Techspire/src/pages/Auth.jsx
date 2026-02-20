import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import API from '../api/axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await API.post('/users/register', formData);
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-black">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <button onClick={() => setIsLogin(!isLogin)} className="mt-2 text-sm text-gray-500 underline underline-offset-4">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
          {error && <div className="mb-4 text-center text-sm text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input required name="fullName" onChange={handleChange} type="text" placeholder="Full Name" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input required name="phoneNumber" onChange={handleChange} type="tel" placeholder="Phone Number" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
                </div>
              </>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input required name="email" onChange={handleChange} type="email" placeholder="Email address" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input required name="password" onChange={handleChange} type="password" placeholder="Password" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <button disabled={isLoading} className="flex w-full items-center justify-center rounded-full bg-black py-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400">
              {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
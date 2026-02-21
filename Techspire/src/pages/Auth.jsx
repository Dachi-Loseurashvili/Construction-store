import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'ავტორიზაცია ვერ მოხერხდა');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-black">
            ადმინისტრატორი
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            შესვლა მართვის პანელში
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
          {error && <div className="mb-4 text-center text-sm text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input required name="email" onChange={handleChange} type="email" placeholder="ელ-ფოსტა" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input required name="password" onChange={handleChange} type="password" placeholder="პაროლი" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <button disabled={isLoading} className="flex w-full items-center justify-center rounded-full bg-black py-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400">
              {isLoading ? <Loader2 className="animate-spin" /> : 'შესვლა'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
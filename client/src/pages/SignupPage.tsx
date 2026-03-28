import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Signup failed');
      } else {
        toast.success('Account created! Please login.');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen p-4">
      <div className="flex min-h-[500px] w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mx-auto py-12">
        <div className="w-full flex flex-col items-center justify-center bg-white px-8">
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center">
            <h2 className="text-4xl text-gray-900 font-medium tracking-tight">Join us</h2>
            <p className="text-sm text-gray-500/90 mt-3 text-center">Create your health companion account</p>

            <div className="flex items-center mt-8 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500 transition-colors">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full" 
                required 
              />                 
            </div>

            <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500 transition-colors">
              <input 
                type="email" 
                placeholder="Email id" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full" 
                required 
              />                 
            </div>

            <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500 transition-colors">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full" 
                required 
              />
            </div>

            <button disabled={loading} type="submit" className="mt-8 w-full h-12 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition-colors font-semibold disabled:opacity-70 flex justify-center items-center shadow-lg shadow-indigo-100 uppercase tracking-wide">
              {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : 'Sign Up'}
            </button>
            <p className="text-gray-500/90 text-sm mt-6">Already have an account? <Link href="/login" className="text-indigo-500 hover:text-indigo-600 hover:underline font-medium">Log in</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}

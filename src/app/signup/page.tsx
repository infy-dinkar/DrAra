"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      toast.error('You must agree to the Terms & Conditions.');
      return;
    }
    
    setLoading(true);

    try {
      // Register request
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      
      // Auto login after successful signup
      const loginRes = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        toast.success('Registration successful. Please log in.');
        router.push('/');
      } else {
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }

    } catch (error) {
      toast.error('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen p-4">
      <div className="flex min-h-[500px] w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mx-auto py-12">
        
        {/* Signup Form */}
        <div className="w-full flex flex-col items-center justify-center bg-white">
          <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col items-center justify-center">
            <h2 className="text-4xl text-gray-900 font-medium">Create an account</h2>
            <p className="text-sm text-gray-500/90 mt-3 text-center">Join us today! Please enter your details to register.</p>

            <div className="flex items-center mt-8 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
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
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
              </svg>
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
              <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
              </svg>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full" 
                required 
              />
            </div>

            <div className="w-full flex items-center mt-6 text-gray-500/80">
              <div className="flex items-center gap-2">
                <input 
                  className="h-4 w-4 text-indigo-500 rounded border-gray-300 focus:ring-indigo-500" 
                  type="checkbox" 
                  id="terms" 
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required 
                />
                <label className="text-sm cursor-pointer" htmlFor="terms">
                  I agree to the <a href="#" className="text-indigo-500 hover:text-indigo-600 hover:underline">Terms & Conditions</a>
                </label>
              </div>
            </div>

            <button disabled={loading} type="submit" className="mt-8 w-full h-12 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition-colors font-medium disabled:opacity-70 flex justify-center items-center">
              {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : 'Sign up'}
            </button>
            <p className="text-gray-500/90 text-sm mt-6">
              Already have an account? <Link href="/" className="text-indigo-500 hover:text-indigo-600 hover:underline font-medium">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

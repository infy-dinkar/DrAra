import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/');
  }

  let user: any = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || 'healthportal_secret_key_123');
  } catch (error) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-delayed"></div>

      {/* Floating Icons Container */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* Bread / Carbs (Diet context) */}
        <div className="absolute top-[15%] left-[10%] animate-float">
          <div className="w-20 h-20 bg-amber-50 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-12 border-2 border-white">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 18h12a2 2 0 0 0 2-2V8.5a2.5 2.5 0 0 0-2.5-2.5H6.5A2.5 2.5 0 0 0 4 8.5V16a2 2 0 0 0 2 2Z"></path>
              <path d="M4 11h16"></path>
              <path d="M4 14.5h16"></path>
            </svg>
          </div>
        </div>

        {/* Blood Drop (Blood Sugar context) */}
        <div className="absolute top-[25%] right-[15%] animate-float-delayed">
          <div className="w-24 h-24 bg-red-50 rounded-full shadow-2xl flex items-center justify-center border-4 border-white">
            <svg className="w-12 h-12 text-red-500 animate-pulse-glow" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
            </svg>
          </div>
        </div>

        {/* Medical Cross (Diabetes context) */}
        <div className="absolute bottom-[20%] left-[15%] animate-float-fast">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl shadow-lg flex items-center justify-center transform rotate-[15deg] border-2 border-white">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M12 8v8"></path>
              <path d="M8 12h8"></path>
            </svg>
          </div>
        </div>

        {/* Stethoscope / Doctor context */}
        <div className="absolute top-[10%] right-[30%] animate-float">
          <div className="w-16 h-16 bg-teal-50 rounded-full shadow-lg flex items-center justify-center transform -rotate-6 border-2 border-white">
            <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
              <circle cx="20" cy="10" r="2"></circle>
            </svg>
          </div>
        </div>

        {/* Apple (Digestion context) */}
        <div className="absolute bottom-[25%] right-[20%] animate-float-delayed">
          <div className="w-20 h-20 bg-green-50 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-12 border-2 border-white">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
              <path d="M10 2c1 .5 2 2 2 5"></path>
            </svg>
          </div>
        </div>

        {/* Taste / Tongue / Flavor context */}
        <div className="absolute bottom-[10%] right-[45%] animate-float-fast">
          <div className="w-14 h-14 bg-pink-50 rounded-full shadow-md flex items-center justify-center transform rotate-12 border-2 border-white">
            <svg className="w-7 h-7 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="m2 12 5.25 5 2.625-3 3.375 5 2.25-2 1.313 1 5.187-5"></path>
              <path d="M19 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center border border-white">
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
          GET READY TO MEET
          <span className="block text-indigo-600 mt-2 text-6xl">Dr.AAra</span>
        </h1>
        
        <p className="mt-4 text-slate-500 font-medium text-lg">Your intelligent health companion.</p>

        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center relative z-20 pointer-events-auto">
          
          <Link href="#" className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-200 hover:-translate-y-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
              <rect x="2" y="6" width="14" height="12" rx="2"></rect>
            </svg>
            Live Video chat
          </Link>
          
          <Link href="#" className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-indigo-600 border-2 border-indigo-600 rounded-full font-semibold transition-all shadow-lg shadow-slate-200 hover:-translate-y-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Text chat
          </Link>

        </div>

        <form action={async () => {
          'use server';
          const c = await cookies();
          c.delete('auth_token');
          redirect('/');
        }} className="mt-16 border-t border-slate-200 pt-8 relative z-20 pointer-events-auto">
          <button type="submit" className="text-sm text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-4">
            Sign Out Securely
          </button>
        </form>
      </div>

    </div>
  );
}

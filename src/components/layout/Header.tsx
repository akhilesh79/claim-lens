import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
// import { toggleTheme } from '@/features/ui/uiSlice';

export function Header() {
  // const dispatch = useAppDispatch();
  // const theme = useAppSelector((s) => s.ui.theme);

  return (
    <header className='sticky top-0 z-40 border-b border-white/[0.06] bg-[#050d1a]/80 backdrop-blur-xl'>
      <div className='mx-auto max-w-[1700px] px-5 h-14 flex items-center justify-between gap-4'>
        {/* Brand */}
        <div className='flex items-center gap-2.5 flex-shrink-0'>
          <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-glow-blue'>
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2.5'
              strokeLinecap='round'
            >
              <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <div>
            <span className='text-sm font-bold text-white tracking-tight'>ClaimLens</span>
            <span className='hidden sm:inline text-xs text-slate-500 ml-1.5'>AI Review Platform</span>
          </div>
        </div>

        {/* Nav */}
        <nav className='flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1'>
          <NavLink
            to='/claims'
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap
              ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`
            }
          >
            ⚡ Claim Decision Engine
          </NavLink>
          <NavLink
            to='/imaging'
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap
              ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`
            }
          >
            🔬 Imaging Validation
          </NavLink>
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-2 flex-shrink-0'>
          {/* <button
            onClick={() => dispatch(toggleTheme())}
            title="Toggle theme"
            className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors text-sm"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button> */}
          <div className='flex items-center gap-2 pl-2 border-l border-white/[0.08]'>
            <div className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white'>
              AI
            </div>
            <span className='hidden sm:block text-xs text-slate-400'>Reviewer</span>
          </div>
        </div>
      </div>
    </header>
  );
}

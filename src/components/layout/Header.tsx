import { NavLink } from 'react-router-dom';
import { FiCheckCircle, FiSun, FiMoon } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleTheme } from '@/features/ui/uiSlice';

export function Header() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const isDark = theme === 'dark';

  return (
    <header
      className='sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300'
      style={{
        background: 'var(--header-bg)',
        borderColor: 'var(--header-border)',
      }}
    >
      <div className='mx-auto max-w-[1700px] px-5 h-14 flex items-center justify-between gap-4'>
        {/* Brand */}
        <div className='flex items-center gap-2.5 flex-shrink-0'>
          <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center'>
            <FiCheckCircle size={14} color='white' strokeWidth={2.5} />
          </div>
          <div>
            <span className='text-sm font-bold tracking-tight' style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              ClaimLens
            </span>
            <span className='hidden sm:inline text-xs ml-1.5' style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
              AI Review Platform
            </span>
          </div>
        </div>

        {/* Nav tabs */}
        <nav
          className='flex items-center gap-1 rounded-xl p-1 border'
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
            borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.09)',
          }}
        >
          <NavLink
            to='/claims'
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap
               ${
                 isActive
                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                   : isDark
                     ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                     : 'text-slate-500 hover:text-slate-800 hover:bg-black/[0.05]'
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
                   : isDark
                     ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                     : 'hover:text-slate-800 hover:bg-black/[0.05]'
               }`
            }
          >
            🔬 Image Validation
          </NavLink>
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-2 flex-shrink-0'>
          {/* ── Theme toggle ── */}
          <button
            onClick={() => dispatch(toggleTheme())}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className='w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110'
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
              color: isDark ? '#94a3b8' : '#475569',
            }}
          >
            {isDark ? (
              <FiSun size={15} />
            ) : (
              <FiMoon size={14} />
            )}
          </button>

          {/* Divider + avatar */}
          <div
            className='flex items-center gap-2 pl-2 border-l'
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.10)' }}
          >
            <div className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white'>
              AI
            </div>
            <span className='hidden sm:block text-xs' style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
              Reviewer
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

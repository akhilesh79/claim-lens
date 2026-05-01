import { NavLink, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiSun, FiMoon, FiUpload } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleTheme } from '@/features/ui/uiSlice';
import { clearClaimApiData } from '@/features/claims/claimsSlice';
import { clearImagingApiData } from '@/features/imaging/imagingSlice';
import { clearForgeryData } from '@/features/forgery/forgerySlice';

export function Header() {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const theme     = useAppSelector((s) => s.ui.theme);
  const isDark    = theme === 'dark';

  function handleNewClaim() {
    dispatch(clearClaimApiData());
    dispatch(clearImagingApiData());
    dispatch(clearForgeryData());
    navigate('/');
  }

  return (
    <header
      className='sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300'
      style={{ background: 'var(--header-bg)', borderColor: 'var(--header-border)' }}
    >
      <div className='mx-auto max-w-[1700px] px-3 sm:px-5 h-14 flex items-center justify-between gap-2 sm:gap-4'>

        {/* Brand */}
        <div className='flex items-center gap-2 flex-shrink-0'>
          <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0'>
            <FiCheckCircle size={14} color='white' strokeWidth={2.5} />
          </div>
          <span
            className='text-sm font-bold tracking-tight font-heading hidden xs:block'
            style={{ color: isDark ? '#ffffff' : '#0f172a' }}
          >
            ClaimLens
          </span>
          <span className='hidden lg:inline text-xs' style={{ color: isDark ? '#64748b' : '#64748b' }}>
            AI Review Platform
          </span>
        </div>

        {/* Nav tabs — short labels on mobile, full labels on md+ */}
        <nav
          className='flex items-center gap-0.5 sm:gap-1 rounded-xl p-1 border flex-shrink-0'
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
            borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.09)',
          }}
        >
          <NavLink
            to='/claims'
            className={({ isActive }) =>
              `px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap
               ${isActive
                 ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                 : isDark
                   ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                   : 'text-slate-500 hover:text-slate-800 hover:bg-black/[0.05]'}`
            }
          >
            <span className='hidden md:inline'>⚡ Claim Decision Engine</span>
            <span className='md:hidden'>⚡ Claims</span>
          </NavLink>
          <NavLink
            to='/imaging'
            className={({ isActive }) =>
              `px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap
               ${isActive
                 ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                 : isDark
                   ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                   : 'text-slate-500 hover:text-slate-800 hover:bg-black/[0.05]'}`
            }
          >
            <span className='hidden md:inline'>🔬 Image Validations</span>
            <span className='md:hidden'>🔬 Imaging</span>
          </NavLink>
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
          {/* New Claim */}
          <button
            onClick={handleNewClaim}
            title='Analyze a new claim'
            className='flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border'
            style={{
              background: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
              borderColor: isDark ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.20)',
              color: isDark ? '#93c5fd' : '#2563eb',
            }}
          >
            <FiUpload size={12} />
            <span className='hidden sm:inline'>New Claim</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className='w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0'
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
              color: isDark ? '#94a3b8' : '#475569',
            }}
          >
            {isDark ? <FiSun size={15} /> : <FiMoon size={14} />}
          </button>

          {/* Avatar */}
          <div
            className='hidden sm:flex items-center gap-2 pl-2 border-l'
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.10)' }}
          >
            <div className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white'>
              AI
            </div>
            <span className='hidden lg:block text-xs' style={{ color: isDark ? '#64748b' : '#64748b' }}>
              Reviewer
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

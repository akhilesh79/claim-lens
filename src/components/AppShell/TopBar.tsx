import { Link } from 'react-router-dom';
import { Search, HelpCircle, Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleTheme } from '@/features/ui/uiSlice';
import { Input, Button } from '@/ui';

export function TopBar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const isDark = theme === 'dark';

  return (
    <header className='h-14 border-b border-border bg-surface flex items-center px-4 gap-4'>
      <Link to='/cases' className='flex items-center gap-2 flex-shrink-0'>
        <div className='h-7 w-7 rounded-md bg-brand-500 grid place-items-center text-text-inverse font-semibold'>
          CL
        </div>
        <span className='text-h3 text-text'>ClaimLens</span>
      </Link>
      <div className='flex-1' />

      <Button
        variant='ghost'
        size='icon'
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        onClick={() => dispatch(toggleTheme())}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
      <Button variant='ghost' size='icon' aria-label='Help'>
        <HelpCircle size={18} />
      </Button>
      <div className='h-7 w-7 rounded-full bg-brand-500 text-text-inverse grid place-items-center text-caption font-semibold'>
        AM
      </div>
    </header>
  );
}

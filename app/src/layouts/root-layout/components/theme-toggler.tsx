import { useEffect, useState } from 'react';
import { Icon } from '~/components/ui/icon';
import { getFromLocalStorage } from '~/utils/storage';
import { setAppTheme, toggleAppTheme } from '~/utils/styles-managing';

export function ThemeToggler() {
  const [isDark, setIsDark] = useState<boolean>(false);

  const handleClick = () => {
    setIsDark((prevValue) => !prevValue);
    toggleAppTheme();
  };

  useEffect(() => {
    const storedTheme = getFromLocalStorage('theme');

    if (storedTheme === 'dark') {
      setAppTheme('dark');
      setIsDark(true);
    } else {
      setAppTheme('light');
      setIsDark(false);
    }
  }, []);

  return (
    <button
      onClick={handleClick}
      className="hover:bg-primary-bg-light dark:hover:bg-primary-bg-darker mx-auto mb-2 flex h-10 w-10 flex-col items-center gap-2 rounded-full p-1 text-center"
    >
      {isDark ? <Icon id="moon" /> : <Icon id="sun" />}
    </button>
  );
}

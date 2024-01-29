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
      className="absolute right-0 h-8 w-8 gap-2 rounded-full p-1 hover:bg-primary-bg-light dark:hover:bg-primary-bg-darker xs:bottom-1 xs:right-auto xs:h-10 xs:w-10 lg:right-1"
    >
      {isDark ? <Icon id="moon" /> : <Icon id="sun" />}
    </button>
  );
}

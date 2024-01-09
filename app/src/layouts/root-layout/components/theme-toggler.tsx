import { useEffect, useState } from 'react';
import { getFromLocalStorage } from '~/utils/storage';
import { setAppTheme, toggleAppTheme } from '~/utils/styles-managing';

export function ThemeToggler() {
  const [isDark, setIsDark] = useState<boolean>(false);

  const handleChange = () => {
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
    <div className="pt-3 text-center">
      dark?
      <input
        type="checkbox"
        className="mx-auto block h-6 w-6"
        checked={isDark}
        onChange={handleChange}
      />
    </div>
  );
}

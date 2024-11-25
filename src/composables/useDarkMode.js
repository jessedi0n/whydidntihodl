import { ref, onMounted, watch } from 'vue';

export function useDarkMode() {
  const isDark = ref(false);

  const updateThemeColor = (dark) => {
    const themeColor = dark ? '#0F172A' : '#EEF2FF';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  };

  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('darkMode', isDark.value.toString());
    updateDarkMode();
  };

  const updateDarkMode = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      updateThemeColor(true);
    } else {
      document.documentElement.classList.remove('dark');
      updateThemeColor(false);
    }
  };

  onMounted(() => {
    // Check localStorage first
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      isDark.value = savedDarkMode === 'true';
    } else {
      // Fall back to system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    updateDarkMode();
  });

  return {
    isDark,
    toggleDarkMode
  };
}
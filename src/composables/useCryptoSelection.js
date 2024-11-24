import { ref } from 'vue';
import { cryptocurrencies } from '../config/cryptocurrencies';

export function useCryptoSelection() {
  const isDropdownOpen = ref(false);
  
  const selectedCrypto = ref(
    localStorage.getItem('lastSelectedCrypto') 
      ? cryptocurrencies.find(c => c.id === JSON.parse(localStorage.getItem('lastSelectedCrypto')).id) 
      : cryptocurrencies[0]
  );

  const selectCrypto = (crypto) => {
    selectedCrypto.value = crypto;
    localStorage.setItem('lastSelectedCrypto', JSON.stringify(crypto));
    isDropdownOpen.value = false;
  };

  return {
    selectedCrypto,
    isDropdownOpen,
    selectCrypto
  };
}
export const getCryptoIconPath = (symbol) => {
    try {
      return new URL(
        `../assets/crypto-icons/${symbol.toLowerCase()}.svg`, 
        import.meta.url
      ).href;
    } catch (error) {
      console.error('Failed to load crypto icon:', error);
      return '';
    }
  };
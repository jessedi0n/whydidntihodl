const SYMBOL_MAP = {
    'bitcoin': 'BTCUSDT',
    'ethereum': 'ETHUSDT',
    'solana': 'SOLUSDT',
    'cardano': 'ADAUSDT',
    'polkadot': 'DOTUSDT',
    'ripple': 'XRPUSDT',
    'binancecoin': 'BNBUSDT',
    'avalanche-2': 'AVAXUSDT',
    'matic-network': 'MATICUSDT',
    'chainlink': 'LINKUSDT',
    'uniswap': 'UNIUSDT'
  };
  
  export const fetchCryptoData = async (cryptoId, date) => {
    const symbol = SYMBOL_MAP[cryptoId];
    const EARLIEST_DATE = new Date('2017-08-17');
    
    try {
      // Get timestamp for the selected date (start of day)
      const startTime = new Date(date);
      startTime.setUTCHours(0, 0, 0, 0);

      // Add validation for earliest possible date
      if (startTime < EARLIEST_DATE) {
        throw new Error('Data not available before August 17, 2017');
      }

      const timestamp = startTime.getTime();
  
      // Fetch historical price (daily kline/candlestick data)
      const historicalResponse = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&startTime=${timestamp}&limit=1`
      );
      const historicalData = await historicalResponse.json();
  
      // Fetch current price
      const currentResponse = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
      );
      const currentData = await currentResponse.json();
  
      if (!historicalData.length) {
        throw new Error('No historical data available for this date');
      }
  
      return {
        past: parseFloat(historicalData[0][4]), // closing price
        current: parseFloat(currentData.price)
      };
    } catch (err) {
      console.error('API Error:', err);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  };
<template>
    <div class="w-full max-w-md mt-10 p-4">
      <form @submit.prevent="calculate">
        <div class="mb-4">
          <label for="amount" class="block text-gray-700 dark:text-gray-300 mb-1">
            {{ selectedAmountLabel }}
          </label>
          <div class="flex items-center space-x-2">
            <input
              type="number"
              v-model="amount"
              id="amount"
              min="0"
              step="any"
              :placeholder="`1 ${selectedCrypto.symbol}`"
              class="w-full px-4 py-2 border rounded-lg text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-indigo-200 dark:border-slate-600 transition"
            />
            <div class="relative">
              <button
                type="button"
                @click="isDropdownOpen = !isDropdownOpen"
                class="px-3 py-2 border border-indigo-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition flex items-center space-x-2 w-32"
              >
                <img 
                  :src="getCryptoIconPath(selectedCrypto.symbol)"
                  :alt="selectedCrypto.name"
                  class="w-5 h-5"
                />
                <span>{{ selectedCrypto.symbol }}</span>
              </button>
              
              <div
                v-if="isDropdownOpen"
                class="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-indigo-200 dark:border-slate-600 z-10 max-h-60 overflow-y-auto"
              >
                <button
                  v-for="crypto in cryptocurrencies"
                  :key="crypto.id"
                  @click="selectCrypto(crypto)"
                  class="w-full px-4 py-2 flex items-center space-x-2 hover:bg-indigo-50 dark:hover:bg-slate-700 transition text-slate-800 dark:text-slate-100"
                >
                  <img 
                    :src="getCryptoIconPath(crypto.symbol)"
                    :alt="crypto.name"
                    class="w-5 h-5"
                  />
                  <span>{{ crypto.symbol }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label for="date" class="block text-gray-700 dark:text-gray-300 mb-1">
            {{ selectedDateLabel }}
          </label>
          <input
            type="date"
            v-model="date"
            id="date"
            :max="currentDate"
            @input="validateDate"
            class="w-full px-4 py-2 border rounded-lg text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-indigo-200 dark:border-slate-600 transition [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:bg-transparent [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white w-full py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Calculating...' : selectedButtonLabel }}
        </button>
      </form>
  
      <div v-if="error" class="mt-4 text-rose-500 dark:text-rose-400 text-center">
        {{ error }}
      </div>
      
      <Results 
        v-if="result"
        :result="result" 
        :equivalentPurchases="calculateEquivalentPurchases(result.currentValue)" 
        @reloadPurchases="reloadPurchases"
        @close="result = null"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import Results from "./Results.vue";
  import { EQUIVALENT_PURCHASES } from "../utils/equivalentPurchases";
  import { calculateEquivalentPurchases } from "../utils/purchases";
  import { getCryptoIconPath } from "../utils/cryptoIcons";
  
  const cryptocurrencies = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
    { id: 'ripple', symbol: 'XRP', name: 'XRP' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
    { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
    { id: 'matic-network', symbol: 'MATIC', name: 'Polygon' },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
    { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },

  ];
  
  const amountLabels = [
    "Your poor life choices (in coins):",
    "Enter your missed fortune (in coins):",
    "Your coulda-woulda-shoulda amount (in coins):",
    "Number of coins you panic sold (in coins):",
    "Coins sacrificed to weak hands (in coins):",
    "Amount you sold 'just to be safe' (in coins):",
    "Tokens lost to FUD (in coins):",
    "Your 'crypto is definitely dead' sale (in coins):",
    "Coins that triggered your stop loss (in coins):",
    "Your 'I'll buy back lower' amount:",
    "Quantity sold during the dip™:",
    "Your 'this is the top' prediction:",
    "Amount traded for instant regret:",
    "Your 'I'm taking profits' mistake:",
    "Coins that met your paper hands:",
    "Your 'the chart looks scary' sale:",
    "Your 'I'll wait for the bottom' coins:",
    "Amount you'll tell your grandkids about:",
    "Your 'I knew I should have bought more' amount:",
    "Tokens that haunt your dreams:",
  ];
  
  const dateLabels = [
    "Date of Regret:",
    "When did your diamond hands crack?",
    "The day you'll tell therapists about:",
    "When did you betray HODL?",
    "Your 'I know better than markets' day:",
  ];
  
  const buttonLabels = [
    "Show Me the Pain",
    "Calculate My Regrets",
    "Hurt My Feelings",
    "Activate Pain Mode",
    "Quantify My Poor Choices",
    "Deploy Regret Calculator",
    "Summon the Pain Train",
    "Start Emotional Damage",
    "Begin Crying Sequence",
    "Calculate Lost Lambo Count",
    "Show What Could Have Been",
  ];
  
  const selectedCrypto = ref(
    // Load from localStorage if available, otherwise use first cryptocurrency
    localStorage.getItem('lastSelectedCrypto') 
      ? cryptocurrencies.find(c => c.id === JSON.parse(localStorage.getItem('lastSelectedCrypto')).id) 
      : cryptocurrencies[0]
  );
  const amount = ref(null);
  const date = ref(null);
  const result = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  const selectedAmountLabel = ref(amountLabels[Math.floor(Math.random() * amountLabels.length)]);
  const selectedDateLabel = ref(dateLabels[Math.floor(Math.random() * dateLabels.length)]);
  const selectedButtonLabel = ref(buttonLabels[Math.floor(Math.random() * buttonLabels.length)]);
  
  const isDropdownOpen = ref(false);
  
  const currentDate = ref(new Date().toISOString().split('T')[0]);
  
  const fetchCryptoData = async (cryptoId, date) => {
    // Convert crypto IDs to Binance symbols
    const symbolMap = {
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
    const symbol = symbolMap[cryptoId];
    
    try {
      // Get timestamp for the selected date (start of day)
      const startTime = new Date(date);
      startTime.setUTCHours(0, 0, 0, 0);
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
  
  const calculate = async () => {
    if (!amount.value || !date.value) {
      alert("Please fill in all fields!");
      return;
    }
  
    loading.value = true;
    error.value = null;
    result.value = null;
  
    try {
      const prices = await fetchCryptoData(selectedCrypto.value.id, date.value);
      const cryptoAmount = Number(amount.value);
      const currentValue = cryptoAmount * prices.current;
  
      result.value = {
        pastValue: cryptoAmount * prices.past,
        cryptoAmount,
        currentValue,
        cryptoName: selectedCrypto.value.name,
        cryptoSymbol: selectedCrypto.value.symbol,
        emoji: currentValue > 1000000 ? '😱' : currentValue > 100000 ? '😭' : '😔'
      };
    } catch (err) {
      error.value = "Failed to fetch cryptocurrency data. Please try again.";
    } finally {
      loading.value = false;
    }
  };
  
  const reloadPurchases = () => {
    // Force a re-render by creating a new result object
    result.value = { ...result.value };
  };
  
  const selectCrypto = (crypto) => {
    selectedCrypto.value = crypto;
    // Save to localStorage when selecting new crypto
    localStorage.setItem('lastSelectedCrypto', JSON.stringify(crypto));
    isDropdownOpen.value = false;
  };
  
  const validateDate = (event) => {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison

    if (selectedDate > today) {
      date.value = currentDate.value;
    }
  };
  </script>
  
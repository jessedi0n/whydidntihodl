<template>
    <div 
      class="w-full max-w-md mt-6 p-4"
      role="main"
    >
        <div class="text-center mb-4">
          <h1 class="text-3xl font-bold text-slate-800 dark:text-white">Why Didn't I HODL?!</h1>
          <p class="text-lg text-slate-600 dark:text-white/90">How much did you miss out on?</p>
        </div>
        <div 
          class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-indigo-200 dark:border-slate-600"
          role="form"
          aria-label="Cryptocurrency calculator"
        >
          <form @submit.prevent="calculate">
            <div class="mb-4">
              <label 
                id="crypto-label" 
                for="crypto-select" 
                class="block text-gray-700 dark:text-gray-300 mb-1"
              >
                {{ selectedCryptoLabel }}
              </label>
              <div class="relative">
                <button
                  id="crypto-select"
                  type="button"
                  @click="toggleDropdown"
                  @keydown.escape="closeDropdown"
                  @keydown.enter="toggleDropdown"
                  @keydown.space="toggleDropdown"
                  aria-haspopup="listbox"
                  :aria-expanded="isDropdownOpen"
                  :aria-labelledby="crypto-label"
                  class="w-full px-3 py-2 border border-indigo-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition flex items-center space-x-2"
                >
                  <img 
                    :src="getCryptoIcon(selectedCrypto.symbol)"
                    :alt="selectedCrypto.name"
                    aria-hidden="true"
                    class="w-5 h-5"
                  />
                  <span>{{ selectedCrypto.name }}</span>
                  <span 
                    class="sr-only"
                  >
                    Selected cryptocurrency: {{ selectedCrypto.name }}. Press Enter to change selection
                  </span>
                </button>
                
                <div
                  v-if="isDropdownOpen"
                  role="listbox"
                  aria-labelledby="crypto-label"
                  class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-indigo-200 dark:border-slate-600 z-10 max-h-60 overflow-y-auto"
                  @keydown.up.prevent="focusPreviousOption"
                  @keydown.down.prevent="focusNextOption"
                >
                  <button
                    v-for="(crypto, index) in cryptocurrencies"
                    :key="crypto.id"
                    @click="selectCrypto(crypto)"
                    @keydown.enter="selectCrypto(crypto)"
                    role="option"
                    :aria-selected="selectedCrypto.id === crypto.id"
                    :tabindex="isDropdownOpen ? 0 : -1"
                    :ref="el => optionRefs[index] = el"
                    class="w-full px-4 py-2 flex items-center space-x-2 hover:bg-indigo-50 dark:hover:bg-slate-700 transition text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <img 
                      :src="getCryptoIcon(crypto.symbol)"
                      :alt="crypto.name"
                      aria-hidden="true"
                      class="w-5 h-5"
                    />
                    <span>{{ crypto.name }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label 
                for="amount" 
                class="block text-gray-700 dark:text-gray-300 mb-1"
              >
                {{ selectedAmountLabel }}
              </label>
              <input
                type="number"
                v-model="amount"
                id="amount"
                min="0"
                step="any"
                :placeholder="`1 ${selectedCrypto.symbol}`"
                :aria-label="`Enter amount in ${selectedCrypto.symbol}`"
                @keypress="validateNumberInput"
                class="w-full px-4 py-2 border rounded-lg text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-indigo-200 dark:border-slate-600 transition"
              />
            </div>

            <div class="mb-4">
              <label 
                for="date" 
                class="block text-gray-700 dark:text-gray-300 mb-1"
              >
                {{ selectedDateLabel }}
              </label>
              <div class="relative flex items-center">
                <input
                  type="date"
                  v-model="date"
                  id="date"
                  :max="currentDate"
                  :min="EARLIEST_DATE"
                  @change="validateDate"
                  @input="validateDate"
                  :aria-describedby="showError ? 'date-error' : undefined"
                  class="w-full px-4 py-2 border rounded-lg text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-indigo-200 dark:border-slate-600 transition [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:bg-transparent [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <div class="relative ml-2">
                  <button
                    type="button"
                    aria-label="Date selection information"
                    class="group"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke-width="1.5" 
                      stroke="currentColor" 
                      aria-hidden="true"
                      class="w-5 h-5 text-slate-500 dark:text-slate-400"
                    >
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" 
                      />
                    </svg>
                    <div 
                      role="tooltip"
                      class="absolute bottom-full mb-2 right-0 hidden group-hover:block group-focus:block"
                    >
                      <div class="bg-slate-800 text-white text-sm py-1 px-2 rounded shadow-lg border border-indigo-200 dark:border-slate-600 max-w-[400px] min-w-[300px]">
                        Historical cryptocurrency price data is only available starting from {{ EARLIEST_DATE }}. Earlier dates cannot be selected due to Binance API limitations.
                      </div>
                    </div>
                  </button>
                </div>
                <div
                  v-if="showError"
                  id="date-error"
                  role="alert"
                  class="absolute left-0 right-0 -bottom-16 mx-auto w-64 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm text-center shadow-lg"
                >
                  {{ errorMessage }}
                </div>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              :aria-busy="loading"
              class="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white w-full py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">{{ loading ? 'Calculating results' : 'Calculate' }}</span>
              {{ loading ? 'Calculating...' : selectedButtonLabel }}
            </button>
          </form>
      
          <div 
            v-if="error" 
            role="alert"
            class="mt-4 text-rose-500 dark:text-rose-400 text-center"
          >
            {{ error }}
          </div>
        </div>
        
        <div class="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <a 
            href="https://github.com/jessedi0n/whydidntihodl.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="inline-flex items-center hover:text-indigo-500 dark:hover:text-indigo-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
            aria-label="View source code on GitHub"
          >
            <svg 
              class="w-4 h-4 mr-1" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>
        
        <ResultsDialog 
          v-if="result"
          :result="result" 
          :equivalentPurchases="calculateEquivalentPurchases(result.currentValue)" 
          @reloadPurchases="reloadPurchases"
          @close="result = null"
        />
    </div>
</template>
  
  <script setup lang="js">
  import { ref } from "vue";
  import ResultsDialog from "./ResultsDialog.vue";
  import { cryptocurrencies } from "../config/cryptocurrencies";
  import { calculateEquivalentPurchases } from "../utils/calculateEquivalentPurchases";
  import { getCryptoIcon } from "../utils/getCryptoIcon";
  import { fetchCryptoData } from "../services/cryptoService";
  import { useRandomLabels } from "../composables/useRandomLabels";
  import { useCryptoSelection } from "../composables/useCryptoSelection";
  import { useDateValidation } from "../composables/useDateValidation";

  const EARLIEST_DATE = '2017-08-17';
  const amount = ref(null);
  const result = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const { selectedAmountLabel, selectedDateLabel, selectedButtonLabel, selectedCryptoLabel } = useRandomLabels();
  const { selectedCrypto, isDropdownOpen, selectCrypto } = useCryptoSelection();
  const { currentDate, date, validateDate, errorMessage, showError } = useDateValidation();

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
    result.value = { ...result.value };
  };

  // Add refs for dropdown keyboard navigation
  const optionRefs = ref([]);
  const currentFocusIndex = ref(-1);

  // Add methods for keyboard navigation
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
    if (isDropdownOpen.value) {
      currentFocusIndex.value = cryptocurrencies.findIndex(
        c => c.id === selectedCrypto.value.id
      );
      nextTick(() => {
        optionRefs.value[currentFocusIndex.value]?.focus();
      });
    }
  };

  const closeDropdown = () => {
    isDropdownOpen.value = false;
    currentFocusIndex.value = -1;
  };

  const focusNextOption = () => {
    currentFocusIndex.value = (currentFocusIndex.value + 1) % cryptocurrencies.length;
    optionRefs.value[currentFocusIndex.value]?.focus();
  };

  const focusPreviousOption = () => {
    currentFocusIndex.value = currentFocusIndex.value <= 0 
      ? cryptocurrencies.length - 1 
      : currentFocusIndex.value - 1;
    optionRefs.value[currentFocusIndex.value]?.focus();
  };

  // Improve number input validation
  const validateNumberInput = (e) => {
    const charCode = (e.which) ? e.which : e.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
      e.preventDefault();
    }
  };
  </script>
  
<template>
    <div class="w-full max-w-md mt-4 p-4">
        <div class="text-center mb-4">
          <h1 class="text-3xl font-bold text-slate-800 dark:text-white">Why Didn't I HODL?!</h1>
          <p class="text-lg text-slate-600 dark:text-white/90">How much did you miss out on?</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-indigo-200 dark:border-slate-600">
          <form @submit.prevent="calculate">
            <div class="mb-4">
              <label for="crypto" class="block text-gray-700 dark:text-gray-300 mb-1">{{ selectedCryptoLabel }}</label>
              <div class="relative">
                <button
                  type="button"
                  @click="isDropdownOpen = !isDropdownOpen"
                  class="w-full px-3 py-2 border border-indigo-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition flex items-center space-x-2"
                >
                  <img 
                    :src="getCryptoIcon(selectedCrypto.symbol)"
                    :alt="selectedCrypto.name"
                    class="w-5 h-5"
                  />
                  <span>{{ selectedCrypto.name }}</span>
                </button>
                
                <div
                  v-if="isDropdownOpen"
                  class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-indigo-200 dark:border-slate-600 z-10 max-h-60 overflow-y-auto"
                >
                  <button
                    v-for="crypto in cryptocurrencies"
                    :key="crypto.id"
                    @click="selectCrypto(crypto)"
                    class="w-full px-4 py-2 flex items-center space-x-2 hover:bg-indigo-50 dark:hover:bg-slate-700 transition text-slate-800 dark:text-slate-100"
                  >
                    <img 
                      :src="getCryptoIcon(crypto.symbol)"
                      :alt="crypto.name"
                      class="w-5 h-5"
                    />
                    <span>{{ crypto.name }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label for="amount" class="block text-gray-700 dark:text-gray-300 mb-1">
                {{ selectedAmountLabel }}
              </label>
              <input
                type="number"
                v-model="amount"
                id="amount"
                min="0"
                step="any"
                :placeholder="`1 ${selectedCrypto.symbol}`"
                @keypress="(e) => {
                  const charCode = (e.which) ? e.which : e.keyCode;
                  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                    e.preventDefault();
                  }
                }"
                class="w-full px-4 py-2 border rounded-lg text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-indigo-200 dark:border-slate-600 transition"
              />
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
                :min="minDate"
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

  const amount = ref(null);
  const result = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const { selectedAmountLabel, selectedDateLabel, selectedButtonLabel, selectedCryptoLabel } = useRandomLabels();
  const { selectedCrypto, isDropdownOpen, selectCrypto } = useCryptoSelection();
  const { currentDate, minDate, date, validateDate } = useDateValidation();

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
  </script>
  
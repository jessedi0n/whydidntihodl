<template>
  <div 
    class="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/70 flex items-center justify-center p-4 animate-backdrop-fade"
  >
    <div 
      class="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-4 relative shadow-xl animate-modal-open max-h-[90vh] flex flex-col border border-indigo-200 dark:border-slate-600"
    >
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl hover:bg-indigo-100 dark:hover:bg-slate-800 rounded-full p-2 transition h-10 w-10 flex items-center justify-center border border-slate-200 dark:border-slate-700"
      >
        ✕
      </button>
      
      <div class="overflow-y-auto flex-1">
        <div class="text-center mb-6">
          <div class="text-6xl mb-2">{{ result.emoji }}</div>
          <div class="text-xl font-bold text-slate-800 dark:text-slate-100">
            Your
          </div>
          <div class="text-4xl font-bold text-indigo-500 dark:text-indigo-400 my-3 flex items-center justify-center">
            {{ formatQuantity(result.cryptoAmount) }}
            <img 
              :src="getCryptoIcon(result.cryptoSymbol)"
              :alt="result.cryptoName"
              class="w-8 h-8 ml-2"
            /> 
            <!-- {{ result.cryptoName }} -->
          </div>
          <div class="text-xl font-bold text-slate-800 dark:text-slate-100">
            would be worth
          </div>
          <div class="text-5xl font-bold text-indigo-500 dark:text-indigo-400 my-3">
            ${{ formatCurrency(result.currentValue) }}
          </div>
          <div class="text-xl font-bold text-slate-800 dark:text-slate-100">
            today.
          </div>
          <div 
            class="text-lg text-slate-600 dark:text-slate-400 mt-2"
            :class="{ 'animate-fade-in': showSoldText }"
            v-show="showSoldText"
          >
            You sold for ${{ formatCurrency(result.pastValue) }} 😭
          </div>
        </div>

        <div 
          :class="{ 'animate-fade-in': showPurchases }"
          v-show="showPurchases"
        >
          <div class="border-t border-slate-200 dark:border-slate-700 my-6"></div>

          <div 
            class="space-y-3 mb-6 text-center"
          >
            <div class="flex justify-center items-center mb-2">
              <span class="text-xl font-bold text-indigo-500 dark:text-indigo-400">Here's what you missed out on:</span>
              <button 
                @click="$emit('reloadPurchases')" 
                class="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-800 transition ml-2"
              >
                🔄
              </button>
            </div>
            <div 
              v-for="purchase in equivalentPurchases" 
              :key="purchase.name"
              class="flex items-start text-left justify-start text-slate-800 dark:text-slate-100"
            >
              
                <span class="text-2xl mr-2">{{ purchase.emoji }}</span>
                <span>
                  {{ formatQuantity(purchase.quantity) }} 
                  {{ purchase.name }}{{ purchase.quantity > 1 ? 's' : '' }}
                  <span class="text-slate-500 dark:text-slate-400 text-sm">
                    (${{ formatCurrency(purchase.price) }} each)
                  </span>
                </span>
             
            </div>
          </div>
          <!-- <div v-else class="text-center text-slate-500 dark:text-slate-400">
            Not enough for any major purchases... yet! 💪
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref } from 'vue';
import { getCryptoIcon } from '../utils/getCryptoIcon';

const props = defineProps({
  result: {
    type: Object,
    required: true
  },
  equivalentPurchases: {
    type: Array,
    required: true
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(value);
};

const formatQuantity = (quantity) => {
  if (quantity >= 1000000) {
    return Math.floor(quantity / 1000000) + 'M';
  }
  if (quantity >= 1000) {
    return quantity; // No longer converting to K format
  }
  return quantity;
};

const shareResults = () => {
  let purchaseText = '';
  if (props.equivalentPurchases.length) {
    const topPurchase = props.equivalentPurchases[0];
    purchaseText = ` That's enough to buy ${formatQuantity(topPurchase.quantity)} ${topPurchase.name}s! ${topPurchase.emoji}`;
  }
  
  const text = `I just discovered my ${props.result.cryptoName} would be worth $${formatCurrency(props.result.currentValue)} today!${purchaseText} Calculate your own crypto regrets at [Your Website URL]`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Crypto Regrets',
      text: text,
      url: window.location.href
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard!'))
      .catch(console.error);
  }
};

defineEmits(['reloadPurchases', 'close']);

const showPurchases = ref(false);
const showSoldText = ref(false);

onMounted(() => {
  setTimeout(() => {
    showSoldText.value = true;
  }, 1000);
  
  setTimeout(() => {
    showPurchases.value = true;
  }, 3000);
});
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-backdrop-fade {
  animation: backdropFade 0.4s ease-out;
}

.animate-modal-open {
  animation: modalOpen 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes backdropFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalOpen {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
  
import { ref } from 'vue';
import { CRYPTO_LABELS, AMOUNT_LABELS, DATE_LABELS, BUTTON_LABELS } from '../constants/uiLabels';

export function useRandomLabels() {
  const getRandomLabel = (labels) => labels[Math.floor(Math.random() * labels.length)];

  const selectedAmountLabel = ref(getRandomLabel(AMOUNT_LABELS));
  const selectedDateLabel = ref(getRandomLabel(DATE_LABELS));
  const selectedButtonLabel = ref(getRandomLabel(BUTTON_LABELS));
  const selectedCryptoLabel = ref(getRandomLabel(CRYPTO_LABELS));

  return {
    selectedAmountLabel,
    selectedDateLabel,
    selectedButtonLabel,
    selectedCryptoLabel
  };
}
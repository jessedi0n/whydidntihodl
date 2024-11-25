import { ref, computed } from 'vue';

export function useDateValidation() {
  const date = ref('');
  const currentDate = computed(() => new Date().toISOString().split('T')[0]);
  const EARLIEST_DATE = '2017-08-17';
  const errorMessage = ref('');
  const showError = ref(false);

  const validateDate = () => {
    if (!date.value) return;
    
    const selectedDate = new Date(date.value);
    const minDate = new Date(EARLIEST_DATE);
    const maxDate = new Date();

    // Check if date is before minimum allowed date
    if (selectedDate < minDate) {
      date.value = EARLIEST_DATE;
      errorMessage.value = `Dates before ${EARLIEST_DATE} are not available`;
      showError.value = true;
      setTimeout(() => showError.value = false, 3000); // Hide after 3 seconds
    }
    // Check if date is after current date
    else if (selectedDate > maxDate) {
      date.value = currentDate.value;
      errorMessage.value = 'Future dates are not available';
      showError.value = true;
      setTimeout(() => showError.value = false, 3000); // Hide after 3 seconds
    }
  };

  return {
    currentDate,
    date,
    validateDate,
    errorMessage,
    showError,
  };
}
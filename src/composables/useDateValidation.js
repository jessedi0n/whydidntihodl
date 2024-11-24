import { ref } from 'vue';

export function useDateValidation() {
  const currentDate = ref(new Date().toISOString().split('T')[0]);
  const minDate = ref(new Date('2010-01-01').toISOString().split('T')[0]);
  const date = ref(null);

  const validateDate = (event) => {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const min = new Date('2010-01-01');

    if (selectedDate > today) {
      date.value = currentDate.value;
    } else if (selectedDate < min) {
      date.value = minDate.value;
    }
  };

  return {
    currentDate,
    minDate,
    date,
    validateDate
  };
}

/**
 * Format a phone number in Brazilian format
 * @param value The input phone number
 * @returns Formatted phone number string
 */
export const formatWhatsapp = (value: string): string => {
  // Remove non-digits
  let digits = value.replace(/\D/g, '');
  
  // Format as Brazilian phone number: (XX) XXXXX-XXXX
  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
};

export const getFirstLetter = (text: string): string => {
  return text.length > 0 ? text[0] : '';
};

export const getInitials = (name: string, surname: string): string => {
  return `${getFirstLetter(name)}${getFirstLetter(
    surname,
  )}`.toLocaleUpperCase();
};

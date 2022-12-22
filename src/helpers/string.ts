export const getFirstLetter = (text: string): string => {
  return text.length > 0 ? text[0] : '';
};

export const getInitials = (name: string): string => {
  return name.split(' ').map(getFirstLetter).join('').slice(0, 2);
};

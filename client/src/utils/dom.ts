export const isElementDisplayed = <T extends HTMLElement>(element: T) => {
  return element.offsetParent !== null;
};

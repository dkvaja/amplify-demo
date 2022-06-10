import { STORAGE_KEYS } from "../constants/keywords";

export const checkUserLoggedIn = () => {
  const localUser = localStorage.getItem(STORAGE_KEYS.AMPLIFY_USER);
  return localUser ? true : false;
};

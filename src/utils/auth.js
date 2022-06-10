import { STORAGE_KEYS } from "../constants/keywords";

export const checkUserLoggedIn = () => {
  const localUser = localStorage.getItem(STORAGE_KEYS.AMPLIFY_USER);
  return localUser ? true : false;
};

export const getToken = () => {
  const { signInUserSession } = localStorage.getItem(STORAGE_KEYS.AMPLIFY_USER);
  return signInUserSession ? signInUserSession?.accessToken?.jwtToken : null;
};

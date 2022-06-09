export const checkUserLoggedIn = () => {
  const localUser = localStorage.getItem("@amplify");
  return localUser ? true : false;
};

import { Auth, Hub } from "aws-amplify";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    Hub.listen("auth", () => checkUser());
  }, []);

  const checkUser = async () => {
    try {
      const amplifyUser = await Auth.currentAuthenticatedUser();
      if (amplifyUser) setUser(amplifyUser);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

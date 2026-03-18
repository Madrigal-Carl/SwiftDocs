import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth_service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInitials = (fullname) => {
    if (!fullname) return "U";
    return fullname
      .replace(",", " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join("")
      .slice(0, 3);
  };

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();
      const userData = data.user;

      setUser({
        ...userData,
        initials: getInitials(userData?.fullname),
      });
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,       // ✅ expose setUser to update immediately
        reloadUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const loginAction = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem("site", res.token);
        localStorage.setItem("email", res.user.email);
        navigate("/");
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  const registerAction = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.message === "Account created successfully") {
        alert("Account created! Please log in.");
        navigate("/login");
        return;
      }
      throw new Error(res.message || res.errors?.join(', '));
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  }

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, registerAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
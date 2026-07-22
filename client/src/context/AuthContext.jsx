import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") return;

    try {
        setUser(JSON.parse(storedUser));
    } catch (error) {
        console.error("Invalid user data in localStorage");
        localStorage.removeItem("user");
    }
}, []);

    const loginUser = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
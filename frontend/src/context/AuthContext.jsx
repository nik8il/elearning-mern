import { createContext, useState, useContext, useEffect } from "react";

// Create the context (a global storage box)
const AuthContext = createContext();

// This component wraps our whole app and provides the auth data
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // When the app first loads, check if we saved a login before
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }

        setLoading(false);
    }, []);

    // Call this after a successful login or register
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userToken);
    };

    // Call this to log out
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// A shortcut so other files can use: const { user } = useAuth();
export function useAuth() {
    return useContext(AuthContext);
}
import { createContext,useState } from "react";

export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const isAuthenticated = !!token;
    return (
        <AuthContext.Provider value={{ user,setUser,token,setToken, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}
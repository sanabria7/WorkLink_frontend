import { useContext, createContext, useState, useEffect } from "react";

interface AuthProviderProps{
    children: React.ReactNode
}

const AuthContext = createContext(
    {
        isAuthenticated: false,
    }
)

export function AuthProvider({children}:AuthProviderProps){
    const [isAuthenticated, setIsAuthenticaded] = useState(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
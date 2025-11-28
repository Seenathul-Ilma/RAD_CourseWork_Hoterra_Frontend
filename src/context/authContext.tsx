import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext<any>(null)

export const AuthProvider = ({ Children } : any) => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        
        if (token) {
        
        } else {
            setUser(null)
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {Children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("Oooppss.. useAuth must be used within an AuthProvider..!");
    }

    return context
}
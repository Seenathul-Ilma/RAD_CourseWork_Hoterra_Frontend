import { createContext, useContext, useEffect, useState } from "react"
import { getMyDetail } from "../services/auth"

const AuthContext = createContext<any>(null)

export const AuthProvider = ({ Children } : any) => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      getMyDetail()
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          // if token expire or 'me api' call failure
          setUser(null);
          console.error(err);
        }).finally(() => {
          setLoading(false)
        })
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
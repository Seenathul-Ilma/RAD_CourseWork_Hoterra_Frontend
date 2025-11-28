import { AuthProvider } from "./context/authContext"
import Router from "./routes"

const App = () => {

  // context ek athule tiyna dewal meken access krnn ba wrap wela thiynna one..

    return (
      <AuthProvider>
        <Router />
      </AuthProvider>
    )
}

export default App
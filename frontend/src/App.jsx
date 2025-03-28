import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { Home } from "./pages/Home";

const Root = () => {
  //check if token exists in localstorage
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/login" />
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/',
    element: <Home />
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router}>

      </RouterProvider>
    </>
  )
}

export default App



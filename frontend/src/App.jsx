import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { Home } from "./pages/dashboard/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import { CodeEditor } from "./pages/dashboard/CodeEditor";

const Root = () => {
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
    path: '/dashboard',
    element: <Home />
  },
  {
    path: '/editor',
    element: <CodeEditor />
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        pauseOnHover 
        draggable 
        theme="colored" 
      />
    </>
  )
}

export default App



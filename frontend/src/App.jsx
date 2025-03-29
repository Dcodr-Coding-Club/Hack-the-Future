import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import { Navbar } from "./components";
<<<<<<< HEAD
import { About, Contact, Home, Projects } from "./pages";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
=======
import { About, Contact, Home, Projects, Profile } from "./pages"; // Import Profile Page
>>>>>>> e6f39a779f96e46abb7f34fbb61f5d622a3db34b

const App = () => {
  return (
    <Router>
      <MainContent />
    </Router>
  );
};

const MainContent = () => {
  const location = useLocation();

  return (
    <main className="bg-slate-300/20 relative">
      {location.pathname === "/" && <Navigation />} 

      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Aboutus" element={<Aboutus />} /> {/* Add Profile Route */}
      </Routes>
    </main>
  );
};

export default App;

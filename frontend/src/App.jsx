import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import { Navbar } from "./components";
import { About, Contact, Home, Projects } from "./pages";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

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
      {/* Navigation only visible on Home page */}
      {location.pathname === "/" && <Navigation />} 

      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </main>
  );
};

export default App;

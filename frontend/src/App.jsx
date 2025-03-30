import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Progress from "./components/src/progress";
import { Navbar } from "./components";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { About, Contact, Home, Projects, Profile , Aboutus } from "./pages"; // Import Profile Page
import DashboardLayout from "./components/DashboardLayout";
import MCQQuiz from "./components/MCQQuiz";
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
      <Route path="/practice" element={<MCQQuiz />} />
        <Route path='/dashboard/*' element={<DashboardLayout/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Aboutus" element={<Aboutus />} /> 
        <Route path="/progress" element={<Progress />} />
        <Route path="/DashboardLayout" element={<DashboardLayout />} />{/* Add Profile Route */}
      </Routes>
    </main>
  );
};

export default App;

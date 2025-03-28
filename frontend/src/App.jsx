import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import { Navbar } from "./components";
import { About, Contact, Home, Projects } from "./pages";


const App = () => {
  return (
    
    <main className="bg-slate-300/20 relative">
      <Navigation /> {/* ✅ Placed at the top */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;

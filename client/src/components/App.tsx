import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import CompaniesPage from "../pages/CompaniesPage";
import TargetsPage from "../pages/TargetsPage";
import Navbar from "./Navbar";

import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/targets" element={<TargetsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

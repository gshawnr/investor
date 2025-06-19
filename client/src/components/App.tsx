import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import CompanyData from "../pages/CompanyData";
import TargetsTable from "./TargetsTable";
import Navbar from "./Navbar";

import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/companies" element={<CompanyData />} />
          <Route path="/targets" element={<TargetsTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

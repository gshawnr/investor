import React from "react";

import backgroundImg from "../assets/images/background.jpg";
import Login from "../components/Login";
import { useAuth } from "../contexts/AuthContext";

import styles from "./HomePage.module.css";

function HomePage() {
  const { isAuthenticated } = useAuth();
  return (
    <div className={styles.container}>
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      />
      {!isAuthenticated && <Login />}
    </div>
  );
}

export default HomePage;

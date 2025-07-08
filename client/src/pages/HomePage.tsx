import React from "react";

import backgroundImg from "../assets/images/background.jpg";
import Login from "../components/Login";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";

import styles from "./HomePage.module.css";
import ErrorModal from "../components/ErrorModal";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const { error, clearError } = useError();
  return (
    <div className={styles.container}>
      <ErrorModal error={error} />
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      />
      {!isAuthenticated && <Login />}
    </div>
  );
}

export default HomePage;

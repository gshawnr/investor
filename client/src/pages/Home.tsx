import React from "react";
import backgroundImg from "../assets/images/background.jpg";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      />
    </div>
  );
}

export default Home;

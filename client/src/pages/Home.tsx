import React from "react";
import SummaryMetricTables from "../components/SummaryMetricTables";

import styles from "./Home.module.css";
import CompanyTable from "../components/CompanyTable";

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <CompanyTable />
      </div>

      <div className={styles.right}>
        <SummaryMetricTables />
      </div>
    </div>
  );
}

export default Home;

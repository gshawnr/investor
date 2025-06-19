import React from "react";
import SummaryMetricTables from "../components/SummaryMetricTables";

import styles from "./CompanyData.module.css";
import CompanyTable from "../components/CompanyTable";

function CompanyData() {
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

export default CompanyData;

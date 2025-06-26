import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { useAuth } from "../contexts/AuthContext";
import SummaryMetricTables from "../components/SummaryMetricTables";
import CompanyTable from "../components/CompanyTable";

import styles from "./CompaniesPage.module.css";

function CompaniesPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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

export default CompaniesPage;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import ErrorModal from "../components/ErrorModal";
import SummaryMetricTables from "../components/SummaryMetricTables";
import CompanyTable from "../components/CompanyTable";

import styles from "./CompaniesPage.module.css";

function CompaniesPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { error } = useError();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className={styles.container}>
      <ErrorModal error={error} />
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

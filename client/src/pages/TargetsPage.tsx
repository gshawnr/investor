import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TargetsTable from "../components/TargetsTable";
import FavoritesTable from "../components/FavoritesTable";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import ErrorModal from "../components/ErrorModal";

import styles from "./TargetsPage.module.css";

function TargetsPage() {
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
      <div className={styles.tableContainer}>
        <div className={styles.top}>
          <TargetsTable />
        </div>

        <div className={styles.bottom}>
          <FavoritesTable />
        </div>
      </div>
    </div>
  );
}

export default TargetsPage;

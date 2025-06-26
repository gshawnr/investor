import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TargetsTable from "../components/TargetsTable";
import FavoritesTable from "../components/FavoritesTable";
import { useAuth } from "../contexts/AuthContext";

import styles from "./TargetsPage.module.css";

function TargetsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div>
          <TargetsTable />
        </div>

        <div>
          <FavoritesTable />
        </div>
      </div>
    </div>
  );
}

export default TargetsPage;

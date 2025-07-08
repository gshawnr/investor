import React from "react";
import Modal from "./Modal";

import styles from "./CompanyModal.module.css";

interface CompanyModalProps {
  open: boolean;
  handleClose: (open: boolean) => void;
  company: any;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  company,
  open,
  handleClose,
}) => {
  if (!company) {
    return null;
  }

  return (
    <Modal open={open} handleClose={handleClose}>
      <div className={styles.container}>
        <p className={styles.title}>{company.companyName}</p>
        <div className={styles.infoContainer}>
          <p className={styles.info}>
            <strong>Ticker:</strong> {company.ticker}
          </p>
          <p className={styles.info}>
            <strong>Beta:</strong> {company.beta?.toFixed(2)}
          </p>
          <p className={styles.info}>
            <strong>Industry:</strong> {company.industry}
          </p>
          <p className={styles.info}>
            <strong>Sector:</strong> {company.sector}
          </p>
          <p className={styles.info}>
            <strong>Description:</strong> {company?.raw.description}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default CompanyModal;

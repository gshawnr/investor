import React, { useEffect, useState } from "react";
import { useError } from "../contexts/ErrorContext";

import Modal from "./Modal";

import styles from "./ErrorModal.module.css";

interface ErrorModalProps {
  error: any;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error }) => {
  const [open, setOpen] = useState(false);
  const { clearError } = useError();

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  if (!error) {
    return null;
  }

  const handleClose = () => {
    clearError();
    setOpen(false);
  };

  return (
    <Modal open={open} handleClose={handleClose}>
      <div className={styles.container}>
        <p className={styles.title}>{error.message}</p>
      </div>
    </Modal>
  );
};

export default ErrorModal;

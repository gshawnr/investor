import React from "react";
import Modal from "./Modal";

import styles from "./FavoritesModal.module.css";

interface FavoritesModalProps {
  open: boolean;
  handleClose: (close: boolean) => void;
  children: React.ReactNode;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({
  open,
  handleClose,
  children,
}: FavoritesModalProps) => {
  return (
    <Modal open={open} handleClose={handleClose}>
      <div className={styles.modalContentContainer}>{children}</div>
    </Modal>
  );
};

export default FavoritesModal;

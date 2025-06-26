import React, { useState } from "react";
import Modal from "./Modal";
import AddFavoriteForm from "./AddFavoriteModal";

import styles from "./FavoritesModal.module.css";

interface FavoritesModalProps {
  open: boolean;
  handleOpen: (input: boolean) => void;
  // handleAdd: (input: any) => void | undefined;
  // handleEdit: (input: any) => void | undefined;
  // handleDelete: (input: any) => void | undefined;
  children: React.ReactNode;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({
  open,
  handleOpen,
  children,
}: // handleAdd,
FavoritesModalProps) => {
  return (
    <Modal open={open} handleOpen={handleOpen}>
      <div className={styles.modalContentContainer}>
        {children}
        {/* <AddFavoriteForm handleOpen={handleOpen} handleAdd={handleAdd} /> */}
      </div>
    </Modal>
  );
};

export default FavoritesModal;

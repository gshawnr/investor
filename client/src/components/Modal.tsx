import { Modal as MuiModal } from "@mui/material";

interface ModalProps {
  open: boolean;
  handleOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, handleOpen, children }) => {
  const handleClose = () => handleOpen(false);

  return (
    <div>
      <MuiModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>{children}</div>
      </MuiModal>
    </div>
  );
};

export default Modal;

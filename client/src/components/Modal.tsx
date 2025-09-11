import { Modal as MuiModal } from "@mui/material";

interface ModalProps {
  open: boolean;
  handleClose: (close: boolean) => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, handleClose, children }) => {
  return (
    <MuiModal
      open={open}
      onClose={() => handleClose(true)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div>{children}</div>
    </MuiModal>
  );
};

export default Modal;

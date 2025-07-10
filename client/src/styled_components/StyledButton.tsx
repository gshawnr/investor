import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "rgb(47, 79, 79)",
  color: "#fff",
  fontWeight: 600,
  borderRadius: "8px",
  padding: "8px 20px",
  minWidth: "150px",
  "&:hover": {
    // backgroundColor: "rgb(60, 100, 100)",
    backgroundColor: "rgb(90, 150, 150)",
  },
}));

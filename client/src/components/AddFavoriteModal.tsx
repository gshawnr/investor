import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

import { apiClient } from "../apis/apiClient";
import ApiError from "../utils/ApiError";
import { useError } from "../contexts/ErrorContext";
import { useAuth } from "../contexts/AuthContext";
import { StyledButton } from "../styled_components/StyledButton";

import styles from "./AddFavoriteModal.module.css";
import FavoritesModal from "./FavoritesModal";

interface AddFavoriteModalProps {
  open: boolean;
  handleClose: (close: boolean) => void;
  handleAdd: (input: any) => void | undefined;
}

const initialState = {
  ticker: "",
  targetPurchasePriceUSD: "",
  targetPurchaseDate: "",
  targetSalesPriceUSD: "",
  targetSellDate: "",
};

export default function AddFavoriteModal({
  open,
  handleClose,
  handleAdd,
}: AddFavoriteModalProps) {
  const { user } = useAuth();

  const [form, setForm] = useState(initialState);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { setError } = useError();

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.ticker.trim()) errs.ticker = "Ticker is required.";
    if (
      !form.targetPurchasePriceUSD ||
      isNaN(Number(form.targetPurchasePriceUSD))
    ) {
      errs.targetPurchasePriceUSD = "Valid purchase price required.";
    }
    if (!form.targetSalesPriceUSD || isNaN(Number(form.targetSalesPriceUSD))) {
      errs.targetSalesPriceUSD = "Valid sales price required.";
    }
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/favorites`;

      const data = await apiClient(url, {
        method: "POST",
        body: JSON.stringify({
          ticker: form.ticker.trim(),
          targetPurchasePriceUSD: parseFloat(form.targetPurchasePriceUSD),
          targetPurchaseDate: form.targetPurchaseDate,
          targetSalesPriceUSD: parseFloat(form.targetSalesPriceUSD),
          targetSellDate: form.targetSellDate,
          userId: user?.userId,
        }),
      });

      setForm(initialState);
      handleAdd([data]);
      handleClose(true);
    } catch (err: any) {
      const message = (err as Error).message || "unknown error";
      const source = "Add Favorite Modal";
      if (err instanceof ApiError) {
        const { status = 500 } = err;
        setError({ message, statusCode: status, source });
      } else {
        setError({ message, source });
      }
    }
  };

  const onModalClose = () => {
    setFormErrors({});
    handleClose(true);
  };

  return (
    <FavoritesModal open={open} handleClose={onModalClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>Add Favorite</h2>

        <form>
          <TextField
            label="Ticker"
            name="ticker"
            value={form.ticker}
            onChange={handleChange}
            error={!!formErrors.ticker}
            helperText={formErrors.ticker || " "}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Target Purchase Price (USD)"
            name="targetPurchasePriceUSD"
            value={form.targetPurchasePriceUSD}
            onChange={handleChange}
            error={!!formErrors.targetPurchasePriceUSD}
            helperText={formErrors.targetPurchasePriceUSD || " "}
            fullWidth
            margin="normal"
            type="number"
            slotProps={{ input: { inputProps: { step: 1, min: 0 } } }}
          />

          <TextField
            label="Target Purchase Date (YYYY-MM-DD)"
            name="targetPurchaseDate"
            value={form.targetPurchaseDate}
            onChange={handleChange}
            error={!!formErrors.targetPurchaseDate}
            helperText={formErrors.targetPurchaseDate || " "}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Target Sales Price (USD)"
            name="targetSalesPriceUSD"
            value={form.targetSalesPriceUSD}
            onChange={handleChange}
            error={!!formErrors.targetSalesPriceUSD}
            helperText={formErrors.targetSalesPriceUSD || " "}
            fullWidth
            margin="normal"
            type="number"
            slotProps={{ input: { inputProps: { step: 1, min: 0 } } }}
          />

          <TextField
            label="Target Sell Date (YYYY-MM-DD)"
            name="targetSellDate"
            value={form.targetSellDate}
            onChange={handleChange}
            error={!!formErrors.targetSellDate}
            helperText={formErrors.targetSellDate || " "}
            fullWidth
            margin="normal"
          />

          <div className={styles.btnBox}>
            <StyledButton onClick={() => onModalClose()} className="shadow-md">
              Cancel
            </StyledButton>

            <StyledButton onClick={handleSubmit} className="shadow-md">
              Submit
            </StyledButton>
          </div>
        </form>
      </div>
    </FavoritesModal>
  );
}

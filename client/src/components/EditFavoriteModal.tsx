import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { apiClient } from "../apis/apiClient";
import { useAuth } from "../contexts/AuthContext";

import styles from "./EditFavoriteModal.module.css";
import FavoritesModal from "./FavoritesModal";
import { StyledButton } from "../styled components/styledButton";

interface EditFavoriteModalProps {
  initialData: {
    ticker: string;
    targetPurchasePriceUSD: number | string;
    targetSalesPriceUSD: number | string;
  };
  open: boolean;
  handleClose: (close: boolean) => void;
  handleEdit: (input: any) => void;
  handleDelete: (ticker: string) => void;
}

export default function EditFavoriteModal({
  open,
  handleClose,
  handleEdit,
  handleDelete,
  initialData,
}: EditFavoriteModalProps) {
  const { user } = useAuth();

  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setForm(initialData);
    setErrors({});
    setApiError("");
  }, [initialData, open]);

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/favorites/${form.ticker}_${
        user?.userId
      }`;

      const data = await apiClient(url, {
        method: "PATCH",
        body: JSON.stringify({
          ticker: form.ticker.trim(),
          targetPurchasePriceUSD: parseFloat(
            form.targetPurchasePriceUSD as string
          ),
          targetSalesPriceUSD: parseFloat(form.targetSalesPriceUSD as string),
          userId: user?.userId,
        }),
      });

      handleEdit([data]);
      handleClose(true);
    } catch (err: any) {
      setApiError(err?.message || "Submission failed.");
    }
  };

  const onDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      const ticker = form.ticker;
      const url = `${import.meta.env.VITE_BASE_URL}/favorites/${ticker}_${
        user?.userId
      }`;

      const data = await apiClient(url, {
        method: "DELETE",
      });

      handleDelete(ticker);
      handleClose(true);
    } catch (err: any) {
      setApiError(err?.message || "Submission failed.");
    }
  };

  const onCancel = () => {
    handleClose(true);
  };

  return (
    <FavoritesModal open={open} handleClose={handleClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>Edit Favorite</h2>

        <form>
          <TextField
            label="Ticker"
            name="ticker"
            value={form.ticker}
            onChange={onChange}
            error={!!errors.ticker}
            helperText={errors.ticker}
            fullWidth
            margin="normal"
            disabled
          />

          <TextField
            label="Target Purchase Price (USD)"
            name="targetPurchasePriceUSD"
            value={form.targetPurchasePriceUSD}
            onChange={onChange}
            error={!!errors.targetPurchasePriceUSD}
            helperText={errors.targetPurchasePriceUSD}
            fullWidth
            margin="normal"
            type="number"
            autoFocus
            slotProps={{ input: { inputProps: { step: 1, min: 0 } } }}
          />

          <TextField
            label="Target Sales Price (USD)"
            name="targetSalesPriceUSD"
            value={form.targetSalesPriceUSD}
            onChange={onChange}
            error={!!errors.targetSalesPriceUSD}
            helperText={errors.targetSalesPriceUSD}
            fullWidth
            margin="normal"
            type="number"
            slotProps={{ input: { inputProps: { step: 1, min: 0 } } }}
          />
          {apiError && <h5 className={styles.errorText}>{apiError}</h5>}
          <div className={styles.btnBox}>
            <StyledButton onClick={onCancel}>Cancel</StyledButton>

            <StyledButton onClick={onSave}>Save</StyledButton>

            <StyledButton onClick={onDelete}>Delete</StyledButton>
          </div>
        </form>
      </div>
    </FavoritesModal>
  );
}

import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { apiClient } from "../apis/apiClient";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import ApiError from "../utils/ApiError";

import styles from "./EditFavoriteModal.module.css";
import FavoritesModal from "./FavoritesModal";
import { StyledButton } from "../styled_components/StyledButton";

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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { setError } = useError();

  useEffect(() => {
    setForm(initialData);
    setFormErrors({});
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
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
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
      onClose();
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

  const onDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
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
      onClose();
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

  const onClose = () => {
    setFormErrors({});
    handleClose(true);
  };

  return (
    <FavoritesModal open={open} handleClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>Edit Favorite</h2>

        <form>
          <TextField
            label="Ticker"
            name="ticker"
            value={form.ticker}
            onChange={onChange}
            error={!!formErrors.ticker}
            helperText={formErrors.ticker || " "}
            fullWidth
            margin="normal"
            disabled
          />

          <TextField
            label="Target Purchase Price (USD)"
            name="targetPurchasePriceUSD"
            value={form.targetPurchasePriceUSD}
            onChange={onChange}
            error={!!formErrors.targetPurchasePriceUSD}
            helperText={formErrors.targetPurchasePriceUSD || " "}
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
            error={!!formErrors.targetSalesPriceUSD}
            helperText={formErrors.targetSalesPriceUSD || " "}
            fullWidth
            margin="normal"
            type="number"
            slotProps={{ input: { inputProps: { step: 1, min: 0 } } }}
          />
          <div className={styles.btnBox}>
            <StyledButton onClick={onClose}>Cancel</StyledButton>

            <StyledButton onClick={onSave}>Save</StyledButton>

            <StyledButton onClick={onDelete}>Delete</StyledButton>
          </div>
        </form>
      </div>
    </FavoritesModal>
  );
}

import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

import { apiClient } from "../apis/apiClient";
import { useAuth } from "../contexts/AuthContext";

import styles from "./SummaryMetricTables.module.css";
import FavoritesModal from "./FavoritesModal";

interface AddFavoriteModalProps {
  open: boolean;
  handleOpen: (open: boolean) => void;
  handleAdd: (input: any) => void | undefined;
}

const initialState = {
  ticker: "",
  targetPurchasePriceUSD: "",
  targetSalesPriceUSD: "",
};

export default function AddFavoriteModal({
  open,
  handleOpen,
  handleAdd,
}: AddFavoriteModalProps) {
  const { user } = useAuth();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

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
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/favorites`;

      const data = await apiClient(url, {
        method: "POST",
        body: JSON.stringify({
          ticker: form.ticker.trim(),
          targetPurchasePriceUSD: parseFloat(form.targetPurchasePriceUSD),
          targetSalesPriceUSD: parseFloat(form.targetSalesPriceUSD),
          userId: user?.userId,
        }),
      });

      setForm(initialState);
      handleAdd([data]);
      handleOpen(false);
    } catch (err: any) {
      setApiError(err?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FavoritesModal open={open} handleOpen={handleOpen}>
      <div className={styles.container}>
        <h2>Add Favorite</h2>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Ticker"
            name="ticker"
            value={form.ticker}
            onChange={handleChange}
            error={!!errors.ticker}
            helperText={errors.ticker}
            fullWidth
            margin="normal"
            autoFocus
          />

          <TextField
            label="Target Purchase Price (USD)"
            name="targetPurchasePriceUSD"
            value={form.targetPurchasePriceUSD}
            onChange={handleChange}
            error={!!errors.targetPurchasePriceUSD}
            helperText={errors.targetPurchasePriceUSD}
            fullWidth
            margin="normal"
            type="number"
            slotProps={{ input: { inputProps: { step: 0.01, min: 0 } } }}
          />

          <TextField
            label="Target Sales Price (USD)"
            name="targetSalesPriceUSD"
            value={form.targetSalesPriceUSD}
            onChange={handleChange}
            error={!!errors.targetSalesPriceUSD}
            helperText={errors.targetSalesPriceUSD}
            fullWidth
            margin="normal"
            type="number"
            slotProps={{ input: { inputProps: { step: 0.01, min: 0 } } }}
          />
          {apiError && <h5 className={styles.errorText}>{apiError}</h5>}
          <div className={styles.btnBox}>
            <Button onClick={() => handleOpen(false)} disabled={submitting}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </FavoritesModal>
  );
}

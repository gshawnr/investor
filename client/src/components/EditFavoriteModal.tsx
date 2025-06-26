import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { apiClient } from "../apis/apiClient";
import { useAuth } from "../contexts/AuthContext";

import styles from "./SummaryMetricTables.module.css";
import FavoritesModal from "./FavoritesModal";

interface EditFavoriteModalProps {
  initialData: {
    ticker: string;
    targetPurchasePriceUSD: number | string;
    targetSalesPriceUSD: number | string;
  };
  open: boolean;
  handleOpen: (open: boolean) => void;
  handleEdit: (input: any) => void;
  handleDelete: (ticker: string) => void;
}

const RESET_STATE = {
  ticker: "",
  targetPurchasePriceUSD: "",
  targetSalesPriceUSD: "",
};

export default function EditFavoriteModal({
  open,
  handleOpen,
  handleEdit,
  handleDelete,
  initialData,
}: EditFavoriteModalProps) {
  const { user } = useAuth();

  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
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

    setSaving(true);
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
      handleOpen(false);
    } catch (err: any) {
      setApiError(err?.message || "Submission failed.");
    } finally {
      setSaving(false);
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

    setDeleting(true);
    try {
      const ticker = form.ticker;
      const url = `${import.meta.env.VITE_BASE_URL}/favorites/${ticker}_${
        user?.userId
      }`;

      const data = await apiClient(url, {
        method: "DELETE",
      });

      handleDelete(ticker);
      handleOpen(false);
    } catch (err: any) {
      setApiError(err?.message || "Submission failed.");
    } finally {
      setDeleting(false);
    }
  };

  const onCancel = () => {
    handleOpen(false);
  };

  return (
    <FavoritesModal open={open} handleOpen={handleOpen}>
      <div className={styles.container}>
        <h2>Edit Favorite</h2>

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
            slotProps={{ input: { inputProps: { step: 0.01, min: 0 } } }}
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
            slotProps={{ input: { inputProps: { step: 0.01, min: 0 } } }}
          />
          {apiError && <h5 className={styles.errorText}>{apiError}</h5>}
          <div className={styles.btnBox}>
            <Button onClick={onCancel}>Cancel</Button>

            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={saving}
              onClick={onSave}
            >
              {saving ? "Saving..." : "Save"}
            </Button>

            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={deleting}
              onClick={onDelete}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </form>
      </div>
    </FavoritesModal>
  );
}

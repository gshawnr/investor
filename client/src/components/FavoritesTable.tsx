import { TablePagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { apiClient } from "../apis/apiClient";
import { favoriteColumns } from "../constants/tableColumns/favoriteTableColumns";
import SearchBar from "./SearchBar";
import { TableDisplay } from "./TableDisplay";
import { Button } from "@mui/material";
import AddFavoritesModal from "./AddFavoriteModal";
import EditFavoritesModal from "./EditFavoriteModal";

import styles from "./FavoritesTable.module.css";

export default function FavoritesTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [favorites, setFavorites] = useState<any>([]);
  const [selectedFavorite, setSelectedFavorite] = useState<any>({});
  const [openAddFavoritesModal, setAddFavoritesModal] = useState(false);
  const [openEditFavoritesModal, setEditFavoritesModal] = useState(false);
  const [error, setError] = useState({});

  const SEARCH_FIELDS = "ticker,industry,sector";

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      setDebouncedSearch(search);
      return;
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    try {
      const userId = "685a09dec5566439207cbd79";
      const fetchData = async () => {
        // page incremented to satisfy MUI and Backend structures
        const url = `${
          import.meta.env.VITE_BASE_URL
        }/favorites/${userId}?pageSize=${rowsPerPage}&page=${
          page + 1
        }&search=${debouncedSearch}&fields=${SEARCH_FIELDS}&sortBy=ticker&sortOrder=asc`;

        const data: any = await apiClient(url, {});

        const { favorites, totalCount } = data;
        const formattedFavorites = formatFavorites(favorites);

        setFavorites(formattedFavorites);
        setCount(totalCount);
      };
      fetchData();
    } catch (err) {
      console.log(err);
      setError(err as Error);
    }
  }, [page, rowsPerPage, debouncedSearch, error]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const validateAndSetSearch = (value: string) => {
    // TODO add error handling to update user on invalid input
    if (value.length > 100) {
      return;
    }
    // Only allow alphanumeric, whitespace, dot, comma, and dash
    if (!/^[\w\s.,-]*$/.test(value)) {
      return;
    }

    setSearch(value);
  };

  const handleAddFavorites = (favorites: any[]) => {
    const formattedFavorites = formatFavorites(favorites);
    setFavorites((prev: any) => [...prev, ...formattedFavorites]);
  };

  const handleEditFavorites = (favorites: any[]) => {
    const formattedFavorites = formatFavorites(favorites);
    const { ticker } = formattedFavorites[0];
    setFavorites((prev: any) =>
      prev.map((fav: any) =>
        fav.ticker === ticker ? formattedFavorites[0] : fav
      )
    );
  };

  const handleDeleteFavorite = (ticker: string) => {
    setFavorites((prev: any) =>
      prev.filter((fav: any) => fav.ticker !== ticker)
    );

    const handleSelectFavorite = (favorite: any) => {
      setEditFavoritesModal(true);
      setSelectedFavorite(favorite);
    };

    return (
      <div className={styles.container}>
        <AddFavoritesModal
          open={openAddFavoritesModal}
          handleOpen={setAddFavoritesModal}
          handleAdd={handleAddFavorites}
        />

        <EditFavoritesModal
          initialData={selectedFavorite}
          open={openEditFavoritesModal}
          handleOpen={setEditFavoritesModal}
          handleEdit={handleEditFavorites}
          handleDelete={handleDeleteFavorite}
        />
        <div className={styles.tableAndSearchContainer}>
          <div className={styles.searchContainer}>
            <SearchBar onSearch={validateAndSetSearch} />
          </div>

          <div className={styles.tableContainer}>
            <TableDisplay
              data={favorites}
              columns={favoriteColumns}
              handleSelect={handleSelectFavorite}
            />
          </div>

          <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>

        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddFavoritesModal(true)}
          >
            Add Favorite
          </Button>
        </div>
      </div>
    );
  };

  const handleSelectFavorite = (favorite: any) => {
    setEditFavoritesModal(true);
    setSelectedFavorite(favorite);
  };

  const formatFavorites = (favorites: any[]): any[] => {
    const formattedFavorites = favorites.map((fav: any) => ({
      ...fav,
      createdAt: fav.createdAt.slice(0, 10),
      updatedAt: fav.updatedAt.slice(0, 10),
    }));
    return formattedFavorites;
  };

  return (
    <div className={styles.container}>
      <AddFavoritesModal
        open={openAddFavoritesModal}
        handleOpen={setAddFavoritesModal}
        handleAdd={handleAddFavorites}
      />

      <EditFavoritesModal
        initialData={selectedFavorite}
        open={openEditFavoritesModal}
        handleOpen={setEditFavoritesModal}
        handleEdit={handleEditFavorites}
        handleDelete={handleDeleteFavorite}
      />
      <div className={styles.tableAndSearchContainer}>
        <div className={styles.searchContainer}>
          <SearchBar onSearch={validateAndSetSearch} />
        </div>

        <div className={styles.tableContainer}>
          <TableDisplay
            data={favorites}
            columns={favoriteColumns}
            handleSelect={handleSelectFavorite}
          />
        </div>

        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddFavoritesModal(true)}
        >
          Add Favorite
        </Button>
      </div>
    </div>
  );
}

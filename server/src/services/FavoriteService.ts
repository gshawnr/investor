import Favorite from "../models/Favorite";
import { IFavorite, CreateFavoriteInputType } from "../types/IFavorite";

class FavoriteService {
  async createFavorites(data: CreateFavoriteInputType): Promise<IFavorite> {
    const { ticker_user } = data;

    const existing = await Favorite.findOne({ ticker_user });
    if (existing) {
      throw new Error(
        `Favorite for ticker_user ${ticker_user} already exists.`
      );
    }

    const favoriteInstance = new Favorite(data);
    return favoriteInstance.save();
  }

  async getFavorites({
    filter = {},
    options = {},
  }): Promise<{ favorites: IFavorite[]; totalCount: number }> {
    const [favorites, totalCount] = await Promise.all([
      Favorite.find(filter, null, options),
      Favorite.countDocuments(filter),
    ]);

    return {
      favorites,
      totalCount,
    };
  }

  async updateFavorites(
    ticker_user: string,
    update: IFavorite
  ): Promise<IFavorite | null> {
    const updatedFavorite = await Favorite.findOneAndUpdate(
      { ticker_user },
      { $set: update },
      { new: true, runValidators: true }
    );
    return updatedFavorite;
  }

  async deleteFavorites(ticker_user: string) {
    if (!ticker_user) {
      throw new Error("ticker_user is required for deletion");
    }

    return Favorite.findOneAndDelete({ ticker_user });
  }
}

export default new FavoriteService();

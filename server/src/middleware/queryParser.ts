import { Request, Response, NextFunction } from "express";
import { FilterQuery } from "mongoose";

// Configurable allowed fields for sorting
const ALLOWED_SORT_FIELDS = ["sector", "industry", "ticker", "potentialReturn"];

export interface QueryOptions {
  search?: string;
  fields?: string; // comma-separated
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: string;
  pageSize?: string;
}

export interface PaginationOptions<T> {
  filter?: FilterQuery<T>;
  options: {
    sort: Record<string, 1 | -1>;
    skip: number;
    limit: number;
  };
}

export interface RequestWithPagination<T> extends Request {
  pagination?: PaginationOptions<T>;
}

export function parseQuery<T = any>(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      // filter fields
      search,
      fields,

      // sorting options
      sortBy,
      sortOrder = "asc",

      // page options
      page = "1",
      pageSize = "10",
    } = req.query as QueryOptions;

    const pagination: PaginationOptions<T> = {
      filter: {},
      options: {
        sort: {},
        skip: 0,
        limit: 10,
      },
    };

    // --- FILTER ---
    if (search && fields) {
      const regex = new RegExp(search, "i");
      const orConditions = fields.split(",").map((field) => ({
        [field.trim()]: regex,
      }));
      pagination.filter = { $or: orConditions } as FilterQuery<T>;
    }

    // --- SORT ---
    const sortDirection = sortOrder === "desc" ? -1 : 1;
    const sort: Record<string, 1 | -1> = {};

    if (sortBy) {
      if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
        res.status(400).json({ error: `Invalid sort field: ${sortBy}` });
        return;
      }
      sort[sortBy] = sortDirection;
    }

    // Always apply a secondary sort by `ticker_year` to maintain stable sort order
    sort["ticker_year"] = sortDirection;
    pagination.options.sort = sort;

    // --- PAGINATION ---
    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.max(parseInt(pageSize, 10), 1);
    pagination.options.skip = (pageNum - 1) * limitNum;
    pagination.options.limit = limitNum;

    // Attach pagination to request
    (req as RequestWithPagination<T>).pagination = pagination;

    next();
  } catch (error) {
    console.error("Error in parseQuery middleware:", error);
    res.status(500).json({ error: "Failed to parse query parameters." });
  }
}

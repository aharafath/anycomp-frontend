"use client";

import React, { useMemo, useState } from "react";

import { KeyboardArrowDown } from "@mui/icons-material";
import { Avatar, Menu, MenuItem } from "@mui/material";
import Image from "next/image";

import {
  Specialist,
  useGetPublishedSpecialistsQuery,
} from "@/lib/services/specialistApiSlice";

type SortValue = "newest" | "priceAsc" | "priceDesc" | "name";
const PAGE_SIZE = 12;

const PRICE_OPTIONS = [
  { label: "All Prices", value: null },
  { label: "Under RM 1,500", value: 1500 },
  { label: "Under RM 1,800", value: 1800 },
  { label: "Under RM 2,000", value: 2000 },
];

const SORT_OPTIONS: { label: string; value: SortValue }[] = [
  { label: "Default", value: "newest" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Price: High to Low", value: "priceDesc" },
  { label: "Name: A-Z", value: "name" },
];

const SpecialistsGrid = () => {
  const [anchorElPrice, setAnchorElPrice] = useState<null | HTMLElement>(null);
  const [anchorElSort, setAnchorElSort] = useState<null | HTMLElement>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [page, setPage] = useState(1);

  const queryArgs = useMemo(() => {
    const sort_by =
      sortBy === "name"
        ? "title"
        : sortBy === "priceAsc" || sortBy === "priceDesc"
        ? "price"
        : "created_at";

    const sort_order =
      sortBy === "priceAsc" || sortBy === "name" ? "ASC" : "DESC";

    return {
      page,
      limit: PAGE_SIZE,
      sort_by,
      sort_order,
      max_price: maxPrice ?? undefined,
    };
  }, [maxPrice, page, sortBy]);

  const { data, isLoading, isFetching, isError } =
    useGetPublishedSpecialistsQuery(
      queryArgs as {
        page?: number;
        limit?: number;
        sort_by?: "created_at" | "price" | "title";
        sort_order?: "ASC" | "DESC";
        max_price?: number;
      }
    );

  const specialists = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const handlePriceClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorElPrice(event.currentTarget);
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorElSort(event.currentTarget);
  const handleClose = () => {
    setAnchorElPrice(null);
    setAnchorElSort(null);
  };

  const selectPrice = (price: number | null) => {
    setMaxPrice(price);
    setPage(1);
    handleClose();
  };
  const selectSort = (value: SortValue) => {
    setSortBy(value);
    setPage(1);
    handleClose();
  };

  const pageNumbers = useMemo<(number | string)[]>(() => {
    if (!totalPages) return [1];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages: (number | string)[] = [1];
    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  }, [page, totalPages]);

  const resolveHeroImage = (item: Specialist) => {
    const mediaUrl =
      item.media && item.media.length
        ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${item.media[0].file_name}`
        : null;

    return (
      mediaUrl ||
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800"
    );
  };

  return (
    <>
      {/* --- DYNAMIC FILTERS --- */}
      <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
        <div className="flex space-x-3">
          {/* Price Dropdown */}
          <button
            onClick={handlePriceClick}
            className={`border px-4 py-1.5 rounded-md text-sm flex items-center transition-colors ${
              maxPrice
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {maxPrice ? `Under RM ${maxPrice.toLocaleString()}` : "Price"}
            <KeyboardArrowDown fontSize="small" className="ml-2 opacity-50" />
          </button>
          <Menu
            anchorEl={anchorElPrice}
            open={Boolean(anchorElPrice)}
            onClose={handleClose}
          >
            {PRICE_OPTIONS.map((option) => (
              <MenuItem
                key={option.label}
                onClick={() => selectPrice(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Sort Dropdown */}
          <button
            onClick={handleSortClick}
            className="border border-gray-300 px-4 py-1.5 rounded-md text-sm flex items-center hover:bg-gray-50"
          >
            Sort by
            <span className="ml-1 font-bold text-gray-900">
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            </span>
            <KeyboardArrowDown fontSize="small" className="ml-2 opacity-50" />
          </button>
          <Menu
            anchorEl={anchorElSort}
            open={Boolean(anchorElSort)}
            onClose={handleClose}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => selectSort(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>

      {/* --- Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {isLoading && (
          <>
            {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse space-y-3 border border-gray-100 rounded-xl p-3"
              >
                <div className="bg-gray-200 h-36 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </>
        )}

        {!isLoading &&
          !isError &&
          specialists.length > 0 &&
          specialists.map((pro) => {
            const price = Number(pro.base_price) || 0;
            const imageUrl = resolveHeroImage(pro);
            const avatarUrl = resolveHeroImage(pro);

            return (
              <div
                key={pro.id}
                className="group cursor-pointer   rounded-xl p-2 transition-all"
              >
                <div className="relative aspect-4/3 rounded-lg overflow-hidden mb-3">
                  <Image
                    fill
                    src={imageUrl}
                    alt={pro.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar sx={{ width: 22, height: 22 }} src={avatarUrl} />
                  <span className="text-xs font-bold text-gray-700">
                    Adam Low
                  </span>

                  <span className="text-[10px] text-gray-500">
                    • Company Secretary
                  </span>
                </div>
                <p className="text-sm leading-snug font-medium text-gray-800 mb-2 line-clamp-3">
                  {pro.description}
                </p>
                <p className="font-bold text-sm text-gray-900">
                  RM {price.toLocaleString()}
                </p>
              </div>
            );
          })}

        {!isLoading && !isError && specialists.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500">
            No specialists match the current filters.
          </div>
        )}

        {isError && (
          <div className="col-span-full py-20 text-center text-red-500">
            Unable to load specialists right now. Please try again shortly.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-6">
          <button
            disabled={page === 1 || isFetching}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="text-sm font-bold px-2 py-1 text-gray-500 disabled:text-gray-300 hover:text-primary transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {pageNumbers.map((num, idx) =>
              typeof num === "number" ? (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                    num === page
                      ? "bg-[#0A1D56] text-white shadow-lg shadow-blue-900/20"
                      : "text-primary hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              ) : (
                <span key={`${num}-${idx}`} className="text-primary mx-1">
                  ...
                </span>
              )
            )}
          </div>

          <button
            disabled={page === totalPages || isFetching}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="text-primary hover:opacity-70 font-bold text-sm flex items-center gap-1 cursor-pointer disabled:text-gray-300"
          >
            Next <span className="text-xl">›</span>
          </button>
        </div>
      )}
    </>
  );
};

export default SpecialistsGrid;

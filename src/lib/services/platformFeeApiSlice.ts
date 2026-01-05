import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050/api/v1";

export type TierName = "BASIC" | "STANDARD" | "PREMIUM";

export interface PlatformFee {
  id: string;
  tier_name: TierName;
  min_value: number;
  max_value: number;
  platform_fee_percentage: number;
  created_at?: string;
  updated_at?: string;
}

export const platformFeeApiSlice = createApi({
  reducerPath: "platformFeeApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/platform-fee`,
    credentials: "include",
  }),
  tagTypes: ["PlatformFee"],
  endpoints: (builder) => ({
    getAllPlatformFees: builder.query<PlatformFee[], void>({
      query: () => "/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PlatformFee" as const, id })),
              { type: "PlatformFee", id: "LIST" },
            ]
          : [{ type: "PlatformFee", id: "LIST" }],
    }),
    createPlatformFee: builder.mutation<PlatformFee, Partial<PlatformFee>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PlatformFee", id: "LIST" }],
    }),
    updatePlatformFee: builder.mutation<
      PlatformFee,
      { id: string; data: Partial<PlatformFee> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlatformFee", id },
        { type: "PlatformFee", id: "LIST" },
      ],
    }),
    deletePlatformFee: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PlatformFee", id },
        { type: "PlatformFee", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllPlatformFeesQuery,
  useCreatePlatformFeeMutation,
  useUpdatePlatformFeeMutation,
  useDeletePlatformFeeMutation,
} = platformFeeApiSlice;

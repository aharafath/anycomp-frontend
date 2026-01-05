import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface MediaItem {
  media_id?: string;
  id?: string;
  file_name?: string;
  file_size?: string;
  media_type?: string;
  display_order?: number;
}

export interface Specialist {
  slug?: string;
  id: string;
  title: string;
  description: string;
  base_price: string | number;
  duration_days: number;
  platform_fee?: number;
  final_price?: number;
  service_offerings?: {
    id: string;
    service_offerings_master_list: {
      id: string;
      title: string;
      description: string;
    };
  }[];
  service_offering_master_list_ids?: string[];
  media_ids?: string[];
  media?: MediaItem[];
  average_rating?: string;
  total_number_of_ratings?: number;
  verification_status: "PENDING" | "APPROVED" | "REJECTED";
  is_verified?: boolean;
  is_draft?: boolean;
  created_by?: {
    id: string;
    name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type CreateSpecialistDto = FormData | Record<string, any>;

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const LIST_TAG = { type: "Specialist", id: "LIST" } as const;
const PUBLISHED_LIST_TAG = {
  type: "Specialist",
  id: "PUBLISHED_LIST",
} as const;

export const specialistApiSlice = createApi({
  reducerPath: "specialistApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050/api/v1") +
      "/specialist/",
    credentials: "include",
  }),
  tagTypes: ["Specialist"],
  endpoints: (builder) => ({
    getAllSpecialists: builder.query<
      PaginatedResponse<Specialist>,
      {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ status, search, page = 1, limit = 10 }) => ({
        url: "",
        params: {
          is_draft: status,
          search,
          page,
          limit,
        },
      }),
      providesTags: [LIST_TAG],
    }),

    getPublishedSpecialists: builder.query<
      PaginatedResponse<Specialist>,
      {
        page?: number;
        limit?: number;
        sort_by?: "created_at" | "price" | "title";
        sort_order?: "ASC" | "DESC";
        min_price?: number;
        max_price?: number;
      }
    >({
      query: ({
        page = 1,
        limit = 12,
        sort_by = "created_at",
        sort_order = "DESC",
        min_price,
        max_price,
      }) => ({
        url: "published/specialists",
        params: {
          page,
          limit,
          sort_by,
          sort_order,
          min_price,
          max_price,
        },
      }),
      providesTags: [PUBLISHED_LIST_TAG],
    }),

    getSpecialist: builder.query<Specialist, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [
        { type: "Specialist" as const, id },
        ...(result?.slug
          ? [{ type: "Specialist" as const, id: result.slug }]
          : []),
      ],
    }),

    getSpecialistBySlug: builder.query<Specialist, string>({
      query: (slug) => `/slug/${slug}`,
      providesTags: (result, error, slug) => [
        { type: "Specialist" as const, id: slug },
        ...(result?.id ? [{ type: "Specialist" as const, id: result.id }] : []),
      ],
    }),

    createSpecialist: builder.mutation<Specialist, CreateSpecialistDto>({
      query: (data) => {
        const isFormData =
          typeof FormData !== "undefined" && data instanceof FormData;
        return {
          url: "/",
          method: "POST",
          body: data,
          ...(isFormData
            ? {}
            : { headers: { "Content-Type": "application/json" } }),
        };
      },
      invalidatesTags: [LIST_TAG, PUBLISHED_LIST_TAG],
    }),

    updateSpecialist: builder.mutation<
      Specialist,
      { id: string; data: Partial<CreateSpecialistDto> }
    >({
      query: ({ id, data }) => {
        const isFormData =
          typeof FormData !== "undefined" && data instanceof FormData;
        return {
          url: `/${id}`,
          method: "PUT",
          body: data,
          ...(isFormData
            ? {}
            : { headers: { "Content-Type": "application/json" } }),
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Specialist" as const, id },
        ...(result?.slug
          ? [{ type: "Specialist" as const, id: result.slug }]
          : []),
        LIST_TAG,
        PUBLISHED_LIST_TAG,
      ],
    }),

    updateSpecialistVerification: builder.mutation<
      Specialist,
      {
        id: string;
        data: Partial<{ verification_status: string; is_verified: boolean }>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/${id}/verification`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Specialist" as const, id },
        ...(result?.slug
          ? [{ type: "Specialist" as const, id: result.slug }]
          : []),
        LIST_TAG,
        PUBLISHED_LIST_TAG,
      ],
    }),

    approveSpecialist: builder.mutation<Specialist, string>({
      query: (id) => ({
        url: `/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Specialist" as const, id },
        ...(result?.slug
          ? [{ type: "Specialist" as const, id: result.slug }]
          : []),
        LIST_TAG,
        PUBLISHED_LIST_TAG,
      ],
    }),

    rejectSpecialist: builder.mutation<Specialist, string>({
      query: (id) => ({
        url: `/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Specialist" as const, id },
        ...(result?.slug
          ? [{ type: "Specialist" as const, id: result.slug }]
          : []),
        LIST_TAG,
        PUBLISHED_LIST_TAG,
      ],
    }),

    updateSpecialistDraft: builder.mutation<
      Specialist,
      {
        id: string;
        data: Partial<{ is_draft: boolean }>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/${id}/draft`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Specialist" as const, id },
        ...(result?.slug
          ? [{ type: "Specialist" as const, id: result.slug }]
          : []),
        LIST_TAG,
        PUBLISHED_LIST_TAG,
      ],
    }),

    deleteSpecialist: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Specialist", id },
        LIST_TAG,
        PUBLISHED_LIST_TAG,
      ],
    }),
  }),
});

export const {
  useGetAllSpecialistsQuery,
  useGetSpecialistQuery,
  useCreateSpecialistMutation,
  useUpdateSpecialistMutation,
  useDeleteSpecialistMutation,
  useUpdateSpecialistDraftMutation,
  useUpdateSpecialistVerificationMutation,
  useApproveSpecialistMutation,
  useRejectSpecialistMutation,
  useGetPublishedSpecialistsQuery,
  useGetSpecialistBySlugQuery,
} = specialistApiSlice;

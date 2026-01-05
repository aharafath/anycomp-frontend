import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ServiceOfferingsMasterList {
  id: string;
  title: string;
  description: string;
  s3_key?: string | null;
  bucket_name: string;
  created_at: string;
  updated_at: string;
}

export const serviceOfferingsMasterListApiSlice = createApi({
  reducerPath: "serviceOfferingsMasterListApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050/api/v1") +
      "/service-offerings-master-list/",
    credentials: "include",
  }),
  tagTypes: ["ServiceOfferingsMasterList"],
  endpoints: (builder) => ({
    getAllServiceOfferingsMasterList: builder.query<
      ServiceOfferingsMasterList[],
      void
    >({
      query: () => "",
      providesTags: [{ type: "ServiceOfferingsMasterList", id: "LIST" }],
    }),
    getServiceOfferingMasterListById: builder.query<
      ServiceOfferingsMasterList,
      string
    >({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [
        { type: "ServiceOfferingsMasterList" as const, id },
      ],
    }),
    createServiceOfferingMasterList: builder.mutation<
      ServiceOfferingsMasterList,
      Partial<ServiceOfferingsMasterList> | FormData
    >({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ServiceOfferingsMasterList", id: "LIST" }],
    }),
    updateServiceOfferingMasterList: builder.mutation<
      ServiceOfferingsMasterList,
      { id: string; data: Partial<ServiceOfferingsMasterList> | FormData }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ServiceOfferingsMasterList", id },
        { type: "ServiceOfferingsMasterList", id: "LIST" },
      ],
    }),
    deleteServiceOfferingMasterList: builder.mutation<{ message: string }, string>(
      {
        query: (id) => ({
          url: `/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "ServiceOfferingsMasterList", id },
          { type: "ServiceOfferingsMasterList", id: "LIST" },
        ],
      }
    ),
  }),
});

export const {
  useGetAllServiceOfferingsMasterListQuery,
  useGetServiceOfferingMasterListByIdQuery,
  useCreateServiceOfferingMasterListMutation,
  useUpdateServiceOfferingMasterListMutation,
  useDeleteServiceOfferingMasterListMutation,
} = serviceOfferingsMasterListApiSlice;

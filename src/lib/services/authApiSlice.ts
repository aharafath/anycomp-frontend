import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050/api/v1") +
  "/auth";

export interface AuthResponse<TUser = unknown> {
  message?: string;
  token?: string;
  user?: TUser;
}

export type RoleName = "User" | "Admin" | "Super Admin" | string;

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: { name?: RoleName } | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authApiSlice = createApi({
  reducerPath: "authApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    getCurrentUser: builder.query<AuthResponse<AuthUser>, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
    logout: builder.mutation<{ message?: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useLogoutMutation,
} = authApiSlice;

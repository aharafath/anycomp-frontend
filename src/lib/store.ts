import { configureStore } from "@reduxjs/toolkit";
import tabsReducer from "./features/tabs/tabsSlice";
import { serviceOfferingsMasterListApiSlice } from "./services/serviceOfferingsMasterListApiSlice";
import { specialistApiSlice } from "./services/specialistApiSlice";
import { authApiSlice } from "./services/authApiSlice";
import { platformFeeApiSlice } from "./services/platformFeeApiSlice";

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
    [serviceOfferingsMasterListApiSlice.reducerPath]:
      serviceOfferingsMasterListApiSlice.reducer,
    [specialistApiSlice.reducerPath]: specialistApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [platformFeeApiSlice.reducerPath]: platformFeeApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(serviceOfferingsMasterListApiSlice.middleware)
      .concat(specialistApiSlice.middleware)
      .concat(authApiSlice.middleware)
      .concat(platformFeeApiSlice.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

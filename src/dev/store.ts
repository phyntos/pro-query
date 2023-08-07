import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { getProQuery, ProQuerySlice } from '../pro-redux-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const DevApi = createApi({
    reducerPath: 'DevApi',
    tagTypes: [],
    baseQuery: getProQuery({}),
    endpoints: () => ({}),
});

export const DevIrsApi = createApi({
    reducerPath: 'DevIrsApi',
    tagTypes: [],
    baseQuery: getProQuery({ name: 'Irs' }),
    endpoints: () => ({}),
});

export const store = configureStore({
    reducer: {
        [DevApi.reducerPath]: DevApi.reducer,
        [DevIrsApi.reducerPath]: DevIrsApi.reducer,
        ProQuery: ProQuerySlice,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat([DevApi.middleware, DevIrsApi.middleware]),
});

export type AppThunkConfig = {
    state: RootState;
    dispatch: AppDispatch;
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

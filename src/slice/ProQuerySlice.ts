import { createSlice } from '@reduxjs/toolkit';
import { PropType } from '../components/ProQueryProvider';

type ProQueryDataType = {
    name: string;
    token: PropType;
    baseUrl: PropType;
};

type ProQueryStateType = {
    dataList: ProQueryDataType[];
};

const ProQueryState: ProQueryStateType = {
    dataList: [{ baseUrl: undefined, name: 'Main', token: undefined }],
};

const ProQuerySlice = createSlice<
    ProQueryStateType,
    {
        setQueryData: (
            state: ProQueryStateType,
            action: {
                payload: ProQueryDataType;
            },
        ) => void;
        setQueryToken: (
            state: ProQueryStateType,
            action: {
                payload: Pick<ProQueryDataType, 'name' | 'token'>;
            },
        ) => void;
        setQueryBaseUrl: (
            state: ProQueryStateType,
            action: {
                payload: Pick<ProQueryDataType, 'name' | 'baseUrl'>;
            },
        ) => void;
    },
    'ProQuery'
>({
    name: 'ProQuery',
    initialState: ProQueryState,
    reducers: {
        setQueryData: (state, { payload }) => {
            const dataIndex = state.dataList.findIndex((x) => x.name === payload.name);
            if (dataIndex === -1) {
                state.dataList.push(payload);
            } else {
                state.dataList[dataIndex] = payload;
            }
        },
        setQueryToken: (state, { payload }) => {
            const dataIndex = state.dataList.findIndex((x) => x.name === payload.name);
            if (dataIndex !== -1) {
                state.dataList[dataIndex].token = payload.token;
            }
        },
        setQueryBaseUrl: (state, { payload }) => {
            const dataIndex = state.dataList.findIndex((x) => x.name === payload.name);
            if (dataIndex !== -1) {
                state.dataList[dataIndex].baseUrl = payload.baseUrl;
            }
        },
    },
});

export type ProQueryState = { ProQuery: ProQueryStateType };
export type ProActionType = 'ProQuery/setToken' | 'ProQuery/setBaseUrl';
export type ProQueryAction =
    | { payload: string | undefined; type: 'ProQuery/setToken' }
    | { payload: string | undefined; type: 'ProQuery/setBaseUrl' };

export const selectToken =
    (name = 'Main') =>
    (state: ProQueryState) =>
        state.ProQuery.dataList.find((x) => x.name === name)?.token;
export const selectBaseUrl =
    (name = 'Main') =>
    (state: ProQueryState) =>
        state.ProQuery.dataList.find((x) => x.name === name)?.baseUrl;

export const { setQueryData, setQueryBaseUrl, setQueryToken } = ProQuerySlice.actions;

export default ProQuerySlice.reducer;

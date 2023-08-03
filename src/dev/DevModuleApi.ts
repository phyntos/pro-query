import { DevApi, DevIrsApi } from './store';

export type LoginVM = {
    source?: 'my';
    email?: string;
    password?: string;
};

export type LoginIrsVM = {
    email?: string;
    password?: string;
};

export type IrsResponse<T extends Record<string, any>> = T & {
    description: null | string;
    errors: null | any[];
    result: 0;
};

export const DevModuleApi = DevApi.injectEndpoints({
    endpoints: (build) => {
        return {
            login: build.mutation<string, LoginVM>({
                query: (body) => ({
                    url: '/account/login',
                    method: 'POST',
                    body,
                    responseHandler: 'text',
                }),
            }),
            getContracts: build.query<any, void>({
                query: () => ({
                    url: 'contractAgreements/requests',
                    params: { page: 1, size: 10 },
                }),
            }),
        };
    },
});

export const DevModuleIrsApi = DevIrsApi.injectEndpoints({
    endpoints: (build) => {
        return {
            loginIrs: build.mutation<
                IrsResponse<{
                    token: string;
                }>,
                LoginIrsVM
            >({
                query: (body) => ({
                    url: '/account/logOn',
                    method: 'POST',
                    body,
                }),
            }),
        };
    },
});

export const { useLoginMutation, useGetContractsQuery } = DevModuleApi;
export const { useLoginIrsMutation } = DevModuleIrsApi;

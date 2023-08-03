import { BaseQueryFn, QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { ProQueryState, selectBaseUrl, selectToken } from '../slice/ProQuerySlice';
import { MaybePromiseProp, PropType } from '../components/ProQueryProvider';

export type CommonQueryArgs = {
    name?: string;
    baseUrl?: MaybePromiseProp<PropType>;
    token?: MaybePromiseProp<PropType>;
    prepareHeaders?: FetchBaseQueryArgs['prepareHeaders'];
    getState: () => unknown;
};

export const getCommonQuery = async ({ baseUrl, token, prepareHeaders, getState, name = 'Main' }: CommonQueryArgs) => {
    if (!baseUrl) {
        if (getState) {
            const state = getState() as ProQueryState;
            baseUrl = selectBaseUrl(name)(state);
        }
    } else {
        baseUrl = typeof baseUrl === 'function' ? await baseUrl() : baseUrl;
    }

    if (!token) {
        if (getState) {
            const state = getState() as ProQueryState;
            token = selectToken(name)(state);
        }
    } else {
        token = typeof token === 'function' ? await token() : token;
    }

    return fetchBaseQuery({
        baseUrl: baseUrl || undefined,
        prepareHeaders: async (headers, api) => {
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return prepareHeaders ? await prepareHeaders(headers, api) : headers;
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        },
    });
};

export type ResultNormalize<T> = (
    result: QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta>,
) => QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta>;

const getProQuery = <T>({
    resultNormalize,
    ...commonArgs
}: Omit<CommonQueryArgs, 'getState'> & {
    resultNormalize?: (
        result: QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta>,
    ) => QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta>;
}): BaseQueryFn<string | FetchArgs, T, FetchBaseQueryError> => {
    return async (args, api, extraOptions) => {
        const commonQuery = await getCommonQuery({ ...commonArgs, getState: api.getState });

        const result = (await commonQuery(args, api, extraOptions)) as QueryReturnValue<
            T,
            FetchBaseQueryError,
            FetchBaseQueryMeta
        >;

        return resultNormalize ? resultNormalize(result) : result;
    };
};

export default getProQuery;

import { BaseQueryFn, QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { MaybePromiseProp, PropType, getProp } from '../components/ProQueryProvider';
import {
    HeaderType,
    ProQueryState,
    selectQueryBaseUrl,
    selectQueryPrepareHeaders,
    selectQueryToken,
} from '../slice/ProQuerySlice';

export type CommonQueryArgs = {
    name?: string;
    baseUrl?: MaybePromiseProp<PropType>;
    token?: MaybePromiseProp<PropType>;
    prepareHeaders?: MaybePromiseProp<HeaderType[]>;
    getState: () => unknown;
};

export const getCommonQuery = async ({ baseUrl, token, prepareHeaders, getState, name = 'Main' }: CommonQueryArgs) => {
    let preparedBaseUrl: PropType;
    let preparedToken: PropType;
    let preparedPrepareHeaders: undefined | HeaderType[] = [];

    if (!baseUrl) {
        if (getState) {
            const state = getState() as ProQueryState;
            preparedBaseUrl = selectQueryBaseUrl(name)(state);
        }
    } else {
        preparedBaseUrl = await getProp(baseUrl);
    }

    if (!token) {
        if (getState) {
            const state = getState() as ProQueryState;
            preparedToken = selectQueryToken(name)(state);
        }
    } else {
        preparedToken = await getProp(token);
    }

    if (!prepareHeaders) {
        if (getState) {
            const state = getState() as ProQueryState;
            preparedPrepareHeaders = selectQueryPrepareHeaders(name)(state);
        }
    } else {
        preparedPrepareHeaders = await getProp(prepareHeaders);
    }

    return fetchBaseQuery({
        baseUrl: preparedBaseUrl || undefined,
        prepareHeaders: async (headers) => {
            if (preparedToken) headers.set('Authorization', `Bearer ${preparedToken}`);
            if (preparedPrepareHeaders?.length) {
                preparedPrepareHeaders.forEach(({ key, value }) => {
                    headers.set(key, value);
                });
            }
            return headers;
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        },
    });
};

export type ResultNormalize<T> = (
    result: QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta>,
) => QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta>;

const getProQuery = <T>(
    params: Omit<CommonQueryArgs, 'getState'> & {
        resultNormalize?: ResultNormalize<T>;
    } = {},
): BaseQueryFn<string | FetchArgs, T, FetchBaseQueryError> => {
    const { resultNormalize, ...commonArgs } = params;

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

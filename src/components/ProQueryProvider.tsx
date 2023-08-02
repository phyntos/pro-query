import { Action, AnyAction, Store } from '@reduxjs/toolkit';
import React, { ReactNode, useCallback } from 'react';
import { Provider, useSelector } from 'react-redux';
import { selectBaseUrl, selectToken, setQueryData } from '../pro-query';

export type PropType = string | null | undefined;
export type MaybePromiseProp<T extends PropType> = T | (() => T | Promise<T>);

const getProp = async (prop?: MaybePromiseProp<PropType>): Promise<PropType> => {
    if (!prop) return undefined;
    if (typeof prop === 'function') {
        return await prop();
    }
    return prop;
};

const ProQueryProvider = <A extends Action = AnyAction, S = unknown>({
    store,
    children,
    token,
    baseUrl,
    extraQueries,
}: {
    store: Store<S, A>;
    children: ReactNode;
    token?: MaybePromiseProp<PropType>;
    baseUrl?: MaybePromiseProp<PropType>;
    extraQueries?: {
        token?: MaybePromiseProp<PropType>;
        baseUrl?: MaybePromiseProp<PropType>;
        name: string;
    }[];
}) => {
    const setQueryDataAsync = useCallback(
        async ({
            name = 'Main',
            token,
            baseUrl,
        }: {
            name?: string;
            token?: MaybePromiseProp<PropType>;
            baseUrl?: MaybePromiseProp<PropType>;
        }) => {
            const [propBaseUrl, propToken] = await Promise.all([getProp(baseUrl), getProp(token)]);

            store.dispatch(setQueryData({ baseUrl: propBaseUrl, name, token: propToken }) as any as A);
        },
        [store],
    );

    setQueryDataAsync({ baseUrl, token });

    extraQueries?.forEach((queryData) => {
        setQueryDataAsync(queryData);
    });

    return <Provider store={store}>{children}</Provider>;
};

export const useToken = (name = 'Main') => {
    const token = useSelector(selectToken(name));

    return token;
};

export const useBaseUrl = (name = 'Main') => {
    const baseUrl = useSelector(selectBaseUrl(name));

    return baseUrl;
};

export default ProQueryProvider;

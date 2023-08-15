import { Action, AnyAction, Store } from '@reduxjs/toolkit';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { selectQueryBaseUrl, selectQueryToken, setQueryData } from '../pro-redux-query';
import { HeaderType } from '../slice/ProQuerySlice';

export type PropType = string | null | undefined;
export type MaybePromiseProp<T> = T | (() => T | Promise<T>);

export const getProp = async <T,>(prop?: MaybePromiseProp<T>): Promise<T | undefined> => {
    if (!prop) return undefined;
    if (typeof prop === 'function') {
        /* @ts-ignore */
        return await prop();
    }
    return prop;
};

export type ProQueryProviderExtraQuery = {
    token?: MaybePromiseProp<PropType>;
    baseUrl?: MaybePromiseProp<PropType>;
    prepareHeaders?: MaybePromiseProp<HeaderType[]>;
    name: string;
};

export type ProQueryProviderProps<A extends Action = AnyAction, S = unknown> = {
    store: Store<S, A>;
    children: ReactNode;
    token?: MaybePromiseProp<PropType>;
    baseUrl?: MaybePromiseProp<PropType>;
    prepareHeaders?: MaybePromiseProp<HeaderType[]>;
    extraQueries?: ProQueryProviderExtraQuery[];
};

const ProQueryProvider = <A extends Action = AnyAction, S = unknown>({
    store,
    children,
    token,
    baseUrl,
    prepareHeaders,
    extraQueries,
}: ProQueryProviderProps<A, S>) => {
    const [isQuerySet, setIsQuerySet] = useState(false);

    const setQueryDataAsync = useCallback(
        async ({
            name = 'Main',
            token,
            baseUrl,
            prepareHeaders,
        }: {
            name?: string;
            token?: MaybePromiseProp<PropType>;
            baseUrl?: MaybePromiseProp<PropType>;
            prepareHeaders?: MaybePromiseProp<HeaderType[]>;
        }) => {
            const [propBaseUrl, propToken, propPrepareHeaders] = await Promise.all([
                getProp(baseUrl),
                getProp(token),
                getProp(prepareHeaders),
            ]);

            store.dispatch(
                setQueryData({
                    baseUrl: propBaseUrl,
                    name,
                    token: propToken,
                    prepareHeaders: propPrepareHeaders,
                }) as any as A,
            );
        },
        [store],
    );

    useEffect(() => {
        setIsQuerySet(false);
        const promise = setQueryDataAsync({ baseUrl, token, prepareHeaders });

        const extraPromises = extraQueries?.map((queryData) => {
            return setQueryDataAsync(queryData);
        });

        Promise.all([promise, ...(extraPromises || [])]).finally(() => {
            setIsQuerySet(true);
        });
    }, [setQueryDataAsync, baseUrl, token, prepareHeaders, extraQueries]);

    if (isQuerySet) return <Provider store={store}>{children}</Provider>;

    return null;
};

export const useQueryToken = (name = 'Main') => {
    const token = useSelector(selectQueryToken(name));

    return token;
};

export const useQueryBaseUrl = (name = 'Main') => {
    const baseUrl = useSelector(selectQueryBaseUrl(name));

    return baseUrl;
};

export default ProQueryProvider;

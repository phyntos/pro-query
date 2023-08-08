import { Action, AnyAction, Store } from '@reduxjs/toolkit';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { selectQueryBaseUrl, selectQueryToken, setQueryData } from '../pro-redux-query';

export type PropType = string | null | undefined;
export type MaybePromiseProp<T extends PropType> = T | (() => T | Promise<T>);

const getProp = async (prop?: MaybePromiseProp<PropType>): Promise<PropType> => {
    if (!prop) return undefined;
    if (typeof prop === 'function') {
        return await prop();
    }
    return prop;
};

export type ProQueryProviderExtraQuery = {
    token?: MaybePromiseProp<PropType>;
    baseUrl?: MaybePromiseProp<PropType>;
    name: string;
};

export type ProQueryProviderProps<A extends Action = AnyAction, S = unknown> = {
    store: Store<S, A>;
    children: ReactNode;
    token?: MaybePromiseProp<PropType>;
    baseUrl?: MaybePromiseProp<PropType>;
    extraQueries?: ProQueryProviderExtraQuery[];
};

const ProQueryProvider = <A extends Action = AnyAction, S = unknown>({
    store,
    children,
    token,
    baseUrl,
    extraQueries,
}: ProQueryProviderProps<A, S>) => {
    const [isQuerySet, setIsQuerySet] = useState(false);

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

    useEffect(() => {
        setIsQuerySet(false);
        const promise = setQueryDataAsync({ baseUrl, token });

        const extraPromises = extraQueries?.map((queryData) => {
            return setQueryDataAsync(queryData);
        });

        Promise.all([promise, ...(extraPromises || [])]).finally(() => {
            setIsQuerySet(true);
        });
    }, [setQueryDataAsync, baseUrl, token, extraQueries]);

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

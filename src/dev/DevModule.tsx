import React from 'react';
import { useGetContractsQuery } from './DevModuleApi';

const DevModule = () => {
    const { data } = useGetContractsQuery();
    return <div>{JSON.stringify(data)}</div>;
};

export default DevModule;

import React from 'react';
import { useToken } from '../pro-redux-query';
import DevAuth from './DevAuth';
import DevModule from './DevModule';

const DevMain = () => {
    const token = useToken();

    if (!token) return <DevAuth />;

    return <DevModule />;
};

export default DevMain;

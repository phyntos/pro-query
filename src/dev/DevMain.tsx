import React from 'react';
import { useQueryToken } from '../pro-redux-query';
import DevAuth from './DevAuth';
import DevModule from './DevModule';

const DevMain = () => {
    const token = useQueryToken();

    if (!token) return <DevAuth />;

    return <DevModule />;
};

export default DevMain;

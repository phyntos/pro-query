import React from 'react';
import { ProQueryProvider } from '../pro-redux-query';
import { store } from './store';
import DevModule from './DevModule';

const DevApp = () => {
    return (
        <ProQueryProvider
            store={store}
            baseUrl='https:/localhost:5001/api/'
            token={() => sessionStorage.getItem('token')}
            extraQueries={[
                {
                    name: 'Irs',
                    baseUrl: 'https:/localhost:6001/api/',
                    token: () => sessionStorage.getItem('irsToken'),
                },
            ]}
        >
            <DevModule />
        </ProQueryProvider>
    );
};

export default DevApp;

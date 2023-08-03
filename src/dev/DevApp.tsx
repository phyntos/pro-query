import React from 'react';
import { ProQueryProvider } from '../pro-redux-query';
import DevMain from './DevMain';
import { store } from './store';

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
            <DevMain />
        </ProQueryProvider>
    );
};

export default DevApp;

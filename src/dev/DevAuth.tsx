import React, { useState } from 'react';
import { setQueryPrepareHeaders, setQueryToken } from '../slice/ProQuerySlice';
import { useLoginIrsMutation, useLoginMutation } from './DevModuleApi';
import { useAppDispatch } from './hooks';

const DevAuth = () => {
    const [login] = useLoginMutation();
    const [loginIrs] = useLoginIrsMutation();

    const dispatch = useAppDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100vh - 16px)',
            }}
        >
            <input type='text' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button
                onClick={() => {
                    login({ email, password, source: 'my' })
                        .unwrap()
                        .then((token) => {
                            dispatch(setQueryToken({ name: 'Main', token }));
                            sessionStorage.setItem('token', token);
                        })
                        .catch(() => {
                            dispatch(
                                setQueryPrepareHeaders({
                                    name: 'Main',
                                    prepareHeaders: [{ key: 'lang', value: 'kz' }],
                                }),
                            );
                        });
                }}
            >
                Login
            </button>
            <button
                onClick={() => {
                    loginIrs({ email, password });
                }}
            >
                Login Irs
            </button>
        </div>
    );
};

export default DevAuth;

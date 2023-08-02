import React, { useState } from 'react';
import { useLoginMutation, useLoginIrsMutation } from './DevModuleApi';

const DevModule = () => {
    const [login] = useLoginMutation();
    const [loginIrs] = useLoginIrsMutation();

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
                    login({ email, password, source: 'my' });
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

export default DevModule;

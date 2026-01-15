import { useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import Logo from '@/assets/logo.svg';
import { FormField } from '@/components/FormField';
import * as authenticateService from '@/services/authenticate.service';
import { useAuthStore } from '@/stores/auth.store';
import { useErrorHandler } from '@/hooks/useHandleError';

const Login = () => {
    const { handleError } = useErrorHandler();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const setUser = useAuthStore((state) => state.setUser);

    const authenticate = async () => {
        setIsLoading(true);
        try {
            const response = await authenticateService.authenticate({
                username,
                password,
            });

            setUser({
                username: response.username,
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
                expireIn: response.expire_in,
                refreshExpireIn: response.refresh_expire_in,
            });
        } catch (error) {
           handleError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAuthenticate = async () => {
        await authenticate();
    }

    return (
        <div className='surface-ground flex items-center justify-center min-h-screen min-w-screen overflow-hidden'>
            <div className="flex flex-col items-center justify-center">
                <img src={Logo} alt="TutorPet logo" className="mb-5 w-32 flex-shrink-0" />
                <Card>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div>
                            <FormField label="Usuário" inputId="username1" classNameContainer="mb-5">
                                <InputText id="username1" type="text" placeholder="Seu usuário" className="w-full md:w-30rem mb-5" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </FormField>

                            <FormField label="Senha" inputId="password1" classNameContainer="mb-5">
                                <Password inputId="password1" value={password} feedback={false} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" toggleMask className="w-full mb-5" inputClassName="w-full"></Password>
                            </FormField>
                            <div className='text-center'>
                                <Button label="Entrar" loading={isLoading} className="p-3 text-xl" onClick={handleAuthenticate}></Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;

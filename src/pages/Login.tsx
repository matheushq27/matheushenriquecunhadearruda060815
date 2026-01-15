import { useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import Logo from '@/assets/logo.svg';
import { FormField } from '@/components/FormField';

const Login = () => {
    const [password, setPassword] = useState('');

    return (
        <div className='surface-ground flex items-center justify-center min-h-screen min-w-screen overflow-hidden'>
            <div className="flex flex-col items-center justify-center">
                <img src={Logo} alt="TutorPet logo" className="mb-5 w-32 flex-shrink-0" />
                <Card>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div>
                            <FormField label="Email" inputId="email1" classNameContainer="mb-5">
                                <InputText id="email1" type="text" placeholder="Seu endereço de email" className="w-full md:w-30rem mb-5" />
                            </FormField>

                            <FormField label="Senha" inputId="password1" classNameContainer="mb-5">
                                <Password inputId="password1" value={password} feedback={false} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" toggleMask className="w-full mb-5" inputClassName="w-full"></Password>
                            </FormField>
                            <Button label="Entrar" className="w-full p-3 text-xl" onClick={() => console.log('teste')}></Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;

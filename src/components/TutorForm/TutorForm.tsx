import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useForm, Controller } from 'react-hook-form'
import { FormField } from '../FormField'
import { InputMask } from 'primereact/inputmask';
import type { CreateTutorProps } from '@/interfaces/services/tutors.service';
import { validateCPF } from '@/helpers/Validators';
import { useState } from 'react';
import { DialogForm } from "@/components/DialogForm";
import * as tutorsService from "@/services/tutors/tutors.service";
import { useErrorHandler } from "@/hooks/useHandleError";
import { keepOnlyNumbers } from '@/helpers/Formatters';
import { useToast } from '@/contexts/ToastContext';

export interface CreateTutorFormData extends CreateTutorProps { }

export function TutorForm({ afterCreating }: { afterCreating?: () => void }) {

    const {showSuccess} = useToast();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [loadingCreateTutor, setLoadingCreateTutor] = useState(false);
    const { handleError } = useErrorHandler();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateTutorFormData>({
        defaultValues: {
            nome: '',
            email: '',
            telefone: '',
            endereco: '',
            cpf: '',
        },
    })

    const createTutor = async (data: CreateTutorFormData) => {
        setLoadingCreateTutor(true);
        try {
            const response = await tutorsService.createTutor(data);
            if(afterCreating){
                afterCreating();
            }
            reset({
                nome: '',
                email: '',
                telefone: '',
                endereco: '',
                cpf: '',
            })
            setDialogVisible(false);
            showSuccess('Tutor adicionado com sucesso!');
            console.log(response);
        } catch (error) {
            handleError(error);
        } finally {
            setLoadingCreateTutor(false);
        }
    }

    const handleSubmitForm = async (data: CreateTutorFormData) => {
        data.cpf = keepOnlyNumbers(data.cpf);
        data.telefone = keepOnlyNumbers(data.telefone);
        await createTutor(data);
    }

    return (
        <>
            <Button label="Adicionar" icon="pi pi-plus" onClick={() => setDialogVisible(true)} outlined />
            <DialogForm
                isOpen={dialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Adicionar Tutor"
            >
                <form
                    onSubmit={handleSubmit(handleSubmitForm)}
                    className="flex flex-col gap-4"
                >
                    <div className='h-96 xl:h-auto overflow-y-auto'>
                        {/* NOME */}
                        <div className="flex flex-col gap-1 mt-5 mb-3">
                            <FormField label="Nome" inputId="nome" errorMessage={errors.nome} required>
                                <Controller
                                    name="nome"
                                    control={control}
                                    rules={{ required: 'Nome é obrigatório' }}
                                    render={({ field }) => (
                                        <InputText
                                            {...field}
                                            id="nome"
                                            invalid={!!errors.nome}
                                            className="w-full"
                                        />
                                    )}
                                />
                            </FormField>
                        </div>

                        {/* EMAIL */}
                        <div className="flex flex-col gap-1 mb-3">
                            <FormField label="Email" inputId="email" errorMessage={errors.email} required>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: 'Email é obrigatório',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Email inválido',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <InputText
                                                {...field}
                                                id="email"
                                                type="email"
                                                invalid={!!errors.email}
                                            />
                                        </>
                                    )}
                                />
                            </FormField>
                        </div>

                        {/* TELEFONE */}
                        <div className="flex flex-col gap-1 mb-3">
                            <FormField label="Telefone" inputId="telefone" errorMessage={errors.telefone} required>
                                <Controller
                                    name="telefone"
                                    control={control}
                                    rules={{ required: 'Telefone é obrigatório' }}
                                    render={({ field }) => (
                                        <InputMask
                                            {...field}
                                            id="telefone"
                                            placeholder="(99) 99999-9999"
                                            invalid={!!errors.telefone}
                                            mask="(99) 99999-9999"
                                        />
                                    )}
                                />
                            </FormField>
                        </div>

                        {/* ENDEREÇO */}
                        <div className="flex flex-col gap-1 mb-3">
                            <FormField label="Endereço" inputId="endereco" errorMessage={errors.endereco} required>
                                <Controller
                                    name="endereco"
                                    control={control}
                                    rules={{ required: 'Endereço é obrigatório' }}
                                    render={({ field }) => (
                                        <InputText
                                            {...field}
                                            id="endereco"
                                            invalid={!!errors.endereco}
                                        />
                                    )}
                                />
                            </FormField>
                        </div>

                        {/* CPF */}
                        <div className="flex flex-col gap-1 mb-3">
                            <FormField label="CPF" inputId="cpf" errorMessage={errors.cpf} required>
                                <Controller
                                    name="cpf"
                                    control={control}
                                    rules={{
                                        required: 'CPF é obrigatório',
                                        minLength: {
                                            value: 11,
                                            message: 'CPF deve ter 11 dígitos',
                                        },
                                        validate: validateCPF,
                                    }}
                                    render={({ field }) => (
                                        <InputMask
                                            {...field}
                                            id="cpf"
                                            keyfilter="int"
                                            maxLength={11}
                                            invalid={!!errors.cpf}
                                            mask="999.999.999-99"
                                        />
                                    )}
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* BOTÃO */}
                    <Button
                        type="submit"
                        label="Salvar Tutor"
                        loading={loadingCreateTutor}
                    />
                </form >
            </DialogForm>
        </>
    )
}
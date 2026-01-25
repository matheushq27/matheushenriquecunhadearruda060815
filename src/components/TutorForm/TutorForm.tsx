import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useForm, Controller } from 'react-hook-form'
import { FormField } from '../FormField'
import { InputMask } from 'primereact/inputmask';
import { ProgressBar } from 'primereact/progressbar';
import type { CreateTutorProps } from '@/interfaces/services/tutors.service';
import { validateCPF } from '@/helpers/Validators';
import { useEffect, useState } from 'react';
import { DialogForm } from "@/components/DialogForm";
import * as tutorsService from "@/services/tutors/tutors.service";
import { useErrorHandler } from "@/hooks/useHandleError";
import { keepOnlyNumbers } from '@/helpers/Formatters';
import { useToast } from '@/contexts/ToastContext';
import { useTutorsStore } from "@/stores/tutors.store";
import { AvatarEdit } from '../AvatarEdit';

export interface CreateTutorFormData extends CreateTutorProps { }

export function TutorForm({ afterCreating }: { afterCreating?: () => void }) {

    const { showSuccess } = useToast();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [loadingCreateTutor, setLoadingCreateTutor] = useState(false);
    const [loadingRemoveTutorPhoto, setLoadingRemoveTutorPhoto] = useState(false);
    const [loadingGetTutor, setLoadingGetTutor] = useState(false);
    const [loadingUpdateTutor, setLoadingUpdateTutor] = useState(false);
    const { handleError } = useErrorHandler();
    const { currentTutor, setCurrentTutor, updateTutorPhoto: updateTutorPhotoStore } = useTutorsStore((state) => state);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

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

    const resetValues = () => {
        reset({
            nome: '',
            email: '',
            telefone: '',
            endereco: '',
            cpf: '',
        })
    }

    const createTutor = async (data: CreateTutorFormData) => {
        setLoadingCreateTutor(true);
        try {
            await tutorsService.createTutor(data);
            if (afterCreating) {
                afterCreating();
            }
            resetValues()
            setDialogVisible(false);
            showSuccess('Tutor adicionado com sucesso!');
        } catch (error) {
            handleError(error);
        } finally {
            setLoadingCreateTutor(false);
        }
    }

    const updateTutor = async (data: CreateTutorFormData) => {
        if (!currentTutor) {
            return handleError({}, 'Erro ao atualizar tutor');
        }

        setLoadingUpdateTutor(true);
        try {
            const response = await tutorsService.updateTutor(currentTutor.id, data);
            if (afterCreating) {
                afterCreating();
            }
            showSuccess('Tutor atualizado com sucesso!');
            setDialogVisible(false);
            setCurrentTutor(null);
        } catch (error) {
            handleError(error, 'Erro ao atualizar tutor');
        } finally {
            setLoadingUpdateTutor(false);
        }
    }

    const getTutor = async (id: number) => {
        setLoadingGetTutor(true);
        try {
            const response = await tutorsService.getTutor(id);
            setCurrentImageUrl(response.foto?.url || "");
            reset({
                nome: response.nome,
                email: response.email,
                telefone: response.telefone,
                endereco: response.endereco,
                cpf: response.cpf ? response.cpf.toString() : '',
            })
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            setLoadingGetTutor(false);
        }
    }

    const updateTutorPhoto = async (photo: File) => {
        if (!currentTutor) {
            return handleError({}, 'Erro ao atualizar foto do tutor');
        }

        try {
            const resp = await tutorsService.updateTutorPhoto(currentTutor.id, photo);
            updateTutorPhotoStore(currentTutor.id, resp);
            showSuccess('Foto do tutor atualizada com sucesso');
        } catch (error) {
            handleError(error, 'Erro ao atualizar foto do tutor');
        }
    }

    const removeTutorPhoto = async () => {
        if (!currentTutor) {
            return handleError({}, 'Erro ao remover foto do tutor');
        }
        setLoadingRemoveTutorPhoto(true);
        console.log(currentTutor.foto?.id)
        try {
            await tutorsService.removeTutorPhoto({ tutorId: currentTutor.id, photoId: currentTutor.foto?.id || 0 });
            setCurrentImageUrl("");
            showSuccess('Foto removida com sucesso');
            updateTutorPhotoStore(currentTutor.id, null);
        } catch (error) {
            handleError(error, 'Erro ao remover foto do tutor');
        } finally {
            setLoadingRemoveTutorPhoto(false);
        }
    }

    const handleSubmitForm = async (data: CreateTutorFormData) => {
        data.cpf = keepOnlyNumbers(data.cpf);
        data.telefone = keepOnlyNumbers(data.telefone);

        if (currentTutor) {
            await updateTutor(data);
        } else {
            await createTutor(data);
        }
    }

    const onImageUpload = (photo: File | null) => {
        if (photo) {
            updateTutorPhoto(photo);
        } else {
            removeTutorPhoto()
        }
    }

    useEffect(() => {
        if (!dialogVisible) {
            setCurrentTutor(null);
            setCurrentImageUrl("");
            resetValues();
        }
    }, [dialogVisible]);

    useEffect(() => {
        if (currentTutor) {
            setDialogVisible(true);
            getTutor(currentTutor.id);
        } else {
            setCurrentImageUrl("");
        }
    }, [currentTutor]);

    return (
        <>
            <Button label="Adicionar" icon="pi pi-plus" onClick={() => setDialogVisible(true)} outlined />
            <DialogForm
                isOpen={dialogVisible}
                onClose={() => setDialogVisible(false)}
                title={currentTutor ? "Editar Tutor" : "Adicionar Tutor"}
            >
                <form
                    onSubmit={handleSubmit(handleSubmitForm)}
                    className="flex flex-col gap-4"
                >
                    {loadingGetTutor && (
                        <div className="mb-4">
                            <ProgressBar mode="indeterminate" style={{ height: '4px' }} />
                            <p className="text-sm text-gray-600 mt-2 text-center">Carregando dados do tutor...</p>
                        </div>
                    )}
                    <div className='h-96 xl:h-auto overflow-y-auto'>
                        <AvatarEdit currentImageUrl={currentImageUrl} onImageUpload={onImageUpload} loading={loadingRemoveTutorPhoto || loadingGetTutor} />
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
                                            disabled={loadingGetTutor}
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
                                                disabled={loadingGetTutor}
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
                                            disabled={loadingGetTutor}
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
                                            disabled={loadingGetTutor}
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
                                            disabled={loadingGetTutor}
                                        />
                                    )}
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* BOTÃO */}
                    <Button
                        type="submit"
                        label={currentTutor ? "Atualizar Tutor" : "Salvar Tutor"}
                        loading={loadingCreateTutor || loadingUpdateTutor}
                        disabled={loadingGetTutor}
                    />
                </form >
            </DialogForm>
        </>
    )
}
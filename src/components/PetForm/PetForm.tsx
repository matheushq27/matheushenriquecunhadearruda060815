import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { useForm, Controller } from 'react-hook-form'
import { FormField } from '../FormField'
import { useEffect, useState } from 'react';
import { DialogForm } from "@/components/DialogForm";
import * as petsService from "@/services/pets/pets.service";
import { useErrorHandler } from "@/hooks/useHandleError";
import { useToast } from '@/contexts/ToastContext';
import { usePetsStore } from "@/stores/pets.store";
import { AvatarEdit } from '../AvatarEdit';
import type { CreatePetProps } from '@/interfaces/services/pets.service';

export interface CreatePetFormData extends CreatePetProps { }

export default function PetForm({ afterCreating }: { afterCreating?: () => void }) {

    const { showSuccess } = useToast();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [loadingCreatePet, setLoadingCreatePet] = useState(false);
    const [loadingRemovePetPhoto, setLoadingRemovePetPhoto] = useState(false);
    const [loadingGetPet, setLoadingGetPet] = useState(false);
    const [loadingUpdatePet, setLoadingUpdatePet] = useState(false);
    const { handleError } = useErrorHandler();
    const { currentPet, setCurrentPet, updatePetPhoto: updatePetPhotoStore } = usePetsStore((state) => state);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreatePetFormData>({
        defaultValues: {
            name: '',
            breed: '',
            age: 0,
        },
    })

    const resetValues = () => {
        reset({
            name: '',
            breed: '',
            age: 0,
        });
        setCurrentPet(null);
        setCurrentImageUrl("");
    };

    const handleErrorForm = (error: unknown) => {
        handleError(error, 'Erro ao salvar pet');
    };

    const createPet = async (data: CreatePetFormData) => {
        setLoadingCreatePet(true);
        try {
            const response = await petsService.createPet(data);
            if (afterCreating) {
                afterCreating();
            }
            showSuccess('Pet criado com sucesso!');
            resetValues();
            setDialogVisible(false);
        } catch (error) {
            handleErrorForm(error);
        } finally {
            setLoadingCreatePet(false);
        }
    };

    const updatePet = async (data: CreatePetFormData) => {
        if (!currentPet) {
            return handleError({}, 'Erro ao atualizar pet');
        }

        setLoadingUpdatePet(true);
        try {
            const response = await petsService.updatePet(currentPet.id, data);
            if (afterCreating) {
                afterCreating();
            }
            showSuccess('Pet atualizado com sucesso!');
            setDialogVisible(false);
            setCurrentPet(null);
        } catch (error) {
            handleError(error, 'Erro ao atualizar pet');
        } finally {
            setLoadingUpdatePet(false);
        }
    };

    const getPet = async (id: number) => {
        setLoadingGetPet(true);
        try {
            const response = await petsService.getPet(id);
            reset({
                name: response.nome || '',
                breed: response.raca || '',
                age: response.idade !== undefined && response.idade !== null ? Number(response.idade) : 0,
            });
            setCurrentImageUrl(response.foto?.url || "");
        } catch (error) {
            handleError(error, 'Erro ao buscar pet');
        } finally {
            setLoadingGetPet(false);
        }
    };

    const handleSubmitForm = (data: CreatePetFormData) => {
        if (currentPet) {
            updatePet(data);
        } else {
            createPet(data);
        }
    };

    useEffect(() => {
        if (!dialogVisible) {
            resetValues();
        }
    }, [dialogVisible]);

    useEffect(() => {
        if (currentPet) {
            setDialogVisible(true);
            getPet(currentPet.id);
        }
    }, [currentPet]);

    return (
        <>
            <Button label="Adicionar" icon="pi pi-plus" onClick={() => setDialogVisible(true)} outlined />
            <DialogForm
                title={currentPet ? "Editar Pet" : "Criar Pet"}
                isOpen={dialogVisible}
                onClose={() => {
                    setDialogVisible(false);
                    resetValues();
                }}
            >
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSubmitForm)}>
                    {currentPet && (
                        <AvatarEdit currentImageUrl={currentPet?.foto?.url || ""} onImageUpload={(e) => console.log(e)} loading={loadingGetPet} />
                    )}
                    <FormField label="Nome" inputId="nome" errorMessage={errors.name}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Nome é obrigatório' }}
                            render={({ field }) => (
                                <InputText
                                    id="name"
                                    placeholder="Ex: Rex"
                                    {...field}
                                    invalid={!!errors.name}
                                />
                            )}
                        />
                    </FormField>
                    <FormField label="Raça" inputId="breed" errorMessage={errors.breed}>
                        <Controller
                            name="breed"
                            control={control}
                            rules={{ required: 'Raça é obrigatória' }}
                            render={({ field }) => (
                                <InputText
                                    id="breed"
                                    placeholder="Ex: Golden Retriever"
                                    {...field}
                                    invalid={!!errors.breed}
                                />
                            )}
                        />
                    </FormField>
                    <FormField label="Idade" inputId="age" errorMessage={errors.age}>
                        <Controller
                            name="age"
                            control={control}
                            rules={{
                                required: 'Idade é obrigatória',
                                min: { value: 0, message: 'Idade deve ser maior ou igual a 0' },
                                max: { value: 30, message: 'Idade deve ser menor ou igual a 30' }
                            }}
                            render={({ field }) => (
                                <InputNumber
                                    id="age"
                                    value={field.value || 0}
                                    onValueChange={(e) => field.onChange(e.value)}
                                    invalid={!!errors.age}
                                    placeholder="Ex: 3"
                                />
                            )}
                        />
                    </FormField>

                    <Button
                        type="submit"
                        label={currentPet ? "Atualizar Pet" : "Salvar Pet"}
                        loading={loadingCreatePet || loadingUpdatePet}
                    />
                </form>
            </DialogForm></>
    );
}
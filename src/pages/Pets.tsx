import * as petsService from "@/services/pets/pets.service";
import { useEffect, useState } from "react";
import { usePetsStore } from "@/stores/pets.store";
import { CardView } from "@/components/CardView";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FormField } from "@/components/FormField";
import PetForm from "@/components/PetForm/PetForm";
import { SectionLoading } from "@/components/SectionLoading";
import { Paginator } from 'primereact/paginator';
import { usePagination } from "@/hooks/usePagination";
import { confirmDialog } from 'primereact/confirmdialog';
import { useErrorHandler } from "@/hooks/useHandleError";
import { useToast } from "@/contexts/ToastContext";
import { NoRecordsFound } from "@/components/NoRecordsFound";
import type { Pet } from "@/interfaces/entities/pets";

export default function Pets() {

    const { showSuccess } = useToast();
    const { handleError } = useErrorHandler();
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [indexDelete, setIndexDelete] = useState<number | null>(null);
    const [loadingPets, setLoadingPets] = useState(true);
    const { pets, setCurrentPet } = usePetsStore((state) => state);
    const { onPageChange, perPageOptions, setPagination, nextPage, total, setNextPage, first, size } = usePagination()

    const getPets = async () => {
        setLoadingPets(true);
        try {
            const response = await petsService.getPets({
                name: name,
                breed: breed,
                page: nextPage,
                size: size,
            });

            usePetsStore.setState({
                pets: response.content,
                pagination: response,
            })

            setPagination({
                page: response.page,
                size: response.size,
                total: response.total,
                pageCount: response.pageCount,
            })
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingPets(false);
        }
    }

    const confirmDelete = (index: number) => {
        const pet = pets[index];

        if (!pet) {
            return
        }

        confirmDialog({
            message: `Tem certeza que deseja excluir ${pet.nome}?`,
            header: 'Zona de perigo',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptLabel: 'Excluir',
            rejectLabel: 'Cancelar',
            accept: () => handleDeletePet(index),
            reject: () => setIndexDelete(null),
        });
    };

    const deletePet = async (id: number) => {
        try {
            await petsService.deletePet(id);
            getPets()
            showSuccess('Pet excluído com sucesso');
        } catch (error) {
            handleError(error, 'Erro ao excluir pet');
        } finally {
            setIndexDelete(null);
        }
    }

    const handleDeletePet = (index: number) => {
        if (!pets[index].id) {
            return handleError({}, 'Erro ao excluir pet');
        }
        setIndexDelete(index);
        deletePet(pets[index].id);
    }

    const handleEditPet = (currentPet: Pet) => {
        setCurrentPet(currentPet)
    }

    const handleFilter = () => {
        setNextPage((prev) => {
            if (prev === 0) {
                getPets();
            }
            return 0;
        });
    }

    useEffect(() => {
        getPets();
    }, [nextPage, size]);

    return (
        <div>
            <h1 className="text-lg mb-5">Pets</h1>
            <div className="flex gap-2 items-end mb-10">
                <FormField label="Nome" inputId="name">
                    <InputText id="name" placeholder="Ex: Rex" value={name} onChange={(e) => setName(e.target.value)} disabled={loadingPets} />
                </FormField>
                <FormField label="Raça" inputId="breed">
                    <InputText id="breed" placeholder="Ex: Golden Retriever" value={breed} onChange={(e) => setBreed(e.target.value)} disabled={loadingPets} />
                </FormField>
                <div>
                    <Button label="Filtrar" icon="pi pi-filter" onClick={handleFilter} className="!mr-2" disabled={loadingPets} />
                    <PetForm afterCreating={getPets} />
                </div>
            </div>
            <SectionLoading loading={loadingPets} />
            {!loadingPets && (
                pets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {pets.map((pet, index) => (
                            <CardView
                                onEdit={() => handleEditPet(pet)}
                                onDelete={() => confirmDelete(index)}
                                loadingDelete={indexDelete === index}
                                key={pet.id}
                                avatar={pet.foto?.url || ''}
                                title={pet.nome}
                                subtitle={`Raça: ${pet.raca}`}
                                content={
                                    <div>
                                        <p className="text-sm text-gray-500">Idade: {pet.idade} ano(s)</p>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <NoRecordsFound />
                )
            )}
            <div className="card">
                <Paginator className="mt-4" first={first} rows={size} totalRecords={total} rowsPerPageOptions={perPageOptions} onPageChange={onPageChange} />
            </div>
        </div>
    );
}
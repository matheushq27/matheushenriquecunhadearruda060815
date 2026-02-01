import * as petsService from "@/services/pets/pets.service";
import { useEffect, useState } from "react";
import { usePetsStore } from "@/stores/pets.store";
import { CardView } from "@/components/CardView";
import PetForm from "@/components/PetForm/PetForm";
import { SectionLoading } from "@/components/SectionLoading";
import { Paginator } from 'primereact/paginator';
import { confirmDialog } from 'primereact/confirmdialog';
import { useErrorHandler } from "@/hooks/useHandleError";
import { useToast } from "@/contexts/ToastContext";
import { NoRecordsFound } from "@/components/NoRecordsFound";
import type { Pet } from "@/interfaces/entities/pets";
import { usePets } from "@/hooks/usePets";
import { PetFilters } from "@/components/PetFilters";

export default function Pets() {

    const { showSuccess } = useToast();
    const { handleError } = useErrorHandler();
    const [indexDelete, setIndexDelete] = useState<number | null>(null);
    const { pets, setCurrentPet } = usePetsStore((state) => state);

    const {
        pets: petsFromHook,
        getPets, name, setName, breed,
        setBreed, loadingPets, onPageChange,
        perPageOptions, nextPage, total,
        setNextPage, first, size
    } = usePets();

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

    useEffect(() => {
        usePetsStore.setState({
            pets: petsFromHook || [],
            pagination: {
                page: nextPage,
                size: size,
                total: total,
                pageCount: first,
                content: petsFromHook || [],
            },
        })
    }, [petsFromHook]);

    return (
        <div>
            <h1 className="text-lg mb-5">Pets</h1>
            <PetFilters
                name={name}
                breed={breed}
                loadingPets={loadingPets}
                handleFilter={handleFilter}
                setName={setName}
                setBreed={setBreed}
                afterFilterButton={<PetForm afterCreating={getPets} />}
            />
            <SectionLoading loading={loadingPets} />
            {!loadingPets && (
                pets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
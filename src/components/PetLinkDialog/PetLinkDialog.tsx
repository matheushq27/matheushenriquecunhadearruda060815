import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { usePets } from '@/hooks/usePets';
import { Avatar } from 'primereact/avatar';
import type { Pet } from '@/interfaces/entities/pets';
import { PetFilters } from '../PetFilters';
import * as tutorsService from "@/services/tutors/tutors.service";
import type { Tutor } from '@/interfaces/entities/tutors';
import { Checkbox } from 'primereact/checkbox';

export default function PetLinkDialog({
    isOpen,
    tutorId,
    onClose,
}: {
    isOpen: boolean;
    tutorId: number;
    onClose: () => void;
}) {

    const [selectedPets, setSelectedPets] = useState<any[]>([]);
    const [selectedPetsIds, setSelectedPetsIds] = useState<number[]>([]);

    const [currentTutor, setCurrentTutor] = useState<Tutor | null>(null)

    const {
        pets,
        getPets,
        total,
        size,
        perPageOptions,
        onPageChange,
        nextPage,
        first,
        loadingPets,
        setName,
        setBreed,
        name,
        breed,
        setLoadingPets
    } = usePets();

    const imageBodyTemplate = (pet: Pet | null) => {
        return <Avatar image={pet?.foto?.url || ''} size="large" shape="circle" />;
    };

    const getTutor = async (id: number) => {
        setLoadingPets(true)
        try {
            const response = await tutorsService.getTutor(id);
            setCurrentTutor(response)
            if (
                response &&
                response.pets &&
                Array.isArray(response.pets) &&
                response.pets.length > 0
            ) {
                setSelectedPets((prev) => {
                    const arr = [...prev]
                    const arrId = arr.map((item) => item.id)

                    if (Array.isArray(response.pets) &&
                        response.pets.length > 0) {
                        response.pets.forEach((item) => {
                            if (!arrId.includes(item.id)) {
                                arr.push(item)
                            }
                        })
                    }

                    return arr
                })
            }
        } catch (error) {
            setCurrentTutor(null)
        } finally {
            setLoadingPets(false)
        }
    }

    const onInit = async () => {
        await getTutor(tutorId)
        await getPets()
    }

    const onSelectAllChange = () => {
        setSelectedPets(pets)
    }

    useEffect(() => {
        if (isOpen) {
            onInit()
        } else {
            setName('')
            setBreed('')
            setSelectedPets([])
        }
    }, [isOpen])

    useEffect(() => {
        getPets();
    }, [nextPage, size]);

    useEffect(() => {
        setSelectedPetsIds(selectedPets.map((item) => item.id))
    }, [selectedPets]);

    return (
        <Dialog
            header="Vincular um Pet"
            visible={isOpen}
            onHide={onClose}
            draggable={false}
            className='h-[80%]'
        >
            <PetFilters
                name={name}
                breed={breed}
                loadingPets={loadingPets}
                handleFilter={getPets}
                setName={setName}
                setBreed={setBreed}
            />

            <DataTable
                value={pets}
                tableStyle={{ minWidth: '50rem' }}
                selection={selectedPets}
                showGridlines stripedRows lazy paginator
                dataKey="id"
                loading={loadingPets}
                totalRecords={total}
                first={first}
                rows={size}
                rowsPerPageOptions={perPageOptions}
                onPage={(e) => onPageChange({
                    page: e.page ?? 0,
                    rows: e.rows ?? 10,
                    first: e.first ?? 0,
                    pageCount: total,
                })}
                onSelectionChange={(e) => setSelectedPets(e.value)}
                onSelectAllChange={(e) => {
                    console.log(e)
                    onSelectAllChange()
                }}
            >
                <Column field="foto" header="Foto"
                    style={{ width: '4rem' }}
                    body={imageBodyTemplate}
                />
                <Column field="nome" header="Name"></Column>
                <Column field="idade" header="Idade"></Column>
                <Column field="raca" header="Raca"></Column>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            </DataTable>
        </Dialog>
    )
}
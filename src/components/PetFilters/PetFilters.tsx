import { InputText } from "primereact/inputtext";
import { FormField } from "../FormField";
import { Button } from "primereact/button";
import type { ReactNode } from "react";

export default function PetFilters({
    name,
    breed,
    loadingPets,
    afterFilterButton,
    handleFilter,
    setName,
    setBreed,
}: {
    name: string;
    breed: string;
    loadingPets: boolean;
    afterFilterButton?: ReactNode
    handleFilter: () => void;
    setName: (name: string) => void;
    setBreed: (breed: string) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end mb-10">
            <FormField label="Nome" inputId="name">
                <InputText id="name" placeholder="Ex: Rex" value={name} onChange={(e) => setName(e.target.value)} disabled={loadingPets} />
            </FormField>
            <FormField label="Raça" inputId="breed">
                <InputText id="breed" placeholder="Ex: Golden Retriever" value={breed} onChange={(e) => setBreed(e.target.value)} disabled={loadingPets} />
            </FormField>
            <div className="flex gap-2">
                <Button label="Filtrar" icon="pi pi-filter" onClick={handleFilter} className="!mr-2" disabled={loadingPets} />
                {afterFilterButton}
            </div>
        </div>
    )
}
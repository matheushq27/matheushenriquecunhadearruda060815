import * as tutorsService from "@/services/tutors/tutors.service";
import { useEffect, useState } from "react";
import { useTutorsStore } from "@/stores/tutors.store";
import { CardView } from "@/components/CardView";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FormField } from "@/components/FormField";
import { TutorForm } from "@/components/TutorForm";
import { maskCPF, maskPhone } from "@/helpers/Masks";
import { SectionLoading } from "@/components/SectionLoading";
import { Paginator } from 'primereact/paginator';
import { usePagination } from "@/hooks/usePagination";

export default function Tutors() {

    const [name, setName] = useState('');
    const [loadingTutors, setLoadingTutors] = useState(true);
    const { tutors } = useTutorsStore((state) => state);
    const { onPageChange, perPageOptions, setPagination, nextPage, total, setNextPage, first, size } = usePagination()

    const getTutors = async () => {
        setLoadingTutors(true);
        try {
            const response = await tutorsService.getTutors({
                name: name,
                page: nextPage,
                size: size,
            });

            useTutorsStore.setState({
                tutors: response.content,
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
            setLoadingTutors(false);
        }
    }

    const handleFilter = () => {
        setNextPage((prev) => {
            if (prev === 0) {
                getTutors();
            }
            return 0;
        });
    }

    useEffect(() => {
        getTutors();
    }, [nextPage, size]);

    return (
        <div>
            <h1 className="text-lg mb-5">Tutores</h1>
            <div className="flex gap-2 items-end mb-10">
                <FormField label="Nome" inputId="name">
                    <InputText id="name" placeholder="Ex: João da Silva" value={name} onChange={(e) => setName(e.target.value)} disabled={loadingTutors} />
                </FormField>
                <div>
                    <Button label="Filtrar" icon="pi pi-filter" onClick={handleFilter} className="!mr-2" disabled={loadingTutors} />
                    <TutorForm afterCreating={getTutors} />
                </div>
            </div>
            <SectionLoading loading={loadingTutors} />
            {!loadingTutors && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tutors.map((tutor) => (
                        <CardView key={tutor.id} avatar={tutor.foto?.url} title={tutor.nome} subtitle={tutor.email} content={
                            <div>
                                <p className="text-sm text-gray-500">CPF: {maskCPF(tutor.cpf)}</p>
                                <p className="text-sm text-gray-500">Endereço: {tutor.endereco}</p>
                                <p className="text-sm text-gray-500">Telefone: {maskPhone(tutor.telefone)}</p>
                            </div>
                        } />
                    ))}
                </div>
            )}
            <div className="card">
                <Paginator className="mt-4" first={first} rows={size} totalRecords={total} rowsPerPageOptions={perPageOptions} onPageChange={onPageChange} />
            </div>
        </div>
    );
}
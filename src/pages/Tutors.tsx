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
import { confirmDialog } from 'primereact/confirmdialog';
import { useErrorHandler } from "@/hooks/useHandleError";
import { useToast } from "@/contexts/ToastContext";
import { NoRecordsFound } from "@/components/NoRecordsFound";
import type { Tutor } from "@/interfaces/entities/tutors";
import PetLinkDialog from "@/components/PetLinkDialog/PetLinkDialog";

export default function Tutors() {

    const { showSuccess } = useToast();
    const { handleError } = useErrorHandler();
    const [name, setName] = useState('');
    const [tutorId, setTutorId] = useState(0);
    const [indexDelete, setIndexDelete] = useState<number | null>(null);
    const [loadingTutors, setLoadingTutors] = useState(true);
    const { tutors, setCurrentTutor } = useTutorsStore((state) => state);
    const [openPetLinkDialog, setOpenPetLinkDialog] = useState(false);
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

    const confirmDelete = (index: number) => {
        const tutor = tutors[index];

        if (!tutor) {
            return
        }

        confirmDialog({
            message: `Tem certeza que deseja excluir ${tutor.nome}?`,
            header: 'Zona de perigo',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptLabel: 'Excluir',
            rejectLabel: 'Cancelar',
            accept: () => handleDeleteTutor(index),
            reject: () => setIndexDelete(null),
        });
    };

    const deleteTutor = async (id: number) => {
        try {
            await tutorsService.deleteTutor(id);
            getTutors()
            showSuccess('Tutor excluído com sucesso');
        } catch (error) {
            handleError(error, 'Erro ao excluir tutor');
        } finally {
            setIndexDelete(null);
        }
    }

    const handleDeleteTutor = (index: number) => {
        if (!tutors[index].id) {
            return handleError({}, 'Erro ao excluir tutor');
        }
        setIndexDelete(index);
        deleteTutor(tutors[index].id);
    }

    const handleEditTutor = (currentTutor: Tutor) => {
        setCurrentTutor(currentTutor)
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
            <div className="flex flex-col sm:flex-row gap-2 sm:items-end mb-10">
                <FormField label="Nome" inputId="name">
                    <InputText id="name" placeholder="Ex: João da Silva" value={name} onChange={(e) => setName(e.target.value)} disabled={loadingTutors} />
                </FormField>
                <div className="flex gap-2">
                    <Button label="Filtrar" icon="pi pi-filter" onClick={handleFilter} className="!mr-2" disabled={loadingTutors} />
                    <TutorForm afterCreating={getTutors} />
                </div>
            </div>
            <SectionLoading loading={loadingTutors} />
            {!loadingTutors && (
                tutors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {tutors.map((tutor, index) => (
                            <CardView
                                showPetLinkButton={true}
                                onEdit={() => handleEditTutor(tutor)}
                                onDelete={() => confirmDelete(index)}
                                onPetLink={() => {
                                    setTutorId(tutor.id || 0);
                                    setOpenPetLinkDialog(true);
                                }}
                                loadingDelete={indexDelete === index}
                                key={tutor.id}
                                avatar={tutor.foto?.url}
                                title={tutor.nome}
                                subtitle={tutor.email}
                                content={
                                    <div>
                                        <p className="text-sm text-gray-500">CPF: {maskCPF(tutor.cpf)}</p>
                                        <p className="text-sm text-gray-500">Endereço: {tutor.endereco}</p>
                                        <p className="text-sm text-gray-500">Telefone: {maskPhone(tutor.telefone)}</p>
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
            <PetLinkDialog tutorId={tutorId} isOpen={openPetLinkDialog} onClose={() => setOpenPetLinkDialog(false)} />
        </div>
    );
}
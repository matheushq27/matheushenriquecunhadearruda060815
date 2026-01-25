import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useEffect } from 'react';

export default function PetLinkDialog({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {


    useEffect(() => {
        if (isOpen) {
            console.log('Abriu')
        } else {
            console.log('Fechou')
        }
    }, [isOpen])

    return (
        <Dialog
            header="Vincular um Pet"
            visible={isOpen}
            onHide={onClose}
            draggable={false}
            className='w-[90%] md:w-[50vw] lg:w-[30vw] xl:w-[20vw]'
        >
            Teste
        </Dialog>
    )
}
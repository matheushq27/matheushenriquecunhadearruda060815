import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import type { ReactNode } from 'react';

const DialogForm = ({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}) => {
    return (
        <Dialog
            header={title}
            visible={isOpen}
            onHide={onClose}
            draggable={false}
            className='w-[90%] md:w-[50vw] lg:w-[30vw] xl:w-[20vw]'
        >
            {children}
            <div className='mt-2'>
                <Button label='Cancelar' onClick={onClose} className='w-full' severity='danger' />
            </div>
        </Dialog>
    );
}

export default DialogForm;
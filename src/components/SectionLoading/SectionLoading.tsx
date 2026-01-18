
import { ProgressSpinner } from 'primereact/progressspinner';

export function SectionLoading({ loading }: { loading: boolean }) {
    return (
        <>
            {loading && (
                <div className="flex justify-center items-center h-96">
                    {loading && <ProgressSpinner />}
                </div>
            )}
        </>
    );
}
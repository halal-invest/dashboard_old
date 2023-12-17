import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { IDeliveryCostType } from '@/types/common';
import CustomInput from '@/components/Common/CustomInput';
import UpdateModalButton from '@/components/Common/(Button)/UpdateModalButton';
import { Button } from 'primereact/button';

interface IProps {
    rowSelected: IDeliveryCostType[];
    setRowSelected: any;
    refreshData: any;
}

const UpdateDeliveryCost = ({ rowSelected, setRowSelected, refreshData }: IProps) => {
    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState<number | null>(null);
    const [areaName, setAreaName] = useState<string>('');
    const [cost, setCost] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);
        try {
            const { data } = await axios.patch('/api/admin/delivery-costs', {
                id,
                areaName,
                cost
            });

            if (data.status) {
                toast.current?.show({
                    severity: 'success',
                    detail: `${data.message}`,
                    life: 3000
                });
                refreshData();
                setDialog(false);
                setIsLoading(false);
                setSubmitted(false);
                setRowSelected([]);
            } else {
                toast.current?.show({
                    severity: 'error',
                    detail: `${data.message}`,
                    life: 3000
                });
                setDialog(false);
                setIsLoading(false);
                setSubmitted(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const confirmUpdate = (rowData: IDeliveryCostType[]) => {
        const { id, areaName, cost } = rowData[0];
        setDialog(true);
        setId(id);
        setAreaName(areaName);
        setCost(cost);
    };

    const handleHide = () => {
        setDialog(false);
        setRowSelected([]);
    };

    return (
        <>
            <Toast ref={toast} />

            <Dialog visible={dialog} style={{ width: '600px' }} header="Update Size" modal className="p-fluid" onHide={handleHide}>
                <form onSubmit={updateHandler}>
                    <div>
                        <div className="formgrid grid col-12">
                            <div className="field col-12 md:col">
                                <CustomInput label="Area Name" value={areaName} setValue={setAreaName} submitted={submitted} required={true} />
                            </div>
                        </div>
                        <div className="formgrid grid col-12">
                            <div className="field col-12 md:col">
                                <CustomInput label="Cost" value={cost} setValue={setCost} submitted={submitted} required={true} />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <Button disabled={!areaName || !cost} type="submit" severity="success" label={isLoading ? 'LOADING...' : 'SUBMIT'} size="small" className="mt-10 p-2" />
                        </div>
                    </div>
                </form>
            </Dialog>

            <UpdateModalButton data={rowSelected} confirmUpdate={confirmUpdate} disabled={rowSelected?.length !== 1} />
        </>
    );
};

export default UpdateDeliveryCost;

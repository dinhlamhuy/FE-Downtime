import React, { useEffect } from 'react';
import AlertDialog2 from "./AlertDialog2";
import { Box, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { get_task_receiving_process } from '../redux/features/product';

const ProgressHistoryDetailTask = ({ isCheck, open, setOpen, machine, user }) => {
    const [t] = useTranslation("global");
    const dispatch = useDispatch();
    const { taskReceivingProcess } = useSelector((state) => state.product);

    useEffect(() => {
        const fetchData = async () => {
            if (isCheck && machine?.id_task) {
                await dispatch(get_task_receiving_process({ id_task: machine.id_task }));
            }
        };
        fetchData();
    }, [dispatch, isCheck, machine]);

    return (
        <>
            {isCheck && (
                <AlertDialog2
                    open={open}
                    setOpen={setOpen}
                    headerModal={t("process_status.status_1_header")}
                >
                    <Box component="div" sx={{ margin: "10px" }}>
                        {taskReceivingProcess?.map((item, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                {/* Dot for timeline */}
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: 'primary.main',
                                        marginRight: 2,
                                    }}
                                />

                                {/* Timeline content */}
                                <Box sx={{ flexGrow: 1, paddingBottom:'5px' }}>
                                    <Typography variant="body1">{item?.no_response_date?.split("T")[1].slice(0, -8) + ' ' + item?.no_response_date?.split("T")[0]}
                                    </Typography>
                                    <Typography variant="body2">{item.Status==='NoRep' && item.CB + ' Giao phó cho ' + item.Tho}
                                    </Typography>
                                    <Typography sx={{ paddingLeft: '15px' }} variant="body2">Thợ: {item.Tho}  {item.Status} task </Typography>
                                    {/* <Typography variant="body2">Status: {item.Status}</Typography> */}
                                </Box>

                                {/* Vertical line (except for the last item) */}
                                {index < taskReceivingProcess.length - 1 && (
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{
                                            marginLeft: 2,
                                            height: '50px',
                                            backgroundColor: 'grey.300',
                                        }}
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>
                </AlertDialog2>
            )}
        </>
    );
}

export default ProgressHistoryDetailTask;

import React, { useEffect } from "react";
import AlertDialog2 from "./AlertDialog2";
import { Box, Typography, Divider, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { get_task_receiving_process } from "../redux/features/product";

const ProgressHistoryDetailTask = ({
  isCheck,
  open,
  setOpen,
  machine,
  user,
}) => {
  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const { taskReceivingProcess } = useSelector((state) => state.product);
console.log(

    machine?.id_task
    )
  useEffect(() => {
    const fetchData = async () => {
      if (isCheck && machine?.id_task) {
        await dispatch(
          get_task_receiving_process({ id_task: machine.id_task })
        );
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
                <Box sx={{ paddingBottom: "10px" }}>
                  <Chip
                    size="small"
                    sx={
                      item.Status === "NoRep"
                        ? { background: "gray", color: "white" }
                        : { background: "red", color: "white" }
                    }
                    label={
                      item?.no_response_date?.split("T")[1].slice(0, -8) +
                      " " +
                      item?.no_response_date?.split("T")[0]
                    }
                  ></Chip>
                  {item.Status==='NoRep' ? (
                  <Typography variant="body2" sx={{ paddingLeft: "15px" }}>
                  
                    {item.id_user_mechanic +
                      "-" +
                      item.Tho +
                      t('process_status.no_response') +
                      "(" +
                      item.id_user_owner +
                      "-" +
                      item.CB +
                      ")"}
                  </Typography>
                  ): (
                  <Typography variant="body2" sx={{ paddingLeft: "15px" }}>
             
                    {item.id_user_mechanic + "-" + item.Tho +  t('process_status.reject')}
                  </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </AlertDialog2>
      )}
    </>
  );
};

export default ProgressHistoryDetailTask;

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { get_all_machine } from "../redux/features/machine";
import { Autocomplete } from "@mui/material";
import { useTranslation } from "react-i18next";

const FormScanner = (props) => {
  const { scanner, setScannerResult } = props;
  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const { machineList, loading } = useSelector((state) => state.machine);
  
  const { t } = useTranslation("global"); 

  useEffect(() => {
    const fetchData = async (factory) => {
      await dispatch(get_all_machine({ factory }));
    };
    const userFactory = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).factory : '';
    fetchData(userFactory);
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedMachineId) {
      setError(true);
      return;
    }
    setScannerResult(selectedMachineId);
    setError(false);
  };

  return (
    <>
      <Typography
        sx={{ fontSize: "14px", fontWeight: "500", marginBottom: "10px" }}
      >
        {scanner}
      </Typography>
      <Box
        component="div"
        sx={{
          border: '1px solid silver',
          padding: '16px',
          width: '100%',
          height: '281px'
        }}
        id={`render-2`}
      >
        {loading ? (
          <Typography>{t("info_machine_damage.loading_machine")}</Typography>
        ) : (
          <>
            {error && (
              <Typography color="error" sx={{ marginBottom: "10px" }}>
                {t("info_machine_damage.validate_id_machine")}
              </Typography>
            )}
            {!loading && (
              <form onSubmit={handleSubmit}>
                <Autocomplete
                  freeSolo
                  value={selectedMachineId}
                  onChange={(event, newValue) => {
                    setSelectedMachineId(newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setSelectedMachineId(newInputValue);
                  }}
                  options={machineList ?  machineList.map((machine) => machine.ID_Code):[]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("info_machine_damage.choose_machine")}
                      variant="outlined"
                      placeholder={t("info_machine_damage.choose_machine")}
                      fullWidth
                    />
                  )}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px'
                  }}
                >
                  <Button type="submit" variant="contained" color="primary">
                    {t("scanner.submit")}
                  </Button>
                </Box>
              </form>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default FormScanner;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { get_all_machine } from "../redux/features/machine";
import { Autocomplete } from "@mui/material";
import { useTranslation } from "react-i18next";
import { get_all_floor, get_all_lean, setErrorCode } from "../redux/features/electric";
import { set } from "date-fns";

const FormRelocateScanner = (props) => {
  const { scanner, setScannerResult } = props;
  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [selectedFloorId, setSelectedFloorId] = useState("");
  const [selectedLeanId, setSelectedLeanId] = useState("");
  const [error, setError] = useState(false);
  const userFactory = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).factory
  : "";
  const dispatch = useDispatch();
  // const {  loading } = useSelector((state) => state.machine);
  const { getAllLean, loading, getAllFloor } = useSelector((state) => state.electric);

  const { t } = useTranslation("global");
  useEffect(() => {
    dispatch(setErrorCode(null, ""));
  }, []);
  useEffect(() => {
    const fetchData = async (factory) => {
      await dispatch(get_all_floor({ factory }));
      await  dispatch(get_all_lean({ factory:userFactory , floor: '' }));
    };

    fetchData(userFactory);
  }, [dispatch]);
  // useEffect(() => {

  //   if (selectedFloorId) {
  //     dispatch(get_all_lean({ factory:userFactory , floor: '' }));
  //   }
  // }, [selectedFloorId, dispatch]);


  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedLeanId || !selectedFloorId) {
      setError(true);
      return;
    }
    setScannerResult(selectedFloorId+'/'+selectedLeanId);
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
          border: "1px solid silver",
          padding: "16px",
          width: "100%",
          height: "281px",
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
                {/* <Autocomplete
                  freeSolo
                  value={selectedMachineId}
                  onChange={(event, newValue) => {
                    setSelectedMachineId(newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setSelectedMachineId(newInputValue);
                  }}
                  // options={getAllLean ?  getAllLean.map((machine) => machine.ID_Code):[]}
                  options={
                    getAllLean
                      ? [...new Set(getAllLean.map((Lean) => Lean.lean))]
                      : []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("info_machine_damage.choose_machine")}
                      variant="outlined"
                      placeholder={t("info_machine_damage.choose_machine")}
                      fullWidth
                    />
                  )}
                /> */}

                <Select
                  value={selectedFloorId}
                  onChange={(event) => {
                    setSelectedFloorId(event.target.value);
                    setSelectedLeanId("");
                  }}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>{t("employee_list.choose_floor")}</em>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem disabled value="">
                    <em>{t("employee_list.choose_floor")}</em>
                  </MenuItem>
                  {getAllFloor
                    ? [...new Set(getAllFloor.map((AllFloor) => AllFloor.floor))].map(
                        (floor) => (
                          <MenuItem key={floor} value={floor}>
                            {floor}
                          </MenuItem>
                        )
                      )
                    : []}
                </Select>

                <Select
                  value={selectedLeanId}
                  onChange={(event) => {
                    setSelectedLeanId(event.target.value);
                  }}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>{t("work_list.select_line")}</em>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem disabled value="">
                    <em>{t("work_list.select_line")}</em>
                  </MenuItem>
                  {getAllLean
                    ? [...new Set(getAllLean.filter((Lean) => Lean.floor === selectedFloorId).map((Lean) => Lean.lean ))].map(
                        (lean) => (
                          <MenuItem key={lean} value={lean}>
                            {lean}
                          </MenuItem>
                        )
                      )
                    : []}
                </Select>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
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

export default FormRelocateScanner;

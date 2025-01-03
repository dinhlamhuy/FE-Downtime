import { Box, Button } from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import { useTranslation } from "react-i18next";
import { use } from "react";
import { useNavigate } from "react-router-dom";


const HomeProPageScreen = () => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  return (
    <Box component="div">
      {/* <BreadCrumb breadCrumb={t("info_machine_damage.info_machine_damage")} /> */}
      <Box
        component="div"
        sx={{
          display: "flex",
          margin: "0 auto",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "30px",
          height: "50vh",
          border: "2px solid rgb(91, 143, 164)",
          borderRadius: "20px",
          padding: "10px",
          maxWidth: "500px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ padding: "10px 20px", fontSize: "1.1rem" }}
          onClick={() => {
            navigate("/product/info-machine");
          }}
        >
          {t("info_machine_damage.info_machine_damage")}
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ padding: "10px 20px", fontSize: "1.1rem" }}
          onClick={() => {
            navigate("/product/relocate-machine");
          }}
        >
          {t("sidebar.relocate_the_machine")}
        </Button>
      </Box>
    </Box>
  );
};
export default HomeProPageScreen;

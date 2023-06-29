import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AIIcon from "../images/AIIcon.png"; // 이미지 import
import SeaTurtleIcon from "../images/SeaTurtleIcon.png"; // 이미지 import

const QnA = ({ question, answer, borderStrength, borderBottomStrength }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "810px",
        // height: "50px",
        border: `${borderStrength} solid black`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "0px",
          alignItems: "center",
          backgroundColor: "#E0EBF9",
          width: "810px",
          height: "50px",
          borderTop: "0.01px solid black",
          borderLeft: "0.01px solid black",
          borderRight: "0.01px solid black",
        }}
      >
        <img
          src={SeaTurtleIcon}
          alt="SeaTurtle"
          width="25"
          height="25"
          style={{ marginLeft: "10px", marginRight: "10px" }}
        />
        <Typography>{question}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "0px",
          alignItems: "center",
          backgroundColor: "white",
          width: "810px",
          height: "50px",
          borderTop: "0.01px solid black",
          borderLeft: "0.01px solid black",
          borderRight: "0.01px solid black",
          borderBottom: `${borderBottomStrength} solid black`,
        }}
      >
        <img
          src={AIIcon}
          alt="AI"
          width="25"
          height="25"
          style={{ marginLeft: "10px", marginRight: "10px" }}
        />
        <Typography>{answer}</Typography>
      </Box>
    </Box>
  );
};

export default QnA;

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
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "0px",
          alignItems: "center",
          backgroundColor: "#F3F3F3",
          width: "792px",
          minheight: "100px",
          padding: "12.5px",
          overflowWrap: "break-word",
          wordBreak: "keep-all",
          borderTop: "0.01px solid black",
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
          width: "793px",
          minheight: "100px",
          padding: "12.5px",
          borderTop: "0.01px solid black",
          overflowWrap: "break-word",
          wordBreak: "keep-all",
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

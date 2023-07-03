import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AiIcon from "../images/AiIcon.png"; // 이미지 import
import UserIcon from "../images/UserIcon.png"; // 이미지 import

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
          src={UserIcon}
          alt="SeaTurtle"
          width="26"
          height="27"
          style={{ marginLeft: "10px", marginRight: "10px", transform: "rotate(11deg)" }}
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
          src={AiIcon}
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

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

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
        <QuestionAnswerIcon />
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
        <QuestionAnswerIcon />
        <Typography>{answer}</Typography>
      </Box>
    </Box>
  );
};

export default QnA;

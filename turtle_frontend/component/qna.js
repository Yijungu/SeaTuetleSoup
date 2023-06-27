import React from "react";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const useStyles = makeStyles({
  root: {
    margin: "20px 0",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  line: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0",
  },
  icon: {
    marginRight: "10px",
  },
});

const QnA = ({ question, answer }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.line}>
        <QuestionAnswerIcon className={classes.icon} />
        <Typography>{question}</Typography>
      </div>
      <div className={classes.line}>
        <QuestionAnswerIcon className={classes.icon} />
        <Typography>{answer}</Typography>
      </div>
    </div>
  );
};

export default QnA;

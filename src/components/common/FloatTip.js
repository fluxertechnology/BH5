import styled from "styled-components";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { colors } from "@/lib/constants";
const Title = styled((props) => <DialogTitle {...props} />)(({ theme }) => ({
  "&.MuiDialogTitle-root": {
    fontWeight: "900",
    textAlign: "center",
    fontSize: "1.7rem",
    paddingBottom: 0,
  },
}));

const Text = styled((props) => <DialogContentText {...props} />)(
  ({ theme }) => ({
    "&.MuiDialogContentText-root": {
      color: colors.text_grey,
      textAlign: "center",
      fontSize: "1.5rem",
      paddingBottom: 0,
    },
  })
);

const ButtonArea = styled((props) => <DialogActions {...props} />)(
  ({ theme }) => ({
    "&.MuiDialogActions-root": {
      color: colors.text_grey,
      alignSelf: "center",
      display: "flex",
      flexDirection: "column",
      width: "70%",
      padding: 0,
    },
  })
);

const MuiButton = styled((props) => <Button {...props} />)(({ preset }) => ({
  "&.MuiButton-root": {
    color: preset ? "#fff" : colors.text_light_grey,
    borderRadius: 35,
    backgroundColor: preset && colors.back_dark_pink,
    width: "100%",
    margin: "0px 15px 15px",
    fontSize: "1.3rem",
  },
}));

/**
 * @description received {Title,Content,Button_t,Button_b}
 *
 * @param { object } Tips
 */
const FloatTip = ({ status, setStatus, Tips }) => {
  const handleClose = () => {
    setStatus(false);
  };
  const handleBackHistory = () => {
    window.history.back();
  };
  return (
    <div>
      <Dialog
        PaperProps={{ sx: { width: "400px" } }}
        open={status}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Title id="alert-dialog-title">{Tips.Title}</Title>
        <DialogContent>
          <Text id="alert-dialog-description">{Tips.Content}</Text>
        </DialogContent>
        <ButtonArea>
          <MuiButton onClick={handleClose} preset>
            {Tips.Button_t}
          </MuiButton>
          <MuiButton onClick={handleBackHistory}>{Tips.Button_b}</MuiButton>
        </ButtonArea>
      </Dialog>
    </div>
  );
};

export default FloatTip;

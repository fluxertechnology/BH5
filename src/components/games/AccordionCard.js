import { useState } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import Collapse from "@mui/material/Collapse";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@/components/games/Card";

const StyledAccordionSummary = styled((props) => (
  <AccordionSummary {...props} />
))({
  "&.Mui-expanded": {
    // maxHeight: "40px!important",
    // minHeight: "30px!important",
    // padding: 0,
  },
});
const StyleAccordion = styled((props) => (
  <Accordion {...props} disableGutters />
))({
  "&.MuiAccordion-root": {
    boxShadow: "none!important",
    backgroundColor: "transparent",
  },
});
function SimpleAccordion(props) {
  const { img, title, description, datas, url } = props;
  const [expanded, setExpanded] = useState(true);
  const handleClick = () => {
    setExpanded((pre) => !pre);
  };
  function onClickImg() {
    window.open(url);
  }
  return (
    <AccordionElement>
      <div className="top_container mb-2 cursor">
        <img
          className="top_container_icon_img"
          src={img}
          alt="fireIcon"
          title="fireIcon"
          onClick={onClickImg}
        />
        <StyleAccordion square className="mt-0" onClick={handleClick}>
          <StyledAccordionSummary
            className="mb-0 pb-0 px-2"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              className="top_container_title"
              sx={{ fontWeight: 600 }}
            >
              {title}
            </Typography>
          </StyledAccordionSummary>
          {description && (
            <AccordionDetails className="pt-0 pl-2">
              <Typography className="top_container_description ">
                {description}
              </Typography>
            </AccordionDetails>
          )}
        </StyleAccordion>
      </div>
      <Collapse orientation="vertical" in={expanded}>
        <Grid container direction="row" alignItems="start" spacing={2}>
          {expanded
            ? datas.map((data) => (
                <Grid item md={6} xs={6} key={data.title}>
                  <Card horizontal data={data} key={data.name} />
                </Grid>
              ))
            : ""}
        </Grid>
      </Collapse>
    </AccordionElement>
  );
}
export default SimpleAccordion;

export const AccordionElement = styled.div`
  /*  */
  padding: 1%;

  .top_container {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    max-width: 100%;

    &_icon {
      &_img {
        border-radius: 8px;
        width: 100%;
        vertical-align: middle;
        transition: 0.2s;
      }
    }

    &_title {
      font-size: 24px;
    }

    &_description {
      color: gray;
      font-size: 16px;
    }
  }
`;

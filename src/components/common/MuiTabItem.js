import { styled } from "@mui/material/styles";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { colors } from "@/lib/constants";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  console.log('children',children,index)
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  height: "20px!important",
  "& .MuiTabs-scroller": {
    overflow: "scroll!important",
  },
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    bottom: "5px",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "20px",
    height: "2.5px",
    margin: "0 25%",
    borderRadius: "15%",
    background: colors.dark_pink,
  },
});

const AntTab = styled((props) => <Tab disableRipple {...Object.fromEntries(Object.entries(props))} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    padding: "12px 8px",
    fontSize: 12 + "px",
    alignSelf: "center",
    color: colors.text_grey,
    transition: "0.3s",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12 + "px",
    },
    "&:hover": {
      color: colors.text_grey,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: colors.dark_pink,
      fontWeight: theme.typography.fontWeightMedium,
    },
  })
);

export { StyledTabs, AntTab, TabPanel };
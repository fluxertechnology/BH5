import Radio from "@mui/material/Radio";
import { colors } from "@/lib/constants";
export default function LanguageItem({ data, controlProps, handleClick }) {
    
  return (
    <div
      className="container fw-s cursor-pointer "
      onClick={() => handleClick(data?.lang)}
    >
      <div className="left">{data?.name}</div>
      <div className="right">
        <Radio
          {...controlProps(data?.lang)}
          size="medium"
          sx={{
            color: colors.text_light_grey,
            "&.Mui-checked": {
              color: colors.dark_pink,
            },
          }}
        />
      </div>
    </div>
  );
}

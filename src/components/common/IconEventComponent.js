import { useState, useCallback, useEffect } from "react";
let effectTime;
const IconEventComponent = ({
  nor,
  hover,
  press,
  onClick,
  children,
  imgClassName,
  className,
  pressed = false,
  specialEffect = false,
}) => {
  const [pic, setPic] = useState(pressed ? press : nor);
  useEffect(() => {
    if (pressed) {
      setPic(press);
    } else {
      setPic(nor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressed]);
  const handleEvent = useCallback(
    (type) => {
      switch (type) {
        case "nor":
          if (!pressed) {
            clearTimeout(effectTime);
            if (specialEffect)
              return (effectTime = setTimeout(() => setPic(nor), 100));
            setPic(nor);
          }
          break;
        case "hover":
          if (!pressed) {
            clearTimeout(effectTime);
            if (specialEffect)
              return (effectTime = setTimeout(() => setPic(hover), 100));
            setPic(hover);
          }
          break;
        case "press":
          setPic(press);
          break;
        default:
          setPic(nor);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pressed]
  );
  return (
    <div
      className={className}
      onMouseEnter={() => handleEvent("hover")}
      onMouseLeave={() => handleEvent("nor")}
      onClick={() => {
        onClick();
        handleEvent("nor");
      }}
    >
      <img src={pic} alt={pic} className={imgClassName} />
      {children}
    </div>
  );
};

export default IconEventComponent;

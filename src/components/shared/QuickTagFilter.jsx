import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { cl } from "../../utils/misc";

const colors = ["red", "yellow", "green", "blue", "gray"];

export const QuickTagFilter = ({ tag, setTag }) => {
  return (
    <div className="w-[50px] h-[50px] relative">
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        icon={
          <span
            className={cl(
              "w-full h-full rounded-full",
              { "bg-gray-200": tag === "all" },
              { [`bg-${tag}-500`]: tag !== "all" }
            )}></span>
        }
        direction="down"
        sx={{ position: "absolute", top: 0, left: 0 }}
        disableRipple>
        <SpeedDialAction
          disableRipple
          onClick={() => setTag("all")}
          disabled={tag === "all"}
          icon={
            <span
              className={`w-full h-full rounded-full bg-gray-100 opacity-4 text-lg text-gray-300 flex items-center justify-center`}>
              <i className="fas fa-minus"></i>
            </span>
          }
        />

        {colors.map((color) => (
          <SpeedDialAction
            disableRipple
            key={color}
            // tooltipTitle={color}
            onClick={() => setTag(tag === color ? "all" : color)}
            icon={
              <span
                key={color}
                className={`w-full h-full rounded-full bg-${color}-500 opacity-40 `}></span>
            }
          />
        ))}
      </SpeedDial>
    </div>
  );

  // export default function BasicSpeedDial() {
  //   return (
  //     <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>

  //     </Box>
  //   );
  // }
};

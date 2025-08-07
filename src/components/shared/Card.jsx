import { LinearProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar1Indeterminate": {
    backgroundColor: "#FBBF24",
  },
  "& .MuiLinearProgress-bar2Indeterminate": {
    backgroundColor: "#10B981",
  },
});

export const Card = ({
  loading = false,
  backgroundColor = "bg-white",
  boxShadow = `0px 2px 5px rgba(0, 0, 0, .2), inset 0 -1px 10px 0 rgba(0, 0, 0, 0.05)`,
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={`p-4 ${backgroundColor} transition duration-300 rounded-lg z-10 relative overflow-hidden ${className}`}
      style={{ boxShadow: boxShadow }}
      {...props}>
      {loading && (
        <div className="absolute top-0 left-0 right-0 overflow-hidden rounded-t-lg">
          <StyledLinearProgress variant="indeterminate" sx={{ backgroundColor: "#E5E7EB" }} />
        </div>
      )}

      {children}
    </div>
  );
};

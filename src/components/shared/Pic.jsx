import { imgSrc } from "../../utils/constants";
import { Jdenticon } from "./Jdenticon";

export const Pic = ({
  image = undefined,
  radius = 5,
  fallback = "user",
  className = "",
  transformations = undefined,
  jdenticonValue = undefined,
  ...rest
}) => {
  const w = radius * 2;

  if (jdenticonValue) {
    return (
      <div className={`${className}`}>
        <Jdenticon
          value={jdenticonValue}
          width={w * 4}
          style={{ width: w * 4, height: w * 4 }}
          className={`rounded-full overflow-hidden bg-gray-100`}
        />
      </div>
    );
  }

  if (!image) {
    return (
      <div
        className={`w-${w} h-${w} rounded-full text-gray-700 bg-gray-100 justify-center items-center inline-flex ${className}`}>
        <i className={`fas fa-${fallback}`}></i>
      </div>
    );
  }
  return (
    <img
      className={`w-${w} h-${w} rounded-full ${className}`}
      src={imgSrc(image, "w_40,h_40")}
      {...rest}
    />
  );
};

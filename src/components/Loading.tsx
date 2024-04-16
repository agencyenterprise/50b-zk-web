const LoadingSpinner = ({
  size,
  innerSize,
}: {
  size?: string;
  innerSize?: string;
}) => {
  return (
    <div
      className={`flex justify-center items-center
      ${size ? `h-${size}` : "h-screen w-screen"}`}
    >
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-500 ${
          innerSize ? `h-${innerSize} w-${innerSize}` : "h-16 w-16"
        } `}
      ></div>
    </div>
  );
};

export default LoadingSpinner;

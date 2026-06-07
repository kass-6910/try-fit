import "./Logo.css";

const SIZES = {
  sm: 36,
  md: 48,
  lg: 80,
  xl: 140,
};

function Logo({ size = "md", className = "" }) {
  const px = SIZES[size] ?? SIZES.md;

  return (
    <img
      src="/logo.png"
      alt="Try Fit"
      width={px}
      height={px}
      className={`logo${className ? ` ${className}` : ""}`}
      style={{ "--logo-size": `${px}px` }}
    />
  );
}

export default Logo;

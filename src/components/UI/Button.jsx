import "./Button.css";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) => {
  const classNames = [
    "game-button",
    `game-button--${variant}`,
    `game-button--${size}`,
    loading ? "game-button--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span
          className="game-button__loader"
          aria-hidden="true"
        />
      ) : null}

      <span className="game-button__content">
        {children}
      </span>
    </button>
  );
};

export default Button;
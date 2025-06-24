import './btn.css';

const Button = ({ children, onClick, type = '', className = '', status, ...props }) => {
  const btncolor =
    status === 'primary-btn'
      ? 'p-btn'
      : status === 'secondary-btn'
        ? 's-btn'
        : status === 'tertiary-btn'
          ? 't-btn'
          : 'btn';

  return (
    <button
      type={type}
      className={`btn ${btncolor} ${className}`}
      onClick={() => {
        if (onClick) onClick();
      }}
      {...props}>
      {children}
    </button>
  );
};

export default Button;

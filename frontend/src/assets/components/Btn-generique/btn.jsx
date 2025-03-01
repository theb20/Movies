import React from "react";

const Button = ({ children, onClick, type = "button", className = "", ...props }) => {
  return (
    <button 
      type={type} 
      className={`btn ${className}`} 
      onClick={(e) => {
        e.preventDefault(); 
        if (onClick) onClick();
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

import { useState } from "react";
import './Input.css'

const CustomInput = ({ label, type, placeholder, value, onChange, error, icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const formControl = "form-control rounded-0 border-0";

  return (
    <div className="mb-3">
      <label className="form-label text-light ">{label ? label : "Aucun label"}</label>

      <div className="input-group">
        {icon && <span className="input-group-text">{icon}</span>}
        <input
          type={type}
          className={`${formControl} ${error ? "is-invalid" : ""} ${isFocused ? "border-primary shadow-sm" : ""}`}
          placeholder={placeholder ? placeholder : "Aucun placeholder"}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {error && <div className="invalid-feedback">{error ? error : "Aucun message d'erreur"}</div>}
    </div>
  );
};

export default CustomInput;

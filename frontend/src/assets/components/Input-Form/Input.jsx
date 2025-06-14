import { useState } from 'react';
import './Input.css';

const Input = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
  classinput = '',
  classlabel = '',
  classcontainer = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const formControl = 'form-control rounded';

  return (
    <div className={`${classcontainer} `}>
      <label className={`form-label text-light m-0 ${classlabel}`}>
        {label ? label : 'Aucun label'}
      </label>
      <input
        type={type}
        name={name}
        className={`textCustom ${formControl} ${classinput} ${error ? 'is-invalid' : ''} ${isFocused ? 'border-danger shadow-sm' : ''}`}
        placeholder={placeholder ? placeholder : 'Aucun placeholder'}
        // la prop 'value' que si l'input n'est PAS de type 'file'
        {...(type !== 'file' && { value })}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required
      />
      {error && <div className="invalid-feedback">{error ? error : "Aucun message d'erreur"}</div>}
    </div>
  );
};

export default Input;

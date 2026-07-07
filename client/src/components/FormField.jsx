export default function FormField({ label, name, type = 'text', value, onChange, error, placeholder, required, options, rows, step, min, max, children }) {
  const id = `field-${name}`;

  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="label">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>}
      {type === 'select' ? (
        <select id={id} name={name} value={value || ''} onChange={onChange} className={`input ${error ? 'border-red-300 focus:ring-red-400' : ''}`}>
          <option value="">Seleccionar...</option>
          {options?.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} name={name} value={value || ''} onChange={onChange} placeholder={placeholder} rows={rows || 3} className={`input ${error ? 'border-red-300 focus:ring-red-400' : ''}`} />
      ) : (
        <input id={id} name={name} type={type} value={value || ''} onChange={onChange} placeholder={placeholder} step={step} min={min} max={max} className={`input ${error ? 'border-red-300 focus:ring-red-400' : ''}`} />
      )}
      {children}
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

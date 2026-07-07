import { useState, useCallback } from 'react';

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }, [errors]);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback((newValues) => {
    setValues(newValues || initialValues);
    setErrors({});
  }, [initialValues]);

  const validate = useCallback((rules) => {
    const newErrors = {};
    for (const [field, rule] of Object.entries(rules)) {
      const val = values[field];
      if (rule.required && (!val || String(val).trim() === '')) {
        newErrors[field] = rule.message || 'Este campo es obligatorio';
      } else if (rule.minLength && String(val).length < rule.minLength) {
        newErrors[field] = rule.message || `Mínimo ${rule.minLength} caracteres`;
      } else if (rule.pattern && !rule.pattern.test(String(val))) {
        newErrors[field] = rule.message || 'Formato inválido';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return { values, errors, handleChange, setValue, reset, validate, setValues };
}

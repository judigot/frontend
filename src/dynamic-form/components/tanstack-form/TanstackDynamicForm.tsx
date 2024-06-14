import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { IFormConfig, useDynamicForm } from '../../hooks/useDynamicForm';
import { formProps } from '@/dynamic-form/formStructure';

function TanstackDynamicForm() {
  const { formData, setFormData } = useDynamicForm(formProps);

  const { Field } = useForm({
    defaultValues: formData,
  });

  return (
    <div>
      <h1>Zod Form Example</h1>
      <form
        onSubmit={(e) => {
          formProps.onSubmit?.(e, formData);
        }}
      >
        {formProps.fields.map((fieldConfig: IFormConfig) => (
          <div key={fieldConfig.name}>
            <Field
              name={fieldConfig.name}
              validatorAdapter={zodValidator}
              validators={{
                onChange: fieldConfig.validators.onChange,
                onChangeAsyncDebounceMs:
                  fieldConfig.validators.onChangeAsyncDebounceMs,
                onChangeAsync: fieldConfig.validators.onChangeAsync
                  ? fieldConfig.validators.onChangeAsync(
                      fieldConfig.validators.onChangeAsyncDebounceMs ?? 1000,
                    )
                  : undefined,
              }}
            >
              {(field) => (
                <>
                  <label htmlFor={field.name}>{fieldConfig.label}:</label>
                  {fieldConfig.type === 'text' && (
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      placeholder={fieldConfig.placeholder}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setFormData((prevData) => ({
                          ...prevData,
                          [field.name]: e.target.value,
                        }));
                      }}
                    />
                  )}
                  {fieldConfig.type === 'textarea' && (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder={fieldConfig.placeholder}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setFormData((prevData) => ({
                          ...prevData,
                          [field.name]: e.target.value,
                        }));
                      }}
                    />
                  )}
                  {fieldConfig.type === 'select' && (
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setFormData((prevData) => ({
                          ...prevData,
                          [field.name]: e.target.value,
                        }));
                      }}
                    >
                      {fieldConfig.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {fieldConfig.type === 'radio' &&
                    fieldConfig.options?.map((option) => (
                      <div key={option.value}>
                        <input
                          id={`${field.name}-${option.value}`}
                          name={field.name}
                          type="radio"
                          value={option.value}
                          checked={field.state.value === option.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setFormData((prevData) => ({
                              ...prevData,
                              [field.name]: e.target.value,
                            }));
                          }}
                        />
                        <label htmlFor={`${field.name}-${option.value}`}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  <span className="error">
                    {field.state.meta.touchedErrors}
                  </span>
                </>
              )}
            </Field>
          </div>
        ))}
        {formProps.onSubmit && <button type="submit">Submit</button>}
      </form>
    </div>
  );
}

export default TanstackDynamicForm;

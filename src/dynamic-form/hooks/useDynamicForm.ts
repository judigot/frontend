import { z } from 'zod';
import { useEffect, useState } from 'react';

export interface IFormConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio';
  defaultValue: string;
  placeholder: string;
  options?: { label: string; value: string }[]; // for select and radio fields
  validators: {
    onChange?: z.ZodString;
    onChangeAsyncDebounceMs?: number;
    onChangeAsync?: (
      debounceMs: number,
    ) => z.ZodEffects<z.ZodString, string, string>;
  };
}

export interface IFormProps {
  cacheValues: boolean;
  onSubmit?: (
    e: React.FormEvent<HTMLFormElement>,
    data: IFormInputValues,
  ) => void;
  fields: IFormConfig[];
}

export type IFormInputValues = Record<string, string>;

export interface IDynamicForm {
  formData: IFormInputValues;
  setFormData: React.Dispatch<React.SetStateAction<IFormInputValues>>;
}

export const createAsyncValidator = (debounceMs: number) =>
  z.string().refine(
    async (value) => {
      await new Promise((resolve) => setTimeout(resolve, debounceMs));
      return !value.includes('error');
    },
    {
      message: "No 'error' allowed",
    },
  );

// export const formProps: IFormProps = {
//   cacheValues: true,
//   onSubmit: (e, _formData) => {
//     e.preventDefault();
//     // alert(JSON.stringify(data, null, 4));
//   },
//   fields: [
//     {
//       name: 'firstName',
//       label: 'First Name',
//       type: 'text',
//       defaultValue: '',
//       placeholder: 'Enter your first name',
//       validators: {
//         onChange: z.string().min(3, 'First name must be at least 3 characters'),
//         onChangeAsyncDebounceMs: 1000,
//         onChangeAsync: createAsyncValidator,
//       },
//     },
//     {
//       name: 'lastName',
//       label: 'Last Name',
//       type: 'text',
//       defaultValue: '',
//       placeholder: 'Enter your last name',
//       validators: {
//         onChange: z.string().min(3, 'Last name must be at least 3 characters'),
//         onChangeAsyncDebounceMs: 1000,
//         onChangeAsync: createAsyncValidator,
//       },
//     },
//     {
//       name: 'description',
//       label: 'Description',
//       type: 'textarea',
//       defaultValue: '',
//       placeholder: 'Enter a description',
//       validators: {
//         onChange: z
//           .string()
//           .min(3, 'Description must be at least 3 characters'),
//         onChangeAsyncDebounceMs: 1000,
//         onChangeAsync: createAsyncValidator,
//       },
//     },
//     {
//       name: 'gender',
//       label: 'Gender',
//       type: 'select',
//       defaultValue: '',
//       placeholder: '',
//       options: [
//         { label: 'Other', value: '' },
//         { label: 'Male', value: 'male' },
//         { label: 'Female', value: 'female' },
//       ],
//       validators: {
//         onChange: z.string(),
//         onChangeAsyncDebounceMs: 1000,
//         onChangeAsync: createAsyncValidator,
//       },
//     },
//     {
//       name: 'newsletter',
//       label: 'Newsletter',
//       type: 'radio',
//       defaultValue: '',
//       placeholder: '',
//       options: [
//         { label: 'Yes', value: 'yes' },
//         { label: 'No', value: 'no' },
//       ],
//       validators: {
//         onChange: z.string(),
//         onChangeAsyncDebounceMs: 1000,
//         onChangeAsync: createAsyncValidator,
//       },
//     },
//   ],
// };

export function useDynamicForm(formProps: IFormProps) {
  const defaultValues = Object.fromEntries(
    formProps.fields.map((field: IFormConfig) => [
      field.name,
      field.defaultValue,
    ]),
  );

  const [formData, setFormData] = useState<IFormInputValues>(() => {
    const savedData = localStorage.getItem('formData');
    return savedData != null
      ? (JSON.parse(savedData) as IFormInputValues)
      : defaultValues;
  });

  useEffect(() => {
    if (formData !== defaultValues) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [defaultValues, formData]);

  return { formData, setFormData };
}

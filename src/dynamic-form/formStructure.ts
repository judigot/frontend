import {
  IFormProps,
  createAsyncValidator,
} from '@/dynamic-form/hooks/useDynamicForm';
import { z } from 'zod';

export const formProps: IFormProps = {
  cacheValues: true,
  onSubmit: (e, _formData) => {
    e.preventDefault();
    // alert(JSON.stringify(data, null, 4));
  },
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      defaultValue: '',
      placeholder: 'Enter your first name',
      validators: {
        onChange: z.string().min(3, 'First name must be at least 3 characters'),
        onChangeAsyncDebounceMs: 1000,
        onChangeAsync: createAsyncValidator,
      },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      defaultValue: '',
      placeholder: 'Enter your last name',
      validators: {
        onChange: z.string().min(3, 'Last name must be at least 3 characters'),
        onChangeAsyncDebounceMs: 1000,
        onChangeAsync: createAsyncValidator,
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      defaultValue: '',
      placeholder: 'Enter a description',
      validators: {
        onChange: z
          .string()
          .min(3, 'Description must be at least 3 characters'),
        onChangeAsyncDebounceMs: 1000,
        onChangeAsync: createAsyncValidator,
      },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      defaultValue: '',
      placeholder: '',
      options: [
        { label: 'Other', value: '' },
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
      validators: {
        onChange: z.string(),
        onChangeAsyncDebounceMs: 1000,
        onChangeAsync: createAsyncValidator,
      },
    },
    {
      name: 'newsletter',
      label: 'Newsletter',
      type: 'radio',
      defaultValue: '',
      placeholder: '',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      validators: {
        onChange: z.string(),
        onChangeAsyncDebounceMs: 1000,
        onChangeAsync: createAsyncValidator,
      },
    },
  ],
};

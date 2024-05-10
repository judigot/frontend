import Text from './components/fields/Text';
import Number from './components/fields/Number';
import Boolean from './components/fields/Boolean';
import Dropdown from './components/fields/Dropdown';
import { MasterField } from '@/form-builder/types/types';

interface Props {
  form: MasterField[];
}

const FormBuilder = ({ form }: Props) => {
  return (
    <>
      {form.map((field: MasterField, i: number) => {
        switch (field.type) {
          case 'text':
            return (
              <Text
                key={i}
                title={field.title}
                type={field.type}
                maxLength={field.maxLength}
              />
            );

          case 'number':
            return (
              <Number
                key={i}
                title={field.title}
                type={field.type}
                min={field.min}
                max={field.max}
              />
            );

          case 'boolean':
            return (
              <Boolean
                key={i}
                title={field.title}
                type={field.type}
                isChecked={field.isChecked}
              />
            );

          case 'dropdown':
            return (
              <Dropdown
                key={i}
                title={field.title}
                type={field.type}
                options={field.options}
                default={field.default}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default FormBuilder;

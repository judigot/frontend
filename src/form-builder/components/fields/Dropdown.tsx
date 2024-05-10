import { DropdownField } from '@/form-builder/types/types';
import { useState } from 'react';

interface Props extends DropdownField {}

const Dropdown = ({ title, options, default: defaultValue }: Props) => {
  const [selected, setSelected] =
    useState<DropdownField['default']>(defaultValue);

  return (
    <div>
      <label>{title}</label>
      <select
        name=""
        id=""
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
        }}
      >
        {options &&
          options.map((option: string, i: number) => {
            return (
              <option key={i} value={option}>
                {option}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default Dropdown;

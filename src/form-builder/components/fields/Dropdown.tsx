import { IDropdownField } from '@/form-builder/types/types';
import { useState } from 'react';

interface IProps extends IDropdownField {}

const Dropdown = ({ title, options, default: defaultValue }: IProps) => {
  const [selected, setSelected] =
    useState<IDropdownField['default']>(defaultValue);

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

import { BooleanField } from '@/form-builder/types/types';
import React from 'react';

interface Props extends BooleanField {}

const Boolean = ({ title, isChecked }: Props) => {
  const [checked, setChecked] = React.useState((isChecked ?? false) || false);

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <div>
      <span>{title}</span>
      <input
        type="checkbox"
        id="" // Consider setting a meaningful id if necessary
        name="" // Consider setting a meaningful name if necessary
        checked={checked}
        onChange={handleClick}
      />
    </div>
  );
};

export default Boolean;

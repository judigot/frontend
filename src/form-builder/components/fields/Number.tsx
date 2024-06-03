import { INumberField } from '@/form-builder/types/types';

interface IProps extends INumberField {}

const NumberInput = ({ title, min, max }: IProps) => {
  return (
    <div>
      <span>{title}</span>
      <input type="number" min={min} max={max} />
    </div>
  );
};

export default NumberInput;

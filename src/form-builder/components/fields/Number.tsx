import { INumberField } from '@/form-builder/types/types';

type IProps = INumberField

const NumberInput = ({ title, min, max }: IProps) => {
  return (
    <div>
      <span>{title}</span>
      <input type="number" min={min} max={max} />
    </div>
  );
};

export default NumberInput;

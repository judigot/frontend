import { NumberField } from '@/form-builder/types/types';

interface Props extends NumberField {}

const NumberInput = ({ title, min, max }: Props) => {
  return (
    <div>
      <span>{title}</span>
      <input type="number" min={min} max={max} />
    </div>
  );
};

export default NumberInput;

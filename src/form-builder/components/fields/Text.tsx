import { TextField } from '@/form-builder/types/types';

interface Props extends TextField {}

const TextInput = ({ title, maxLength }: Props) => {
  return (
    <div>
      <span>{title}</span>
      <input type="text" maxLength={maxLength} />
    </div>
  );
};

export default TextInput;

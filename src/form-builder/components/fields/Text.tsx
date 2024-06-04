import { ITextField } from '@/form-builder/types/types';

type IProps = ITextField

const TextInput = ({ title, maxLength }: IProps) => {
  return (
    <div>
      <span>{title}</span>
      <input type="text" maxLength={maxLength} />
    </div>
  );
};

export default TextInput;

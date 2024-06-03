export interface ITextField {
  title: string;
  type: string;
  maxLength?: number;
}

export interface INumberField {
  title: string;
  type: string;
  min?: number;
  max?: number;
}

export interface IBooleanField {
  title: string;
  type: string;
  isChecked?: boolean;
}

export interface IDropdownField {
  title: string;
  type: string;
  options?: string[];
  default?: string;
}

export interface ITimeField {
  title: string;
  type: string;
}

export interface IMasterField
  extends ITextField,
    INumberField,
    IBooleanField,
    IDropdownField,
    ITimeField {}

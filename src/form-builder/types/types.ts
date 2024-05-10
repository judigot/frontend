export interface TextField {
  title: string;
  type: string;
  maxLength?: number;
}

export interface NumberField {
  title: string;
  type: string;
  min?: number;
  max?: number;
}

export interface BooleanField {
  title: string;
  type: string;
  isChecked?: boolean;
}

export interface DropdownField {
  title: string;
  type: string;
  options?: string[];
  default?: string;
}

export interface TimeField {
  title: string;
  type: string;
}

export interface MasterField
  extends TextField,
    NumberField,
    BooleanField,
    DropdownField,
    TimeField {}

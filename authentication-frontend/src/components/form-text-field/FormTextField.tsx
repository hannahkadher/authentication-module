import { Controller, Control, FieldValues, Path, PathValue } from 'react-hook-form';
import { TextField } from '@mui/material';

interface CustomTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type: string;
  defaultValue: PathValue<T, Path<T>>;
  error?: boolean | null;
  helperText?: string;
  showPassword?: boolean;
}

const FormTextField = <T extends FieldValues>({
  name, control, label, defaultValue , error, helperText, 
}: CustomTextFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ field }) => (
      <TextField
        {...field}
        fullWidth
        label={label}
        type= 'text'
        margin="normal"
        variant="standard"
        className="text-field-standard"
        error={!!error}
        helperText={helperText}
      />
    )}
  />
);

export default FormTextField;

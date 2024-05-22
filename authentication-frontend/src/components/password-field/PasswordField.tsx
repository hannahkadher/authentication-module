import { Controller, Control, FieldValues, Path, PathValue } from 'react-hook-form';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordFieldProps<T extends FieldValues> {
  name: Path<T>; 
  control: Control<T>;
  label: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
  error?: boolean;
  helperText?: string;
}

const PasswordField = <T extends FieldValues>({
  name,
  control,
  label,
  showPassword,
  toggleShowPassword,
  error,
  helperText,
}: PasswordFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    defaultValue={'' as PathValue<T, Path<T>>}
    render={({ field }) => (
      <TextField
        {...field}
        type={showPassword ? 'text' : 'password'}
        label={label}
        variant="standard"
        error={error}
        helperText={helperText}
        className="text-field-standard"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={toggleShowPassword}
                onMouseDown={(event) => event.preventDefault()}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
        margin="normal"
      />
    )}
  />
);

export default PasswordField;

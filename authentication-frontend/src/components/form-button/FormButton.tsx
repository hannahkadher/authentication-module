import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const FormButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '15px',
  backgroundColor: 'rgba(15, 84, 38, 1)',
  border: 'none',
  borderRadius: '20px',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#16a085',
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    cursor: 'not-allowed',
  },
}));

export default FormButton;

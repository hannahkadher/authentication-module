import React from 'react';
import PersonIcon from '@mui/icons-material/Person';

const FormHeader: React.FC = () => (
  <header className="form-header">
    <div className="logo">
      <PersonIcon className="greenIcon" />
      <span>Authenticator</span>
    </div>
  </header>
);

export default FormHeader;
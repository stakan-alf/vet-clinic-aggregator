import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectChangeEvent } from '@mui/material';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={changeLanguage}
      size="small"
      sx={{ minWidth: 100 }}
    >
      <option value="ru">Русский</option>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </Select>
  );
};

export default LanguageSwitcher; 
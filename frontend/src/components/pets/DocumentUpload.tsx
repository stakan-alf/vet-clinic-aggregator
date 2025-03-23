import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Add, Delete, Description } from '@mui/icons-material';
import { PetDocument } from '../../types/pet';

interface DocumentUploadProps {
  documents: PetDocument[];
  onUpload: (data: Omit<PetDocument, 'id' | 'uploaded_at'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  onUpload,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    try {
      setError(null);
      await onUpload({
        title: file.name,
        type: 'other',
        file,
      });
      handleClose();
    } catch (err) {
      setError('Произошла ошибка при загрузке файла');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот документ?')) {
      try {
        await onDelete(id);
      } catch (err) {
        setError('Произошла ошибка при удалении документа');
        console.error(err);
      }
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'vaccination':
        return 'Вакцинация';
      case 'visit':
        return 'Посещение';
      default:
        return 'Другой';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Документы</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Загрузить документ
        </Button>
      </Box>

      <Paper>
        <List>
          {documents.map((document) => (
            <ListItem key={document.id}>
              <ListItemText
                primary={document.title}
                secondary={`Тип: ${getDocumentTypeLabel(document.type)} • Загружен: ${new Date(document.uploaded_at).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => window.open(document.file, '_blank')}
                  sx={{ mr: 1 }}
                >
                  <Description />
                </IconButton>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleDelete(document.id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Загрузка документа</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <input
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              id="document-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="document-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mb: 2 }}
              >
                Выбрать файл
              </Button>
              {file && (
                <Typography variant="body2" color="text.secondary">
                  Выбран файл: {file.name}
                </Typography>
              )}
            </label>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained" disabled={!file}>
              Загрузить
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}; 
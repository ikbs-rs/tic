import fs from 'fs/promises';
import path from 'path';

const uploadFile = async (file, destination) => {
  try {
    const filePath = path.join(destination, file.originalname);
    await fs.writeFile(filePath, file.buffer);
    console.log('File uploaded successfully:', filePath);
    return filePath;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log('File deleted successfully:', filePath);
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
};

export default { uploadFile, deleteFile };

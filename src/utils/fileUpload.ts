import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { uploadFile } from '../services/supabaseService';

export async function pickAndUploadDocument(bucketName: string, pathPrefix: string = 'uploads'): Promise<string | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: '*/*', 
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const file = result.assets[0];
    const base64 = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileData = decode(base64);
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const path = `${pathPrefix}/${fileName}`;

    const url = await uploadFile(bucketName, path, fileData, file.mimeType ?? 'application/octet-stream');
    return url;
  } catch (error) {
    console.error('Error picking/uploading document:', error);
    throw error;
  }
}

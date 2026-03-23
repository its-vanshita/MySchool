import { useState, useEffect, useCallback } from 'react';
import {
  getStudentDocuments,
  createStudentDocument,
  deleteStudentDocument,
  uploadStudentDocument,
} from '../services/supabaseService';
import type { StudentDocument } from '../types';

/** Hook to manage student documents with storage upload */
export function useStudentDocuments(studentId: string) {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const refresh = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    const data = await getStudentDocuments(studentId);
    setDocuments(data);
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = async (
    file: Blob,
    fileName: string,
    docType: StudentDocument['doc_type'],
    uploadedBy: string,
    schoolId: string
  ) => {
    setUploading(true);
    try {
      const fileUrl = await uploadStudentDocument(studentId, fileName, file);
      const doc = await createStudentDocument({
        student_id: studentId,
        doc_type: docType,
        file_url: fileUrl,
        file_name: fileName,
        uploaded_by: uploadedBy,
        school_id: schoolId,
      });
      if (doc) setDocuments((prev) => [doc, ...prev]);
      return doc;
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    await deleteStudentDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return { documents, loading, uploading, refresh, upload, remove };
}

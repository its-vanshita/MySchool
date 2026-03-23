import { useState, useEffect, useCallback } from 'react';
import {
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeePayments,
  createFeePayment,
  updateFeePayment,
  subscribeFeePayments,
} from '../services/supabaseService';
import type { FeeStructure, FeePayment } from '../types';

/** Hook to manage fee structures for a class */
export function useFeeStructures(classId?: string) {
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getFeeStructures(classId);
    setStructures(data);
    setLoading(false);
  }, [classId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (fee: Omit<FeeStructure, 'id' | 'created_at'>) => {
    const created = await createFeeStructure(fee);
    if (created) setStructures((prev) => [...prev, created]);
    return created;
  };

  const update = async (id: string, updates: Partial<FeeStructure>) => {
    const updated = await updateFeeStructure(id, updates);
    if (updated) setStructures((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const remove = async (id: string) => {
    await deleteFeeStructure(id);
    setStructures((prev) => prev.filter((s) => s.id !== id));
  };

  return { structures, loading, refresh, add, update, remove };
}

/** Hook to manage fee payments with realtime updates */
export function useFeePayments(studentId: string | null) {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeFeePayments(studentId, (items) => {
      setPayments(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [studentId]);

  const add = async (payment: Omit<FeePayment, 'id' | 'created_at'>) => {
    return await createFeePayment(payment);
  };

  const update = async (id: string, updates: Partial<FeePayment>) => {
    return await updateFeePayment(id, updates);
  };

  return { payments, loading, add, update };
}

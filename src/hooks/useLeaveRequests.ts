import { useState, useEffect } from 'react';
import {
  subscribeLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
  getAllLeaveRequests,
} from '../services/supabaseService';
import type { LeaveRequest } from '../types';

export function useLeaveRequests(teacherId: string | undefined) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teacherId) return;
    const unsub = subscribeLeaveRequests(teacherId, (data) => {
      setLeaves(data);
      setLoading(false);
    });
    return unsub;
  }, [teacherId]);

  const applyLeave = async (request: {
    teacher_id: string;
    teacher_name?: string;
    from_date: string;
    to_date: string;
    reason: string;
  }) => {
    return createLeaveRequest(request);
  };

  const approve = async (id: string, approvedBy: string) => {
    await updateLeaveStatus(id, 'approved', approvedBy);
  };

  const reject = async (id: string, rejectedBy: string) => {
    await updateLeaveStatus(id, 'rejected', rejectedBy);
  };

  return { leaves, loading, applyLeave, approve, reject };
}

export function useAllLeaveRequests() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeLeaveRequests(null, (data) => {
      setLeaves(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { leaves, loading };
}

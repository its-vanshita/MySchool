import { useState, useEffect, useRef, useCallback } from 'react';
import {
  subscribeLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
  getAllLeaveRequests,
  getLeaveRequests,
} from '../services/supabaseService';
import type { LeaveRequest } from '../types';

// In-memory store for demo mode leaves (persists across hook instances within session)
let demoLeaves: LeaveRequest[] = [];
let demoListeners: Array<() => void> = [];
function notifyDemoListeners() {
  demoListeners.forEach((fn) => fn());
}

function isDemoUser(teacherId: string | undefined): boolean {
  return !!teacherId && teacherId.startsWith('demo-');
}

export function useLeaveRequests(teacherId: string | undefined) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const prevStatusMap = useRef<Record<string, string>>({});
  const [statusChanges, setStatusChanges] = useState<{ id: string; status: string; from_date: string; to_date: string }[]>([]);

  const isDemo = isDemoUser(teacherId);

  const processData = useCallback((data: LeaveRequest[]) => {
    const changes: { id: string; status: string; from_date: string; to_date: string }[] = [];
    const prevMap = prevStatusMap.current;

    data.forEach((leave) => {
      const prev = prevMap[leave.id];
      if (prev && prev !== leave.status && (leave.status === 'approved' || leave.status === 'rejected')) {
        changes.push({ id: leave.id, status: leave.status, from_date: leave.from_date, to_date: leave.to_date });
      }
    });

    const newMap: Record<string, string> = {};
    data.forEach((l) => { newMap[l.id] = l.status; });
    prevStatusMap.current = newMap;

    if (changes.length > 0) {
      setStatusChanges(changes);
    }

    setLeaves(data);
    setLoading(false);
  }, []);

  // Demo mode: listen to in-memory store
  useEffect(() => {
    if (!isDemo || !teacherId) return;
    const update = () => {
      const myDemoLeaves = demoLeaves.filter((l) => l.teacher_id === teacherId);
      processData(myDemoLeaves);
    };
    update();
    demoListeners.push(update);
    return () => {
      demoListeners = demoListeners.filter((fn) => fn !== update);
    };
  }, [teacherId, isDemo, processData]);

  // Real mode: subscribe to Supabase
  useEffect(() => {
    if (isDemo || !teacherId) return;
    const unsub = subscribeLeaveRequests(teacherId, processData);
    return unsub;
  }, [teacherId, isDemo, processData]);

  const refresh = useCallback(async () => {
    if (!teacherId) return;
    setRefreshing(true);
    try {
      if (isDemo) {
        const myDemoLeaves = demoLeaves.filter((l) => l.teacher_id === teacherId);
        processData(myDemoLeaves);
      } else {
        const data = await getLeaveRequests(teacherId);
        processData(data);
      }
    } finally {
      setRefreshing(false);
    }
  }, [teacherId, isDemo, processData]);

  const applyLeave = async (request: {
    teacher_id: string;
    teacher_name?: string;
    from_date: string;
    to_date: string;
    reason: string;
  }) => {
    if (isDemoUser(request.teacher_id)) {
      // Demo mode: create locally
      const newLeave: LeaveRequest = {
        id: `demo-leave-${Date.now()}`,
        teacher_id: request.teacher_id,
        teacher_name: request.teacher_name,
        from_date: request.from_date,
        to_date: request.to_date,
        reason: request.reason,
        status: 'pending',
        approved_by: null,
        created_at: new Date().toISOString(),
      };
      demoLeaves = [newLeave, ...demoLeaves];
      notifyDemoListeners();
      return newLeave;
    }
    const result = await createLeaveRequest(request);
    await refresh();
    return result;
  };

  const approve = async (id: string, approvedBy: string) => {
    if (id.startsWith('demo-leave-')) {
      demoLeaves = demoLeaves.map((l) =>
        l.id === id ? { ...l, status: 'approved' as const, approved_by: approvedBy } : l
      );
      notifyDemoListeners();
      return;
    }
    await updateLeaveStatus(id, 'approved', approvedBy);
  };

  const reject = async (id: string, rejectedBy: string) => {
    if (id.startsWith('demo-leave-')) {
      demoLeaves = demoLeaves.map((l) =>
        l.id === id ? { ...l, status: 'rejected' as const, approved_by: rejectedBy } : l
      );
      notifyDemoListeners();
      return;
    }
    await updateLeaveStatus(id, 'rejected', rejectedBy);
  };

  const clearStatusChanges = () => setStatusChanges([]);

  return { leaves, loading, refreshing, refresh, applyLeave, approve, reject, statusChanges, clearStatusChanges };
}

export function useAllLeaveRequests() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Also listen to demo leaves
    const update = () => {
      if (demoLeaves.length > 0) {
        setLeaves((prev) => {
          // Merge: real leaves + demo leaves (avoid duplicates)
          const realIds = new Set(prev.filter((l) => !l.id.startsWith('demo-leave-')).map((l) => l.id));
          const real = prev.filter((l) => !l.id.startsWith('demo-leave-'));
          return [...demoLeaves, ...real];
        });
      }
    };
    demoListeners.push(update);

    const unsub = subscribeLeaveRequests(null, (data) => {
      const merged = [...demoLeaves, ...data];
      setLeaves(merged);
      setLoading(false);
    });

    // Initial load of demo leaves
    if (demoLeaves.length > 0) update();
    setLoading(false); // Set loading to false even if no real data initially

    return () => {
      demoListeners = demoListeners.filter((fn) => fn !== update);
      unsub();
    };
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getAllLeaveRequests();
      setLeaves([...demoLeaves, ...data]);
    } catch (error) {
      // Network error or unauthenticated - just show demo data
      console.warn('Failed to fetch leave requests:', error);
      setLeaves([...demoLeaves]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return { leaves, loading, refreshing, refresh };
}

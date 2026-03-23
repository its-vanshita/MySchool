import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { supabase } from '../config/supabase';

/**
 * Universal Data Architecture Wrapper
 * 
 * This hook allows your entire UI to remain completely unchanged, while seamlessly switching
 * between purely local DEMO data (for immediate UI responses/testing) and LIVE Supabase data 
 * when a user creates a real account on the Free Plan.
 */
export function useSupabaseQuery<T>(
  tableName: string,
  demoData: T[],
  queryFn?: () => any // Optional: Pass a custom Supabase query chain
) {
  const { isDemo, profile } = useUser();
  const [data, setData] = useState<T[]>(isDemo ? demoData : []);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. If we are in Demo Mode, NEVER touch the database to save Free Plan bandwidth!
    if (isDemo) {
      setData(demoData);
      setLoading(false);
      return;
    }

    // 2. If we are logged in, begin Live Database Sync
    let isMounted = true;
    
    async function fetchData() {
      if (!profile) return;
      
      try {
        setLoading(true);
        let result;
        
        if (queryFn) {
          result = await queryFn();
        } else {
          // Default: Fetch all rows mapping to the current user's school
          result = await supabase
            .from(tableName)
            .select('*');
        }

        if (result.error) throw result.error;
        if (isMounted) setData(result.data as T[]);
        
      } catch (err: any) {
        console.error(`Supabase Sync Error [${tableName}]:`, err.message);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    // 3. Supabase Realtime Subscription (Free Plan handles up to 200 concurrent connections effortlessly)
    const subscription = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
        console.log(`Realtime Update spotted in ${tableName}!`);
        // We re-fetch or intelligently merge the payload to keep UI strictly in-sync without page reloads
        fetchData();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, [isDemo, tableName, profile]);

  return { data, loading, error, setData };
}

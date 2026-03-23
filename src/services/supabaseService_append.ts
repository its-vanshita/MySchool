
// ═══════════════════════════════════════════════════════════════
// SHARED USERS (For Admin/Parent/Staff Directories)
// ═══════════════════════════════════════════════════════════════

export async function getAllTeachers(schoolId: string = ''): Promise<AppUser[]> {
  let query = supabase.from('users').select('*').eq('role', 'teacher').order('name');
  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }
  const { data } = await query;
  return (data ?? []) as AppUser[];
}

export async function getAllStudents(schoolId: string = ''): Promise<any[]> {
  // Fetch all students with their class info
  let query = supabase
    .from('class_students')
    .select('*, classes!inner(name, grade, section, school_id)')
    .order('name');
    
  if (schoolId) {
    query = query.eq('classes.school_id', schoolId);
  }
  
  const { data } = await query;
  return (data ?? []) as any[];
}

const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'app');

const adminFiles = [
  'admin-analytics.tsx',
  'admin-attendance-list.tsx',
  'admin-leave-approvals.tsx',
  'admin-lesson-plans.tsx',
  'admin-manage-calendar.tsx',
  'admin-manage-timetable.tsx'
];

const teacherFiles = [
  'add-homework.tsx',
  'add-lesson-plan.tsx',
  'apply-leave.tsx',
  'assign-notice.tsx',
  'class-students.tsx',
  'create-announcement.tsx',
  'create-notice.tsx',
  'leave-approvals.tsx',
  'mark-attendance.tsx',
  'student-performance.tsx'
];

const sharedFiles = [
  'exam-datesheet.tsx',
  'notifications.tsx'
];

function moveFiles(files, targetFolder) {
  const targetPath = path.join(appDir, targetFolder);
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
  
  files.forEach(f => {
    const src = path.join(appDir, f);
    const dest = path.join(targetPath, f);
    if (fs.existsSync(src)) {
      console.log('Moving ' + src + ' to ' + dest);
      fs.renameSync(src, dest);
    }
  });
}

moveFiles(adminFiles, '(admin)');
moveFiles(teacherFiles, '(teacher)');
moveFiles(sharedFiles, '(shared)');

// Update _layout.tsx
const layoutPath = path.join(appDir, '_layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf-8');

adminFiles.forEach(f => {
  const base = f.replace('.tsx', '');
  layoutContent = layoutContent.replace(new RegExp('name="' + base + '"', 'g'), 'name="(admin)/' + base + '"');
});

teacherFiles.forEach(f => {
  const base = f.replace('.tsx', '');
  layoutContent = layoutContent.replace(new RegExp('name="' + base + '"', 'g'), 'name="(teacher)/' + base + '"');
});

sharedFiles.forEach(f => {
  const base = f.replace('.tsx', '');
  layoutContent = layoutContent.replace(new RegExp('name="' + base + '"', 'g'), 'name="(shared)/' + base + '"');
});

fs.writeFileSync(layoutPath, layoutContent);

console.log('Reorganization successful!');

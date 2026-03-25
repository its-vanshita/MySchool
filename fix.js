const fs = require('fs');
const ts = require('typescript');

const files = [
'app/(parent-drawer)/_layout.tsx',
'app/(parent-drawer)/profile.tsx',
'app/(shared)/exam-datesheet.tsx',
'app/(shared)/notifications.tsx',
'app/(teacher)/add-homework.tsx',
'app/(teacher)/assign-notice.tsx',
'app/(teacher)/class-students.tsx',
'app/(teacher)/create-announcement.tsx',
'app/(teacher)/create-notice.tsx',
'app/(teacher)/leave-approvals.tsx',
'app/(teacher)/mark-attendance.tsx',
'app/(admin-drawer)/(tabs)/_layout.tsx',
'app/(admin-drawer)/_layout.tsx',
'app/(admin-drawer)/profile.tsx',
'app/(drawer)/(tabs)/_layout.tsx',
'app/(drawer)/(tabs)/index.tsx',
'app/(drawer)/_layout.tsx',
'app/(drawer)/datesheet.tsx',
'app/(drawer)/profile.tsx',
'app/(parent-drawer)/(tabs)/_layout.tsx',
'app/(parent-drawer)/(tabs)/attendance.tsx',
'app/(parent-drawer)/(tabs)/datesheet.tsx',
'app/(parent-drawer)/(tabs)/homework.tsx',
'app/(parent-drawer)/(tabs)/notices.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  let sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);
  
  let additions = [];
  
  function visit(node) {
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
        if (!node.body || !ts.isBlock(node.body)) {
        } else {
            let bodyText = node.body.getText(sf);
            if (bodyText.includes('<') && (bodyText.includes('styles.') || bodyText.includes('colors.')) && (!bodyText.includes('useTheme()'))) {
                let start = node.body.statements.length > 0 ? node.body.statements[0].getStart(sf) : node.body.getEnd() - 1;
                additions.push({
                   pos: start,
                   text: '\n    const { colors, isDark } = useTheme();\n    const styles = typeof getStyles === "function" ? getStyles(colors) : typeof drawerStyles !== "undefined" ? drawerStyles : typeof getStyles === "undefined" ? {} : getStyles(colors);\n'
                });
            }
        }
    }
    ts.forEachChild(node, visit);
  }
  
  visit(sf);
  
  if (additions.length > 0) {
     additions.sort((a,b)=> b.pos - a.pos);
     for(let a of additions) {
        code = code.slice(0, a.pos) + a.text + code.slice(a.pos);
     }
     if(!code.includes('useTheme')) {
        code = "import { useTheme } from '@/src/context/ThemeContext';\n" + code;
     }
     fs.writeFileSync(file, code);
     console.log('Fixed', file, additions.length, 'functions');
  }
});

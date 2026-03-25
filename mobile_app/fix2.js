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

  // find the actual getStyles function name in this file
  let styleFuncName = 'getStyles';
  function findStyleGetter(node) {
      if (ts.isVariableDeclaration(node) && node.name.getText(sf).startsWith('get') && node.name.getText(sf).endsWith('tyles')) {
          styleFuncName = node.name.getText(sf);
      }
      ts.forEachChild(node, findStyleGetter);
  }
  findStyleGetter(sf);
  
  // Also we need to fix the bad injected line I just did.
  // The bad line is:
  // const styles = typeof getStyles === "function" ? getStyles(colors) : typeof drawerStyles !== "undefined" ? drawerStyles : typeof getStyles === "undefined" ? {} : getStyles(colors);
  
  let badLine1 = 'const styles = typeof getStyles === "function" ? getStyles(colors) : typeof drawerStyles !== "undefined" ? drawerStyles : typeof getStyles === "undefined" ? {} : getStyles(colors);';
  let badLine2 = "const styles = typeof getStyles === 'function' ? getStyles(colors) : typeof drawerStyles !== 'undefined' ? drawerStyles : typeof getStyles === 'undefined' ? {} : getStyles(colors);";
  
  let newLine = \const styles = \(colors);\;
  
  code = code.split(badLine1).join(newLine);
  code = code.split(badLine2).join(newLine);
  
  // Also replace any \const styles = typeof getStyles === 'function' ? getStyles(colors) : {};\ that I did earlier
  let badLine3 = "const styles = typeof getStyles === 'function' ? getStyles(colors) : {};";
  code = code.split(badLine3).join(newLine);
  
  // also wait, some components might use \drawerStyles\ directly inside the function instead of \styles\.
  // if styleFuncName is \getDrawerStyles\, we should alias it: \const drawerStyles = getDrawerStyles(colors);\.
  if (styleFuncName.includes('rawer')) {
     code = code.split(newLine).join(\const drawerStyles = \(colors);\);
  }
  
  fs.writeFileSync(file, code);
});
console.log("fixed bad styles logic");

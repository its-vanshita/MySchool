const fs = require('fs');
const file = 'app/(admin-drawer)/(tabs)/_layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/headerShown: false,\s*headerShown: false,/, 'headerShown: false,');

fs.writeFileSync(file, content);
console.log('patched _layout again');

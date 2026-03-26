const fs = require('fs');
const file = 'app/(admin-drawer)/(tabs)/_layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /name="users"[\s\S]*?options=\{\{/,
  `name="users"
          options={{
            headerShown: false,`
);

fs.writeFileSync(file, content);
console.log('patched _layout');

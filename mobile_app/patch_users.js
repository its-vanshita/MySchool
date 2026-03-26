const fs = require('fs');
const file = 'app/(admin-drawer)/(tabs)/users.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Stack array with proper imports
content = content.replace("import { Stack, useRouter } from 'expo-router';", "import { Stack, useRouter } from 'expo-router';");
// Actually, it runs inside a stack within a tab? No, it's a direct child of Tabs.
// Let's just remove the explicit back button
content = content.replace(
  /<TouchableOpacity onPress=\{\(\) => router\.back\(\)\} style=\{styles\.backButton\}>[\s\S]*?<\/TouchableOpacity>/,
  '<View style={styles.backButton} />'
);

content = content.replace(/<Stack\.Screen options=\{\{ headerShown: false \}\} \/>/, '');

fs.writeFileSync(file, content);
console.log('patched');

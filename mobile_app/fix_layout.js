const fs = require('fs');
let c = fs.readFileSync('app/_layout.tsx', 'utf8');

c = c.replace(/export default function RootLayout\(\) \{\s*const \{ colors, isDark \} = useTheme\(\);\s*return \(\s*<ErrorBoundary>\s*<ThemeProvider>\s*<AuthProvider>\s*<UserProvider>\s*<NotificationProvider>\s*<AnimatedSplashScreen>/,
  'export default function RootLayout() {\\n' +
  '  return (\\n' +
  '    <ErrorBoundary>\\n' +
  '      <ThemeProvider>\\n' +
  '        <AuthProvider>\\n' +
  '          <UserProvider>\\n' +
  '             <NotificationProvider>\\n' +
  '               <RootLayoutNav />\\n' +
  '             </NotificationProvider>\\n' +
  '          </UserProvider>\\n' +
  '        </AuthProvider>\\n' +
  '      </ThemeProvider>\\n' +
  '    </ErrorBoundary>\\n' +
  '  );\\n' +
  '}\\n\\n' +
  'function RootLayoutNav() {\\n' +
  '  const { colors, isDark } = useTheme();\\n' +
  '  return (\\n' +
  '    <AnimatedSplashScreen>'
);

c = c.replace(/<\/AnimatedSplashScreen>\s*<\/NotificationProvider>\s*<\/UserProvider>\s*<\/AuthProvider>\s*<\/ThemeProvider>\s*<\/ErrorBoundary>\s*\);\s*\}/, 
  '</AnimatedSplashScreen>\\n  );\\n}'
);

fs.writeFileSync('app/_layout.tsx', c);


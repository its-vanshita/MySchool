const fs = require('fs');

let content = fs.readFileSync('app/(parent-drawer)/(tabs)/_layout.tsx', 'utf8');

// remove marks and replace with datesheet
content = content.replace(
  /<Tabs\.Screen\s+name="marks"[\s\S]*?<\/Tabs\.Screen>/,
  `<Tabs.Screen
        name="datesheet"
        options={{
          title: 'Exams',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={26} color={color} />
          ),
        }}
      />`
);

// remove fee and replace with calendar
content = content.replace(
  /<Tabs\.Screen\s+name="fee"[\s\S]*?<\/Tabs\.Screen>/,
  `<Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar-number" : "calendar-number-outline"} size={26} color={color} />
          ),
        }}
      />`
);

// update old null screens
content = content.replace(
  /<Tabs\.Screen name="datesheet" options={{ title: 'Exams', headerTitle: \(\) => <HeaderTitle \/>, href: null }} \/>/,
  `<Tabs.Screen name="marks" options={{ title: 'Marks', headerTitle: () => <HeaderTitle />, href: null }} />
      <Tabs.Screen name="fee" options={{ title: 'Fee', headerTitle: () => <HeaderTitle />, href: null }} />`
);

fs.writeFileSync('app/(parent-drawer)/(tabs)/_layout.tsx', content);

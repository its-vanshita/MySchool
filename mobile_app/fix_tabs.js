const fs = require('fs');

const layoutFile = 'app/(parent-drawer)/(tabs)/_layout.tsx';
let layoutContent = fs.readFileSync(layoutFile, 'utf8');

// The regex we need should replace the whole Tabs.Screen block for marks and fee
layoutContent = layoutContent.replace(
  /<Tabs\.Screen\s+name="marks"\s+options={{[\s\S]*?}}[\s\S]*?\/>/,
  `<Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={26} color={color} />
          ),
        }}
      />`
);

layoutContent = layoutContent.replace(
  /<Tabs\.Screen\s+name="fee"\s+options={{[\s\S]*?}}[\s\S]*?\/>/,
  `<Tabs.Screen
        name="datesheet"
        options={{
          title: 'Exams',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "school" : "school-outline"} size={26} color={color} />
          ),
        }}
      />`
);

fs.writeFileSync(layoutFile, layoutContent, 'utf8');
console.log('Fixed tabs!');

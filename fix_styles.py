import os
import re

files = [
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
]

for file in files:
    if not os.path.exists(file):
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        code = f.read()

    # Find name of style getter
    match = re.search(r'(const|function)\s+(get[A-Za-z0-9_]*Styles)\s*[=(]', code)
    style_getter = match.group(2) if match else "getStyles"
    
    # We want to replace the bad injected styles variables
    bad1 = 'const styles = typeof getStyles === "function" ? getStyles(colors) : typeof drawerStyles !== "undefined" ? drawerStyles : typeof getStyles === "undefined" ? {} : getStyles(colors);'
    bad2 = 'const styles = typeof getStyles === \'function\' ? getStyles(colors) : typeof drawerStyles !== \'undefined\' ? drawerStyles : typeof getStyles === \'undefined\' ? {} : getStyles(colors);'
    bad3 = 'const styles = typeof getStyles === "function" ? getStyles(colors) : {};'
    bad4 = 'const styles = typeof getStyles === \'function\' ? getStyles(colors) : {};'
    
    # also some raw occurrences
    bad_part = 'typeof drawerStyles !== "undefined" ? drawerStyles : typeof getStyles === "undefined" ? {} : getStyles(colors)'

    if 'rawer' in style_getter.lower():
        good_line = f'const drawerStyles = {style_getter}(colors);'
    else:
        good_line = f'const styles = {style_getter}(colors);'
    
    code = code.replace(bad1, good_line)
    code = code.replace(bad2, good_line)
    code = code.replace(bad3, good_line)
    code = code.replace(bad4, good_line)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(code)
print("Fix script completed.")

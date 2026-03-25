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

# We want to identify any const SOME_STYLES = StyleSheet.create({
# and change it to const getSOME_STYLES = (colors: any) => StyleSheet.create({
# Actually let's just make it const getStyles = (colors: any) => StyleSheet.create({ if it's currently const styles = StyleSheet.create
# BUT the prompt asks: "by moving them into the functions."
# Oh, the prompt explicitly says "moving them into the functions."

# BUT turning to a getter is practically the same, wait! I will just find them and move them into the component! No, wrapping is easier for regex.
# Let's wrap any const [name] = StyleSheet.create that is at the root level, turning it into a getter. 

# If I use const get[Name] = (colors: any) => StyleSheet.create, and then dynamically replace the usage...

# Or even simpler: the instructions are "fix any other styles.xxx or colors.xxx references outside functions if they are in global constants, by moving them into the functions."


import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#f3f4f6' },
        }}
      >
        <Stack.Screen name="index" options={{ title: '気分ごはん' }} />
        <Stack.Screen name="results" options={{ title: '今日のおすすめ' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

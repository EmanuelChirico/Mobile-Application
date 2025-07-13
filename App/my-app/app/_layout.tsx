import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Platform, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const colors = {
      light: {
          headerBg: '#fdf6e3',
          headerTitle: '#3E3E3E',
          tabBarBg: '#ffffff',
          tabBarActive: '#FFB300',
          tabBarInactive: '#B0AFAF',
          shadow: '#000',
      },
      dark: {
          headerBg: '#232323',
          headerTitle: '#FFD580',
          tabBarBg: '#181818',
          tabBarActive: '#FFD580',
          tabBarInactive: '#888888',
          shadow: '#000',
      },
  };
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.headerBg,
                },
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                    color: theme.headerTitle,
                },
                headerTitleAlign: 'center',
                headerTintColor: theme.headerTitle,
            }}
        >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: 'Explore', 
          }}
        />
        <Stack.Screen
            name="[edit]"
            options={{
                title: 'Edit'
            }}
        />
        <Stack.Screen
          name="travel/[id]"
          options={{ title: 'Dettagli del tuo viaggio' }}
        />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        paddingBottom: 4,
    },
});
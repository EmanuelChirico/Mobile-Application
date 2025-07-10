import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function Layout() {
  const colorScheme = useColorScheme();
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

  return (
    <Tabs
      screenOptions={{
        headerStyle: [{
          backgroundColor: theme.headerBg,
          shadowColor: 'transparent',
          elevation: 0,
        }],
        headerTitleStyle: [{
          fontWeight: '600',
          fontSize: 18,
          color: theme.headerTitle,
        }],
        headerTitleAlign: 'center',
        tabBarStyle: [{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 30 : 16,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 32,
          backgroundColor: theme.tabBarBg,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 12,
          paddingHorizontal: 16,
        }],
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-variant-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="shape-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Trip',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="plus-circle-outline" size={24} color={color} />,
        }}
      />
        <Tabs.Screen
            name="[edit]"
            options={{
                title: 'Edit Trip',
                tabBarButton: () => null,
                tabBarItemStyle: { width: 0, height: 0, display: 'none'},
            }}
        />
        <Tabs.Screen
            name="map"
            options={{
                title: 'Map',
                tabBarIcon: ({ color }) => <MaterialCommunityIcons name="earth" size={24} color={color}/>,
            }}
        />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 4,
  },
});

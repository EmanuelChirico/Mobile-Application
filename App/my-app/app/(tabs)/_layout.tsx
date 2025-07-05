import { Tabs } from 'expo-router';
import { Text, StyleSheet, Platform } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTitleAlign: 'center',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFAB00',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Categorie',
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>🗂️</Text>,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Aggiungi',
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>➕</Text>,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cerca',
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>🔍</Text>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#c8ad7f',
    shadowColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
 tabBar: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 29 : 8,
    left: 16,
    right: 16,
    height: 60,
    borderRadius: 30,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    paddingBottom: 4,
  },
  icon: {
    fontSize: 24,
  },
});

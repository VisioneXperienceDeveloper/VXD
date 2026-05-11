import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { theme } from './src/shared/theme';
import { Sidebar } from './src/components/Sidebar';
import { ChatScreen } from './src/screens/ChatScreen';
import { useNotifications } from './src/shared/hooks/useNotifications';

const Drawer = createDrawerNavigator();

const channels = [
  { id: '1', name: 'general', isPrivate: false },
  { id: '2', name: 'development', isPrivate: false },
  { id: '3', name: 'announcements', isPrivate: false },
  { id: '4', name: 'design-feedback', isPrivate: true },
];

export default function App() {
  useNotifications();
  
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer theme={{
        dark: true,
        colors: {
          primary: theme.colors.accent.primary,
          background: theme.colors.bg.primary,
          card: theme.colors.bg.secondary,
          text: theme.colors.text.primary,
          border: theme.colors.border.subtle,
          notification: theme.colors.accent.primary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        }
      }}>
        <Drawer.Navigator
          drawerContent={(props) => {
            const state = props.state;
            const currentRoute = state.routes[state.index];
            const params = currentRoute.params as { channelId?: string } | undefined;
            
            return (
              <Sidebar 
                {...props}
                workspaceName="VisionXperience"
                channels={channels}
                activeChannelId={params?.channelId || '1'}
                onChannelPress={(id) => {
                  const channel = channels.find(c => c.id === id);
                  props.navigation.navigate('Chat', { 
                    channelId: id, 
                    channelName: channel?.name, 
                    isPrivate: channel?.isPrivate 
                  });
                }}
                onClose={() => props.navigation.closeDrawer()}
              />
            );
          }}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              width: '85%',
              backgroundColor: theme.colors.bg.secondary,
            },
          }}
        >
          <Drawer.Screen 
            name="Chat" 
            component={ChatScreen as any} 
            initialParams={{ 
              channelId: '1', 
              channelName: 'general', 
              isPrivate: false 
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

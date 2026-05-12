import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { theme } from '../shared/theme';
import { Header } from '../components/Header';
import { MessageInput } from '../components/MessageInput';
import { DrawerNavigationProp } from '@react-navigation/drawer';

interface Message {
  id: string;
  author: string;
  body: string;
  time: string;
}

interface ChatScreenProps {
  navigation: DrawerNavigationProp<any>;
  route: { params: { channelId: string; channelName: string; isPrivate: boolean } };
}

const FlashListAny = FlashList as any;

export const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { channelId, channelName, isPrivate } = route.params || { 
    channelId: '1', 
    channelName: 'general', 
    isPrivate: false 
  };

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', author: 'Alex', body: 'Hey everyone, check out the new mobile UI!', time: '10:30 AM' },
    { id: '2', author: 'Sam', body: 'Looks great! Is it using the same design tokens as the web app?', time: '10:32 AM' },
    { id: '3', author: 'Alex', body: 'Yes, exactly the same monochrome palette.', time: '10:33 AM' },
    { id: '4', author: 'Taylor', body: 'The dark mode aesthetics are really premium.', time: '10:35 AM' },
    { id: '5', author: 'Bot', body: 'Testing high-performance FlashList scrolling...', time: '10:36 AM' },
    // Adding more mock messages for FlashList demo
    ...Array.from({ length: 20 }, (_, i) => ({
      id: (i + 6).toString(),
      author: 'User ' + (i + 1),
      body: `Message ${i + 1} for high-performance list verification.`,
      time: '10:40 AM'
    }))
  ]);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      author: 'You',
      body: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([newMessage, ...messages]);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.messageItem}>
      <View style={styles.avatarPlaceholder} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.body}>{item.body}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        channelName={channelName}
        isPrivate={isPrivate}
        memberCount={12}
        onMenuPress={() => navigation.openDrawer()}
      />
      
      <View style={styles.listContainer}>
        <FlashListAny
          data={messages}
          renderItem={renderItem}
          estimatedItemSize={80}
          keyExtractor={(item: Message) => item.id}
          contentContainerStyle={styles.listContent}
          inverted
        />
      </View>

      <MessageInput onSend={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing[4],
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[6],
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.tertiary,
    marginRight: theme.spacing[3],
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  author: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.base,
    fontWeight: '700',
    marginRight: theme.spacing[2],
  },
  time: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.size.xs,
  },
  body: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.base,
    lineHeight: 20,
  },
});

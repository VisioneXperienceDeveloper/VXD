import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Plus, Send, Smile, Paperclip } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../shared/theme';

interface MessageInputProps {
  placeholder?: string;
  onSend: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ placeholder, onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSend(text);
      setText('');
      // Keyboard.dismiss(); // Optional: keep keyboard open for rapid messaging
    }
  };

  const handleIconPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TouchableOpacity style={styles.attachBtn} onPress={handleIconPress}>
          <Plus color={theme.colors.text.secondary} size={20} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder={placeholder || "Message..."}
          placeholderTextColor={theme.colors.text.tertiary}
          value={text}
          onChangeText={setText}
          multiline
          blurOnSubmit={false}
          returnKeyType="default"
        />

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleIconPress}>
            <Smile color={theme.colors.text.secondary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Send color={text.trim() ? theme.colors.accent.primary : theme.colors.text.tertiary} size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[3],
    backgroundColor: theme.colors.bg.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.bg.input,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  attachBtn: {
    padding: theme.spacing[2],
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.base,
    paddingHorizontal: theme.spacing[2],
    maxHeight: 120,
    minHeight: 40,
    textAlignVertical: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },
  iconBtn: {
    padding: theme.spacing[2],
  },
  sendBtn: {
    padding: theme.spacing[2],
    marginLeft: theme.spacing[1],
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});

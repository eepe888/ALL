import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { StaplePreference } from '../src/domain/types';

const EXAMPLES = [
  'さっぱりしたものが食べたい気分',
  'こってり系でガッツリ食べたい',
  '疲れたから温かいものが欲しい',
  '今日は元気を出したい',
];

const STAPLE_OPTIONS: { value: StaplePreference | null; label: string }[] = [
  { value: null, label: '指定なし' },
  { value: '米', label: 'ご飯' },
  { value: '麺', label: '麺類' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [staple, setStaple] = useState<StaplePreference | null>(null);

  const handleSubmit = (value: string) => {
    const moodText = value.trim();
    if (!moodText) return;
    router.push({
      pathname: '/results',
      params: { mood: moodText, ...(staple ? { staple } : {}) },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>今日はどんな気分ですか？</Text>
        <Text style={styles.subheading}>
          自炊・惣菜・コンビニ・外食を横断して、気分に合う食べ物を提案します。
        </Text>

        <TextInput
          style={styles.input}
          placeholder="例：さっぱりしたものが食べたい気分"
          value={text}
          onChangeText={setText}
          multiline
          returnKeyType="done"
          onSubmitEditing={() => handleSubmit(text)}
        />

        <Text style={styles.stapleHeading}>主食の希望（任意）</Text>
        <View style={styles.stapleRow}>
          {STAPLE_OPTIONS.map((option) => {
            const selected = option.value === staple;
            return (
              <Pressable
                key={option.label}
                style={[styles.stapleChip, selected && styles.stapleChipSelected]}
                onPress={() => setStaple(option.value)}
              >
                <Text style={[styles.stapleChipText, selected && styles.stapleChipTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.submitButton} onPress={() => handleSubmit(text)}>
          <Text style={styles.submitButtonText}>提案してもらう</Text>
        </Pressable>

        <Text style={styles.exampleHeading}>入力例</Text>
        {EXAMPLES.map((example) => (
          <Pressable key={example} style={styles.exampleChip} onPress={() => handleSubmit(example)}>
            <Text style={styles.exampleChipText}>{example}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  subheading: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  stapleHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  stapleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stapleChip: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  stapleChipSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  stapleChipText: {
    fontSize: 14,
    color: '#374151',
  },
  stapleChipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  exampleHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    marginTop: 28,
    marginBottom: 8,
  },
  exampleChip: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exampleChipText: {
    fontSize: 14,
    color: '#374151',
  },
});

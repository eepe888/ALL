import { StyleSheet, Text, View } from 'react-native';

interface Props {
  channelLabel: string;
  title: string;
  description: string;
  extra?: string[];
}

export function SuggestionCard({ channelLabel, title, description, extra }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.channel}>{channelLabel}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {extra?.map((line, i) => (
        <Text key={i} style={styles.extraLine}>
          {`・${line}`}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  channel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  extraLine: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 4,
  },
});

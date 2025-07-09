import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  name: string;
  onDelete: () => void;
  theme: any;
};

export default function CategoryCard({ name, onDelete, theme }: Props) {
  return (
    <View
      style={{
        backgroundColor: theme.card,
        paddingVertical: 20,
        borderRadius: 16,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>{name}</Text>

      <TouchableOpacity
        onPress={onDelete}
        style={{
          position: 'absolute',
          top: 6,
          right: 10,
          borderRadius: 12,
          padding: 4,
          width: 24,
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: theme.close, fontWeight: 'bold' }}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

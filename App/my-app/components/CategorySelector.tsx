import { View, Pressable, Text } from 'react-native';

type Props = {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
  theme: any;
};

export default function CategorySelector({ categories, selected, onSelect, theme }: Props) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
      {categories.map((cat) => (
        <Pressable
          key={cat}
          onPress={() => onSelect(selected === cat ? '' : cat)}
          style={{
            backgroundColor: selected === cat ? theme.categorySelected : theme.categoryBg,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: selected === cat ? theme.categoryTextSelected : theme.categoryText,
              fontWeight: selected === cat ? '600' : 'normal',
            }}
          >
            {cat}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

import { Text, TextInput } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onFocus?: () => void;
  onBlur?: () => void;
  focused: boolean;
  theme: any;
  multiline?: boolean;
  style?: object;
};

export default function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  focused,
  onFocus,
  onBlur,
  theme,
  multiline = false,
  style = {},
}: Props) {
  return (
    <>
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 16,
        color: theme.label,
      }}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          backgroundColor: theme.card,
          borderRadius: 16,
          padding: 14,
          fontSize: 16,
          borderWidth: 1,
          borderColor: focused ? theme.borderActive : theme.border,
          color: theme.text,
          textAlignVertical: multiline ? 'top' : 'auto',
          ...style,
        }}
      />
    </>
  );
}

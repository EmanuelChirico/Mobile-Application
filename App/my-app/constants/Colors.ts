/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), 
 * [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
export const Colors = {
  light: {
    background: '#FAF7ED',
    card: '#fff',
    text: '#3A2F20',
    title: '#6B4F2C',
    border: '#ddd',
    placeholder: '#999',
    edit: '#4949d0',
    delete: '#C94C4C',
    location: '#777',
    shadow: '#000',
  },
  dark: {
    background: '#181818',
    card: '#232323',
    text: '#F5F5F5',
    title: '#FFD580',
    border: '#333',
    placeholder: '#aaa',
    edit: '#4949d0',
    delete: '#C94C4C',
    location: '#aaa',
    shadow: '#000',
  },
};

export function getTheme(mode: 'dark' | 'light') {
  return mode === 'dark' ? Colors.dark : Colors.light;
}

export const ExploreColors = {
  light: {
    background: '#F8F4E1',
    card: '#E3D5B8',
    text: '#4C3D25',
    title: '#6B4F2C',
    border: '#D6C7A1',
    placeholder: '#9E8C6C',
    button: '#D6C7A1',
    buttonText: '#4C3D25',
    addButton: '#BFA77A',
    inputBg: '#FFF8E6',
    shadow: '#000',
    close: 'black',
  },
  dark: {
    background: '#181818',
    card: '#232323',
    text: '#FFD580',
    title: '#FFD580',
    border: '#444',
    placeholder: '#aaa',
    button: '#444',
    buttonText: '#FFD580',
    addButton: '#FFD580',
    inputBg: '#232323',
    shadow: '#000',
    close: '#FFD580',
  },
};


export const AddColors = {
  light: {
    background: '#FAF7ED',
    card: '#fff',
    text: '#2C2C2C',
    label: '#444',
    border: '#ccc',
    borderActive: '#FFD600',
    placeholder: '#999',
    button: '#6C4F3D',
    buttonText: '#fff',
    categoryBg: '#eee',
    categorySelected: '#C19A6B',
    categoryText: '#555',
    categoryTextSelected: '#fff',
    imageButton: '#C19A6B',
    imageButtonText: '#fff',
    noImage: '#777',
  },
  dark: {
    background: '#181818',
    card: '#232323',
    text: '#FFD580',
    label: '#FFD580',
    border: '#444',
    borderActive: '#FFD600',
    placeholder: '#aaa',
    button: '#FFD580',
    buttonText: '#232323',
    categoryBg: '#232323',
    categorySelected: '#FFD580',
    categoryText: '#FFD580',
    categoryTextSelected: '#232323',
    imageButton: '#FFD580',
    imageButtonText: '#232323',
    noImage: '#aaa',
  },
};



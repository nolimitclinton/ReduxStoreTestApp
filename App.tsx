import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { createStore } from './src/store/store';
import { StoreProvider, useDispatch, useStore } from './src/store/react';

type AppState = {
  name: string;
  age: number;
};

const store = createStore<AppState>(
  { name: 'Clinton', age: 0 },
  (state, action) => {
    switch (action.type) {
      case 'incremented_age':
        return { ...state, age: state.age + 1 };
      case 'changed_name':
        return { ...state, name: action.nextName };
      default:
        throw new Error('Unknown action: ' + action.type);
    }
  }
);

function Profile() {
  const name = useStore<AppState['name'], AppState>(s => s.name);
  const age = useStore<AppState['age'], AppState>(s => s.age);
  const dispatch = useDispatch<AppState>();
  const [input, setInput] = React.useState('');

  return (
    <View style={styles.container}>
      <Text>Name: {name}</Text>
      <Text>Age: {age}</Text>
      <Button title="Increment Age" onPress={() => dispatch({ type: 'incremented_age' })} />
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={input}
        onChangeText={setInput}
      />
      <Button
        title="Change Name"
        onPress={() => {
          if (input.trim()) {
            dispatch({ type: 'changed_name', nextName: input.trim() });
            setInput('');
          }
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <StoreProvider store={store}>
      <Profile />
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderWidth: 1, padding: 8, width: 200, marginTop: 10 }
});
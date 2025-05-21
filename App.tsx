import React, { useEffect, useState } from 'react';
import { Button, Text, View, TextInput, StyleSheet } from 'react-native';
import { createStore } from './src/store';

const store = createStore(
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

export default function App() {
  const [state, setState] = useState(store.getState());
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newState = store.getState();
      console.log(' Store Updated:', newState);
      setState(newState);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Clinton's Implementation</Text>
      <Text style={styles.info}>Name: {state.name}</Text>
      <Text style={styles.info}>Age: {state.age}</Text>

      <Button
        title="Increment Age"
        onPress={() => store.dispatch({ type: 'incremented_age' })}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter a new name"
        value={inputName}
        onChangeText={setInputName}
      />
      <Button
        title="Change Name"
        onPress={() => {
          if (inputName.trim() !== '') {
            store.dispatch({ type: 'changed_name', nextName: inputName.trim() });
            setInputName('');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  header: {
    fontSize: 24, marginBottom: 20, fontWeight: 'bold'
  },
  info: {
    fontSize: 18, marginBottom: 10
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, width: '100%',
    marginTop: 20, marginBottom: 10, borderRadius: 5
  }
});
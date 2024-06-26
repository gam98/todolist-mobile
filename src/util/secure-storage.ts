import * as SecureStore from 'expo-secure-store';

export enum STORAGE {
  TODOS = 'todos',
}

export interface Todo {
  id: string;
  content: string;
  done: boolean;  
}

export async function save(key: STORAGE, value: Todo[]) {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function getValueFor(key: STORAGE) {
  const result = await SecureStore.getItemAsync(key);  
  return result ? JSON.parse(result) : [];
}
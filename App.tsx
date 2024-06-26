import { StyleSheet, Text, View, StatusBar, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import { COLOR, fontSizes, sizes, spacing } from './src/util/definitions';
import { FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { STORAGE, Todo, getValueFor, save } from './src/util/secure-storage';


export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState('');
  const [actions, setActions] = useState({
    finishTodo: true,
    deleteTodo: false,
  });

  useEffect(() => {
    getValueFor(STORAGE.TODOS)
      .then(data => setTodos(data))
      .catch(() => setTodos([]))
      .finally(() => setIsLoading(false));
  }, []);

  const addTodo = async () => {
    setTodos([...todos, { id: Date.now().toString(), content: value, done: false }]);
    await save(STORAGE.TODOS, [...todos, { id: Date.now().toString(), content: value, done: false }]);
    setValue('');
  };

  const markTodo = (id: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          done: !todo.done,
        };
      }
      return todo;
    });
    setTodos(newTodos);
    save(STORAGE.TODOS, newTodos);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={COLOR.YELLOW} />
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View>
          <Text style={styles.title}>TODO</Text>

          <View style={styles.titleWithButtonContainer}>
            <Text style={styles.subtitle}>LIST</Text>
            <View style={styles.buttonContainer}>

              <TouchableOpacity
                style={[styles.button, actions.finishTodo && styles.activeBtn]}
                onPress={() => setActions({ finishTodo: !actions.finishTodo, deleteTodo: !actions.deleteTodo })}
              >
                <MaterialCommunityIcons name="file-check" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, actions.deleteTodo && styles.activeBtn]}
                onPress={() => setActions({ finishTodo: !actions.finishTodo, deleteTodo: !actions.deleteTodo })}
              >
                <FontAwesome5 name="trash" size={20} color="black" />
              </TouchableOpacity>

            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={value}
              placeholder='What your todo...'
              placeholderTextColor={COLOR.GRAY}
              style={styles.textInput}
              onChangeText={(e) => setValue(e)}
            />
            <TouchableOpacity
              onPress={addTodo}
              style={[styles.buttonPlus, { backgroundColor: COLOR.YELLOW }]}>
              <Entypo name="plus" size={40} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() => <View>
          {
            actions.finishTodo &&
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLOR.YELLOW }]}>
              <Text style={{}}>Finish marked todos</Text>
            </TouchableOpacity>
          }
        </View>}
        data={todos}
        renderItem={({ item }) => (
          <View style={[styles.item, item.done && styles.itemDone]}>
            <Text style={styles.itemText}>{item.content}</Text>
            {
              actions.finishTodo &&
              <TouchableOpacity style={styles.actionBtn} onPress={() => markTodo(item.id)}>
                <MaterialCommunityIcons name="file-check" size={20} color="black" />
              </TouchableOpacity>
            }
            {
              actions.deleteTodo &&
              <TouchableOpacity style={styles.actionBtn}>
                <FontAwesome5 name="trash" size={20} color="black" />
              </TouchableOpacity>
            }
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSizes.xxxxxl,
    fontWeight: 'bold',
  },
  titleWithButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: fontSizes.xxxxl,
    color: COLOR.YELLOW,
    marginTop: -spacing.md,
  },
  button: {
    borderWidth: sizes.xs,
    padding: spacing.xs,
    borderRadius: spacing.s,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBtn: {
    backgroundColor: COLOR.YELLOW,
  },
  buttonPlus: {
    borderWidth: sizes.xs,
    padding: spacing.xs,
    borderRadius: spacing.m,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: sizes.md,
  },
  container: {
    padding: spacing.m
  },
  textInput: {
    borderWidth: sizes.xs,
    borderColor: COLOR.BLACK,
    borderRadius: spacing.s,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    flex: 1
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingBottom: spacing.xxl,
    borderBottomColor: COLOR.LIGHT_GRAY,
    borderBottomWidth: sizes.xs,
    marginBottom: spacing.xxl
  },
  item: {
    borderWidth: sizes.xs,
    borderRadius: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE
  },
  itemText: {
    padding: spacing.m,
    flex: 1
  },
  itemDone: {
    backgroundColor: COLOR.YELLOW
  },
  actionBtn: {
    borderTopLeftRadius: spacing.xs,
    borderBottomLeftRadius: spacing.xs,
    borderLeftWidth: sizes.xs,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.lg,
  },
  separator: {
    height: sizes.lg
  }
});

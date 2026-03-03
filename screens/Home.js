import { View, Text, StyleSheet, Button } from 'react-native';

const Home = ({ navigation }) => {
  
  const handleButtonPress = (item) => {
        // Muestra en consola la información del comando seleccionado
        navigation.navigate('Create', {
            commandId: item.id,
            commandName: item.command_name
        });
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Bot manager system</Text>
      <Button
        onPress={handleButtonPress}
        title="Run Command"
        color="#08defa"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    width: '80%',
  },
  spacer: {
    height: 10,
  },
});

export default Home;
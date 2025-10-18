import { StyleSheet } from 'react-native';

const mainStyles = StyleSheet.create({
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5, // Para Android
  },
  cardContent: {
    padding: 16,
  },
  spacer: {
    height: 10,
  },
});

export default mainStyles;
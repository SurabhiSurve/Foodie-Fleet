import * as React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, Alert, View } from 'react-native';
import MyTextInput from '../../Component/MyTextInput';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddUnit = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const [UnitName, setUnitName] = React.useState("");

  const AddUnitToFirestore = async () => {
    if (UnitName.trim() === "") {
      Alert.alert("Please enter a Unit name");
      return;
    }
    try {

      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'No logged-in user found');
        return;
      }


      await firestore()
        .collection('Unit')
        .add({
          UnitName: UnitName,
          Status: 'Active',
          UserId:user.uid 
        });
      Alert.alert("Unit added successfully!", "", [
        { text: "OK", onPress: () => {
          navigation.navigate('Unit');
          onClose(); // Close the modal
        }},
      ]);
      setUnitName(""); // Reset the input field
    } catch (error) {
      console.error("Error adding Unit to Firestore: ", error);
      Alert.alert("Error", "Failed to add Unit.");
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.headerText}>New Unit</Text>
          <MyTextInput
            placeholder="Enter Unit"
            placeholderTextColor="#888"
            fontSize={18}
            width={280}
            textAlign="left"
            onChangeText={setUnitName}
            value={UnitName}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.Addbutton} onPress={AddUnitToFirestore}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.AddbuttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    width: '80%'
  },
  headerText: {
    color: '#6200ee',
    fontSize: 24,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%'
  },
  Addbutton: {
    flex: 1,
    backgroundColor: '#00aa00',
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  button: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    borderWidth:2,
    borderColor:'grey',
    marginHorizontal: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  AddbuttonText: {
    color: 'grey',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default AddUnit;

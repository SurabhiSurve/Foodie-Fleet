import * as React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import MyTextInput from '../../Component/MyTextInput';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddProduct = ({ isVisible, onClose }) => {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [unit, setUnit] = useState('');
  const [units, setUnits] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchCategoriesAndUnits = async () => {
      const user = auth().currentUser;
      const catSnapshot = await firestore().collection('Category')
      .where("Status", "==", "Active")
      .where("UserId","==",user.uid)
      .get();
      const unitSnapshot = await firestore().collection('Unit')
      .where("Status", "==", "Active")
      .where("UserId","==",user.uid)
      .get();

      setCategories(catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setUnits(unitSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategoriesAndUnits();
  }, []);

  const handleAddProduct = async () => {
    if (!name || !description || !price || !category || !unit) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'No logged-in user found');
        return;
      }

      await firestore().collection('Product').add({
        CategoryId: category,
        CategoryName: categories.find(c => c.id === category).CategoryName,
        ProductName: name,
        Description: description,
        Price: parseFloat(price),
        Unit: unit,
        UnitName:units.find(u => u.id === unit).UnitName,
        Status:'Available',
        UserId: user.uid
      });
      Alert.alert('Product added successfully');
      onClose(); // Close the modal
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setUnit('');
    } catch (error) {
      console.error("Failed to add product:", error);
      Alert.alert('Error', 'Failed to add product');
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
          <Text style={styles.headerText}>New Product</Text>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.CategoryName} value={cat.id} />
            ))}
          </Picker>
          <MyTextInput
            placeholder="Name"
            fontSize={18}
            width={280}
            textAlign="left"
            value={name}
            onChangeText={setName}
          />
          <MyTextInput
            placeholder="Description"
            fontSize={18}
            width={280}
            textAlign="left"
            value={description}
            onChangeText={setDescription}
          />
          <MyTextInput
            placeholder="Price"
            fontSize={18}
            width={280}
            textAlign="left"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <Picker
            selectedValue={unit}
            onValueChange={setUnit}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Select Unit" value="" />
            {units.map((u) => (
              <Picker.Item key={u.id} label={u.UnitName} value={u.id} />
            ))}
          </Picker>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <Text style={styles.buttonCancelText}>Cancel</Text>
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
    backgroundColor: 'rgba ( 0, 0, 1, 1.5)'
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
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%'
  },
  button: {
    flex: 1,
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',

  },
  buttonCancel: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
    marginHorizontal: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonCancelText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  picker: {
    width: 280,
    marginTop: 20,
    fontSize: 18,
    color:'grey',
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  }
});

export default AddProduct;

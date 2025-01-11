import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MyTextInput from '../../Component/MyTextInput';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddEmployee = ({ isVisible, onClose }) => {
  const [shop, setShop] = useState('');
  const [shops, setShops] = useState([]);
  const [education, setEducation] = useState('');
  const [aadharCardNo, setAadharCardNo] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      const user = auth().currentUser;

      const shopSnapshot = await firestore()
        .collection('Shops')
        .where("Status", "==", "Open")
        .where("UserId", "==", user.uid)
        .get();

      const fetchedShops = shopSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setShops(fetchedShops);
    };

    fetchShops();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      resetForm();
    }
  }, [isVisible]);

  const resetForm = () => {
    setShop('');
    setEducation('');
    setAadharCardNo('');
    setLastName('');
    setFirstName('');
    setAddress('');
    setMobileNo('');
  };

  const validateInputs = () => {
    if (!shop) {
      Alert.alert('Please select a shop');
      return false;
    }
    if (!firstName || !lastName || !address || !education) {
      Alert.alert('Please fill all fields');
      return false;
    }
    if (!/^\d{10}$/.test(mobileNo)) {
      Alert.alert('Mobile number must be 10 digits');
      return false;
    }
    if (!/^\d{12}$/.test(aadharCardNo)) {
      Alert.alert('Aadhar card number must be 12 digits');
      return false;
    }
    return true;
  };

  const handleAddEmployee = async () => {
    if (!validateInputs()) return;

    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'No logged-in user found');
        return;
      }

      // Check if employee with same Aadhar card number already exists
      const existingAadharSnapshot = await firestore()
        .collection('Employees')
        .where('AadharCardNo', '==', aadharCardNo)
        .limit(1)
        .get();

      if (!existingAadharSnapshot.empty) {
        Alert.alert('Error', 'Employee with this Aadhar card number already exists');
        return;
      }

      // Check if employee with same mobile number already exists
      const existingMobileSnapshot = await firestore()
        .collection('Employees')
        .where('MobileNo', '==', mobileNo)
        .limit(1)
        .get();

      if (!existingMobileSnapshot.empty) {
        Alert.alert('Error', 'Employee with this mobile number already exists');
        return;
      }

      // If no duplicates found, proceed to add the new employee
      await firestore().collection('Employees').add({
        ShopId: shop,
        ShopName: shops.find(s => s.id === shop)?.ShopName || '',
        Education: education,
        AadharCardNo: aadharCardNo,
        LastName: lastName,
        FirstName: firstName,
        Address: address,
        MobileNo: mobileNo,
        Status: 'Active',
        UserId: user.uid
      });
      Alert.alert('Employee added successfully');
      onClose(); // Close the modal
      resetForm(); // Reset the form
    } catch (error) {
      console.error("Failed to add employee:", error);
      Alert.alert('Error', 'Failed to add employee');
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
          <Text style={styles.headerText}>New Employee</Text>
          <Picker
            selectedValue={shop}
            onValueChange={(value) => setShop(value)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Select Shop" value="" />
            {shops.map((shop) => (
              <Picker.Item key={shop.id} label={shop.ShopName} value={shop.id} />
            ))}
          </Picker>
          <MyTextInput
            placeholder="First Name"
            fontSize={18}
            width={280}
            textAlign="left"
            value={firstName}
            onChangeText={setFirstName}
          />
          <MyTextInput
            placeholder="Last Name"
            fontSize={18}
            width={280}
            textAlign="left"
            value={lastName}
            onChangeText={setLastName}
          />
          <MyTextInput
            placeholder="Address"
            fontSize={18}
            width={280}
            textAlign="left"
            value={address}
            onChangeText={setAddress}
          />
          <MyTextInput
            placeholder="Mobile No."
            fontSize={18}
            width={280}
            textAlign="left"
            keyboardType="numeric"
            value={mobileNo}
            onChangeText={setMobileNo}
          />
          <MyTextInput
            placeholder="Aadhar Card No."
            fontSize={18}
            width={280}
            textAlign="left"
            keyboardType="numeric"
            value={aadharCardNo}
            onChangeText={setAadharCardNo}
          />
          <MyTextInput
            placeholder="Education"
            fontSize={18}
            width={280}
            textAlign="left"
            value={education}
            onChangeText={setEducation}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddEmployee}>
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
  button: {
    flex: 1,
    backgroundColor: '#00aa00',
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'grey',
    marginHorizontal: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonCancelText: {
    color: 'grey',
    fontSize: 16,
    fontWeight: 'bold'
  },
  picker: {
    width: 280,
    marginTop: 20,
    fontSize: 18,
    color: 'grey',
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#CCC',
    borderWidth: 1,
  }
});

export default AddEmployee;
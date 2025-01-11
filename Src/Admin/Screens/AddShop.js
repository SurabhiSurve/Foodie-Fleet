import * as React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import MyTextInput from '../../Component/MyTextInput';
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddShop = ({ isVisible, onClose }) => {
  const [shopname, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [gst, setGST] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');


  const validatePinCode = (pincode) => /^\d{6}$/.test(pincode);
  const validatePhoneNumber = (phonenumber) => /^\d{10}$/.test(phonenumber);
  const validateGST = (gst) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(gst);

  const handleAddProduct = async () => {
    if (!shopname || !address || !phonenumber || !gst || !pincode || !city) {
      Alert.alert('Please fill all fields');
      return;
    }
  
    if (!validatePinCode(pincode)) {
      Alert.alert('Invalid Pin Code', 'Please enter a valid 6-digit pin code');
      return;
    }
  
    if (!validatePhoneNumber(phonenumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
      return;
    }
  
    if (!validateGST(gst)) {
      Alert.alert('Invalid GST Number', 'Please enter a valid GST number');
      return;
    }
  
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'No logged-in user found');
        return;
      }
  
      await firestore().collection('Shops').add({
        Address: address,
        City: city,
        GST: gst,
        PhoneNo: phonenumber,
        ShopName: shopname,
        pincode: parseFloat(pincode),
        Status: 'Open',
        UserId: user.uid // Save the login user ID
      });
      Alert.alert('Shop added successfully');
      onClose(); // Close the modal
      setShopName('');
      setAddress('');
      setPhoneNumber('');
      setGST('');
      setPincode('');
      setCity('');
    } catch (error) {
      console.error("Failed to add Shop:", error);
      Alert.alert('Error', 'Failed to add Shop');
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
          <Text style={styles.headerText}>New Shop</Text>
          <MyTextInput
            placeholder="Shop Name"
            fontSize={18}
            width={280}
            textAlign="left"
            value={shopname}
            onChangeText={setShopName}
          />
          <MyTextInput
            placeholder="GST No"
            fontSize={18}
            width={280}
            textAlign="left"
            value={gst}
            onChangeText={setGST}
          />
          <MyTextInput
            placeholder="Phone Number"
            fontSize={18}
            width={280}
            textAlign="left"
            keyboardType="numeric"
            value={phonenumber}
            onChangeText={setPhoneNumber}
          />
          <MyTextInput
            placeholder="Address"
            multiline
            fontSize={18}
            width={280}
            textAlign="left"
            value={address}
            onChangeText={setAddress}
          />
          <MyTextInput
            placeholder="City"
            fontSize={18}
            width={280}
            textAlign="left"
            value={city}
            onChangeText={setCity}
          />
          <MyTextInput
            placeholder="Pin Code No"
            fontSize={18}
            width={280}
            textAlign="left"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
          />

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

export default AddShop;

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
    color: 'orange',
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
    color: 'grey',
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#CCC',
    borderWidth: 1,
  },

});
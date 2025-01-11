import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MyTextInput from '../../Component/MyTextInput';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EditEmployee = ({ isVisible, onClose, employeeId }) => {
  const [shop, setShop] = useState('');
  const [shops, setShops] = useState([]);
  const [education, setEducation] = useState('');
  const [aadharCardNo, setAadharCardNo] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [originalAadharCardNo, setOriginalAadharCardNo] = useState('');
  const [originalMobileNo, setOriginalMobileNo] = useState('');

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
    if (employeeId) {
      const fetchEmployeeData = async () => {
        const employeeSnapshot = await firestore().collection('Employees').doc(employeeId).get();
        const employeeData = employeeSnapshot.data();

        setShop(employeeData.ShopId);
        setEducation(employeeData.Education);
        setAadharCardNo(employeeData.AadharCardNo);
        setLastName(employeeData.LastName);
        setFirstName(employeeData.FirstName);
        setAddress(employeeData.Address);
        setMobileNo(employeeData.MobileNo);
        setOriginalAadharCardNo(employeeData.AadharCardNo);
        setOriginalMobileNo(employeeData.MobileNo);
      };

      fetchEmployeeData();
    }
  }, [employeeId]);

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

  const handleEditEmployee = async () => {
    if (!validateInputs()) return;

    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'No logged-in user found');
        return;
      }

      // Check for duplicate Aadhar card number if it has changed
      if (aadharCardNo !== originalAadharCardNo) {
        const existingAadharSnapshot = await firestore()
          .collection('Employees')
          .where('AadharCardNo', '==', aadharCardNo)
          .limit(1)
          .get();

        if (!existingAadharSnapshot.empty) {
          Alert.alert('Error', 'Employee with this Aadhar card number already exists');
          return;
        }
      }

      // Check for duplicate mobile number if it has changed
      if (mobileNo !== originalMobileNo) {
        const existingMobileSnapshot = await firestore()
          .collection('Employees')
          .where('MobileNo', '==', mobileNo)
          .limit(1)
          .get();

        if (!existingMobileSnapshot.empty) {
          Alert.alert('Error', 'Employee with this mobile number already exists');
          return;
        }
      }

      await firestore().collection('Employees').doc(employeeId).update({
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
      Alert.alert('Employee updated successfully');
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update employee:", error);
      Alert.alert('Error', 'Failed to update employee');
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
          <Text style={styles.headerText}>Edit Employee</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleEditEmployee}>
              <Text style={styles.buttonText}>Update</Text>
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

export default EditEmployee;
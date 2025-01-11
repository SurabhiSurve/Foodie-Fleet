import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyTextInput from '../Component/MyTextInput';
const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Load data from Firestore when component mounts
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        let userQuery = firestore().collection('Users');

        if (user.email) {
          userQuery = userQuery.where("email", "==", user.email);
        } else if (user.phoneNumber) {
          userQuery = userQuery.where("mobile", "==", user.phoneNumber);
        }

        const snapshot = await userQuery.get();
        snapshot.forEach(doc => {
          const userData = doc.data();
          setUserId(doc.id);  // Store the document ID
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setEmail(userData.email);
          setMobile(userData.mobile);
          setAddress(userData.address || '');
          setCity(userData.city || '');
          setPincode(userData.pincode || '');
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleEditPress = () => {
    setIsEditMode(true);
  };

  const handleCancelPress = () => {
    setIsEditMode(false);
    loadData();  // Reload data to reset changes
  };

  const handleSavePress = async () => {
    try {
      if (userId) {
        await firestore().collection('Users').doc(userId).update({
          firstName,
          lastName,
          email,
          mobile,
          address,
          city,
          pincode,
        });
        Alert.alert("Success", "Profile updated successfully");
      } else {
        const user = auth().currentUser;
        if (user) {
          await firestore().collection('Users').add({
            firstName,
            lastName,
            email,
            mobile,
            address,
            city,
            pincode,
            uid: user.uid
          });
          Alert.alert("Success", "Profile created successfully");
        }
      }
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("Error", "There was an error updating the profile");
    }
  };

  const handleInputChange = () => {
    // Function to handle input change
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.modalView}>
        <MyTextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={text => { setFirstName(text); handleInputChange(); }}
          fontSize={18}
          width={280}
          textAlign="left"
          editable={isEditMode}
        />
        <MyTextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={text => { setLastName(text); handleInputChange(); }}
          fontSize={18}
          width={280}
          textAlign="left"
          editable={isEditMode}
        />
        <MyTextInput
          placeholder="Email"
          value={email}
          onChangeText={text => { setEmail(text); handleInputChange(); }}
          fontSize={18}
          width={280}
          textAlign="left"
          editable={isEditMode}
        />
        <MyTextInput
          placeholder="Phone Number"
          value={mobile}
          onChangeText={text => { setMobile(text); handleInputChange(); }}
          fontSize={18}
          width={280}
          textAlign="left"
          editable={isEditMode}
          keyboardType="numeric"
        />
        <MyTextInput
          placeholder="Address"
          value={address}
          onChangeText={text => { setAddress(text); handleInputChange(); }}
          fontSize={18}
          width={280}
          textAlign="left"
          editable={isEditMode}
        />
        <MyTextInput
          placeholder="City"
          value={city}
          onChangeText={text => { setCity(text); handleInputChange(); }}
          fontSize={18}
          width={280}
          textAlign="left"
          editable={isEditMode}
        />
        <MyTextInput
          placeholder="Pincode"
          value={pincode}
          onChangeText={text => { setPincode(text); handleInputChange(); }}
          fontSize={18}
          width={280}
          textAlign="left"
          keyboardType="numeric"
          editable={isEditMode}
        />
        {isEditMode ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSavePress}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancel} onPress={handleCancelPress}>
              <Text style={styles.buttonCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.edit} onPress={handleEditPress}>
            <Text style={styles.buttonText}>Click Here To Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowColor: 'orange',
    shadowOffset: { height: 2, width: 0 },
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
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
  edit: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
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
});

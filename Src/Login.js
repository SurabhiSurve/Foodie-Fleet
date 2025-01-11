import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, Image, SafeAreaView, Dimensions } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window'); // Get the width of the screen

const Login = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);


  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  // async function onGoogleButtonPress() {
  //   try {
  //     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //     const { idToken } = await GoogleSignin.signIn();
  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //     await auth().signInWithCredential(googleCredential);
  //     const userInfo = await GoogleSignin.getCurrentUser();
  //     const user = userInfo.user;

  //     // Log the user's email and name
  //     console.log('User Name: ', user.name);
  //     console.log('User Email: ', user.email);
  //     console.log('User Phone Number: ', user.phoneNumber);


  //     // await firestore().collection('Users').add({
  //     //   firstName: user.name.firstName,
  //     //   lastName: user.name.lastName,
  //     //   email: user.email,
  //     //   mobile: '',
  //     //   role: 'user'
  //     // });
  //     Alert.alert('Logged in successfully.');
  //     console.log("Signin with google!")
  //     navigation.navigate('Drawer');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }


  function getFirstAndLastName(fullName) {
    const names = fullName ? fullName.split(' ') : [''];
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');
    return { firstName, lastName };
  }


  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const signInResult = await auth().signInWithCredential(googleCredential);

      // Log the signInResult to inspect its structure
      console.log('signInResult:', signInResult);

      const user = signInResult.user;

      // Log the user object to inspect its properties
      console.log('User:', user);

      // Log individual properties to ensure they are accessible
      console.log('User UID:', user.uid);
      console.log('User Name:', user.displayName);
      console.log('User Email:', user.email);
      console.log('User Phone Number:', user.phoneNumber);

      const { firstName, lastName } = getFirstAndLastName(user.displayName);

      // Prepare the user data object
      const userData = {
        uid: user.uid, // Ensure we use user.uid
        firstName: firstName || '',
        lastName: lastName || '',
        email: user.email || '',
        mobile: user.phoneNumber || '',
        role: 'user'
      };

      // Check if the user is already registered
      const userDoc = await firestore().collection('Users').doc(user.uid).get();

      if (!userDoc.exists) {
        // Save user details to Firestore if not already registered
        await firestore().collection('Users').doc(user.uid).set(userData);
        console.log('User data saved to Firestore.');
      } else {
        console.log('User already registered in Firestore.');
      }

      // Fetch the user's role from Firestore
      const updatedUserDoc = await firestore().collection('Users').doc(user.uid).get();
      const userRole = updatedUserDoc.data().role;
      await AsyncStorage.setItem('UserRole', JSON.stringify(userRole));
      if (userRole === 'admin') {
        Alert.alert('Logged in successfully.');
        console.log("Signin with google!");
        navigation.navigate('Drawer');
      } else if (userRole === 'user') {
        Alert.alert('Logged in successfully.');
        console.log("Signin with google!");
        navigation.navigate('UserDrawer');
      } else {
        console.log('User does not have the correct role to navigate to Drawer.');
        Alert.alert('Access Denied', 'You do not have the necessary permissions to access this area.');
      }
    } catch (err) {
      console.error(err);
    }
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const userSignIn = () => {
    if (!email || !password) {
      Alert.alert('Alert', 'Please enter both email and password.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // auth().signInWithEmailAndPassword(email, password)
    //   .then(async () => {
    //     // Alert.alert('Logged in successfully.');
    //     console.log("Signin with email and password!")
    //     // Fetch the user's role from Firestore
    //     const updatedUserDoc = await firestore().collection('Users').where('email','==',email).get();
    //     const userRole = updatedUserDoc.data().role;

    //     if (userRole === 'admin') {
    //         Alert.alert('Logged in successfully.');
    //         console.log("Signin with google!");
    //         navigation.navigate('Drawer');
    //     } else if (userRole === 'user') {
    //         Alert.alert('Logged in successfully.');
    //         console.log("Signin with google!");
    //         navigation.navigate('UserDrawer');
    //     } else {
    //         console.log('User does not have the correct role to navigate to Drawer.');
    //         Alert.alert('Access Denied', 'You do not have the necessary permissions to access this area.');
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     let errorMessage;

    //     switch (error.code) {
    //       case 'auth/invalid-email':
    //         errorMessage = 'The email address is badly formatted.';
    //         break;
    //       case 'auth/user-disabled':
    //         errorMessage = 'This user has been disabled.';
    //         break;
    //       case 'auth/user-not-found':
    //         errorMessage = 'There is no user corresponding to this identifier.';
    //         break;
    //       case 'auth/wrong-password':
    //         errorMessage = 'The password is invalid or the user does not have a password.';
    //         break;
    //       case 'auth/network-request-failed':
    //         errorMessage = 'A network error has occurred, check your connection.';
    //         break;
    //       case 'auth/too-many-requests':
    //         errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
    //         break;
    //       default:
    //         errorMessage = 'Enter credentials are invalid. Please try again.';
    //     }

    //     Alert.alert('Login Failed', errorMessage);
    //   });



    auth().signInWithEmailAndPassword(email, password)
      .then(async () => {
        console.log("Signin with email and password!");

        // Fetch the user's role from Firestore
        const userQuerySnapshot = await firestore().collection('Users').where('email', '==', email).get();

        if (!userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0]; // Assuming email is unique and only one document is returned
          const userRole = userDoc.data().role;
          await AsyncStorage.setItem('UserRole', userRole);
          const value = await AsyncStorage.getItem('UserRole');
          if (userRole === 'admin') {
            Alert.alert('Logged in successfully.');
            console.log("Navigating to Drawer for admin!");
            navigation.navigate('Drawer');
          } else if (userRole === 'user') {
            Alert.alert('Logged in successfully.');
            console.log("Navigating to UserDrawer for user!");
            navigation.navigate('UserDrawer');
          } else {
            console.log('User does not have the correct role to navigate to Drawer.');
            Alert.alert('Access Denied', 'You do not have the necessary permissions to access this area.');
          }
        } else {
          console.log('No user found with the provided email.');
          Alert.alert('Login Failed', 'No user found with the provided email.');
        }
      })
      .catch(error => {
        console.error(error);
        let errorMessage;

        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'The email address is badly formatted.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This user has been disabled.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'There is no user corresponding to this identifier.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'The password is invalid or the user does not have a password.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'A network error has occurred, check your connection.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            break;
          default:
            errorMessage = 'Enter credentials are invalid. Please try again.';
        }

        Alert.alert('Login Failed', errorMessage);
      });

  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <View style={[styles.inputContainer, emailFocused ? styles.focusedInputContainer : null]}>
        <Fontisto name={"email"} size={24} color={"#9A9A9A"} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          keyboardType='email-address'
          placeholder="E-mail"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />
      </View>

      <View style={[styles.inputContainer, passwordFocused ? styles.focusedInputContainer : null]}>
        <Fontisto name={"locked"} size={24} color={"#9A9A9A"} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisibility}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <MaterialCommunityIcons name={passwordVisibility ? "eye" : "eye-off"} size={24} color={"#9A9A9A"} />
        </TouchableOpacity>
      </View>


      {/* <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.loginButton} onPress={userSignIn}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or Continue With</Text>

      <TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress}>
        <Image source={require('./assets/google.png')} style={styles.googleIcon} />
      </TouchableOpacity>

      <View style={styles.signupPrompt}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupLink}>Signup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  focusedInputContainer: {
    borderColor: '#4A90E2', // or any color you prefer
    borderBottomWidth: 2 // Adjust border width if needed
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: 'black',
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black', // Default border color
    paddingBottom: 8,
    marginBottom: 20,
    alignItems: 'center',
    width: '90%',
  },

  textInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 18,
    color: 'grey'
  },
  iconButton: {
    padding: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  forgotPasswordText: {
    color: 'black',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    paddingHorizontal: width * 0.2, // Responsive width adjustment
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  loginButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 20,
  },
  googleButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 28,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  googleIcon: {
    width: 40,
    height: 40,
  },
  signupPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: 'black',
  },
  signupLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'orange',
  }
});

export default Login;

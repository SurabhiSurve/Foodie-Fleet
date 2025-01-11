import React, { useState, useEffect } from "react";
import { Text, View, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';


const { width } = Dimensions.get('window');

const MobileLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState("");
    const [confirm, setConfirm] = useState(null);
    const navigation = useNavigation();

    const [mobileFocused, setMobileFocused] = useState(false);


    const [user, setUser] = useState("");
    function onAuthStateChanged(user) {
        if (user) {
            console.log("user", user)
        }
    }
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    });

    // async function signInWithPhoneNumber(phoneNumber) {
    //     try {
    //         // Check if the phone number is registered
    //         const userSnapshot = await firestore().collection('Users').where("mobile", "==", phoneNumber).get();
    //         if (userSnapshot.empty) {
    //             // Phone number is not registered, show alert to register
    //             Alert.alert('Phone Number Not Registered', 'Please register your mobile number.');
    //             return;
    //         }

    //         if (!phoneNumber.startsWith('+91')) {
    //             phoneNumber = '+91' + phoneNumber;
    //         }

    //         // Phone number is registered, proceed with sign in
    //         const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    //         setConfirm(confirmation);
    //     } catch (error) {
    //         console.log("error in sending code: ", error);
    //     }
    // }

    async function signInWithPhoneNumber(phoneNumber, code) {
        try {
            // Check if the phone number is registered
            const userSnapshot = await firestore().collection('Users').where("mobile", "==", phoneNumber).get();
            if (userSnapshot.empty) {
                // Phone number is not registered, show alert to register
                Alert.alert('Phone Number Not Registered', 'Please register your mobile number.');
                return;
            }
    
            // Format phone number if necessary
            if (!phoneNumber.startsWith('+91')) {
                phoneNumber = '+91' + phoneNumber;
            }
    
            // Phone number is registered, proceed with sign in
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
    
            // On confirmation, complete sign in and update Firestore
            confirmation.confirm(code).then(async (userCredential) => {
                const user = userCredential.user;
    
                // Log the user object to inspect its properties
                console.log('User:', user);
    
                // Update the user's document with the uid
                const userDocRef = firestore().collection('Users').doc(user.uid);
                await userDocRef.update({
                    uid: user.uid,
                    name: 'oj'
                });
                console.log('User uid updated in Firestore.');
    
                // Fetch the user's role from Firestore
                const updatedUserDoc = await userDocRef.get();
                const userRole = updatedUserDoc.data().role;
    
                if (userRole === 'admin') {
                    Alert.alert('Logged in successfully as admin.');
                    console.log("Signin with phone number as admin!");
                    setPhoneNumber('');
                    setCode('');
                    navigation.navigate('Drawer'); // Admin drawer
                } else if (userRole === 'user') {
                    Alert.alert('Logged in successfully as user.');
                    console.log("Signin with phone number as user!");
                    setPhoneNumber('');
                    setCode('');
                    navigation.navigate('UserDrawer'); // User drawer
                } else {
                    console.log('User role is not defined.');
                    Alert.alert('Access Denied', 'Your role is not defined.');
                }
            }).catch(error => {
                console.log('Error confirming code: ', error);
                Alert.alert('Error Confirming Code', 'There was an error confirming the verification code. Please try again.');
            });
        } catch (error) {
            console.log("Error in sending code: ", error);
            Alert.alert('Error Signing In', 'There was an error while signing in. Please try again.');
        }
    }
    
    
    

    async function confirmCode() {
        try {
            const response_data = await confirm.confirm(code);
            navigation.navigate('Drawer');
            console.log('succssful login');
        } catch (error) {
            console.log('Invalid code.');
        }
    }


    function getFirstAndLastName(fullName) {
        const names = fullName ? fullName.split(' ') : [''];
        const firstName = names[0];
        const lastName = names.slice(1).join(' ');
        return { firstName, lastName };
    }

    // async function onGoogleButtonPress() {
    //     try {
    //       await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    //       const { idToken } = await GoogleSignin.signIn();
    //       const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    //       await auth().signInWithCredential(googleCredential);
    //       const userInfo = await GoogleSignin.getCurrentUser();
    //       const user = userInfo.user;

      
    //       // Log the user's email and name
    //       console.log('User id: ', user.uid);
    //       console.log('User Name: ', user.name);
    //       console.log('User Email: ', user.email);
    //       console.log('User Phone Number: ', user.phoneNumber);
      
    //       const { firstName, lastName } = getFirstAndLastName(user.name);
      
    //       // Prepare the user data object
    //       const userData = {
    //         uid: user.uid, 
    //         firstName: firstName || '',
    //         lastName: lastName || '',
    //         email: user.email || '',
    //         mobile: user.phoneNumber || '',
    //         role: 'user'
    //       };
      
    //       // Check if the user is already registered
    //       const userDoc = await firestore().collection('Users').doc(user.uid).get(); // Use user.uid
      
    //       if (!userDoc.exists) {
    //         // Save user details to Firestore if not already registered
    //         await firestore().collection('Users').doc(user.uid).set(userData); // Use user.uid
    //         console.log('User data saved to Firestore.');
    //       } else {
    //         console.log('User already registered in Firestore.');
    //       }
      
    //       // Fetch the user's role from Firestore
    //       const updatedUserDoc = await firestore().collection('Users').doc(user.uid).get(); // Use user.uid
    //       const userRole = updatedUserDoc.data().role;
      
    //       if (userRole === 'user') {
    //         Alert.alert('Logged in successfully.');
    //         console.log("Signin with google!");
    //         navigation.navigate('Drawer');
    //       } else {
    //         console.log('User does not have the correct role to navigate to Drawer.');
    //         Alert.alert('Access Denied', 'You do not have the necessary permissions to access this area.');
    //       }
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   }
   
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
    
    
    return (
        <>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>Login to your account</Text>
                <View style={[styles.inputContainer, mobileFocused ? styles.focusedInputContainer : null]}>
                    <Fontisto name={"mobile-alt"} size={24} color={"#9A9A9A"} style={styles.inputIcon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Registered Phone Number"
                        keyboardType="numeric"
                        placeholderTextColor="#888"
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(text)}
                        onFocus={() => setMobileFocused(true)}
                        onBlur={() => setMobileFocused(false)}
                    />
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={() => signInWithPhoneNumber(phoneNumber)}>
                    <Text style={styles.loginButtonText}>Send OTP</Text>
                </TouchableOpacity>
                <TextInput style={{ color: 'black', fontSize: 20, marginTop: 10, textAlign: 'center', borderWidth: 1, borderColor: 'blue', backgroundColor: 'white', width: '30%', borderRadius: 10, }} placeholder='_ _ _ _ _ _'
                    placeholderTextColor="#888"
                    value={code}
                    onChangeText={setCode} />
                <TouchableOpacity style={styles.signinButton} onPress={confirmCode}>
                    <Text style={styles.signinButtonText}>Verify</Text>
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
            {/* <View style={styles.container}>
                <View>

                    <Text style={{
                        paddingTop: 20,
                        fontSize: 25,
                        textAlign: 'left',
                        fontWeight: '600',
                        color: 'black'
                    }}> Phone Number </Text>

                    <TextInput style={{
                        color: 'black',
                        fontSize: 20,
                        marginTop: 10,
                        paddingLeft: 20,
                        borderWidth: 0,
                        backgroundColor: 'white',
                        height: 45, width: 300,
                        borderRadius: 10,
                    }}
                        placeholder='+1 650-555-3434'
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(text)} />

                    <TouchableOpacity style={{
                        alignItems: 'center',
                        backgroundColor: '#4B62D9',
                        // padding: 5,
                        justifyContent: 'center',
                        height: 45, width: 300,
                        borderRadius: 10,
                        shadowOpacity: 0.5,
                        shadowRadius: 3,
                        shadowOffset: {
                            height: 1,
                            width: 0,
                        }
                    }}
                        onPress={() => signInWithPhoneNumber(phoneNumber)}
                    >
                        <Text style={{ color: 'white', fontSize: 25, fontWeight: '400' }}>send code</Text>
                    </TouchableOpacity>
                </View>

                <View>

                    <Text
                        style={{
                            paddingTop: 20,
                            fontSize: 25,
                            textAlign: 'left',
                            fontWeight: '600',
                            color: 'black'
                        }}>
                        Enter code </Text>

                    <TextInput style={{
                        color: 'black',
                        fontSize: 20,
                        marginTop: 10,
                        paddingLeft: 20,
                        borderWidth: 0,
                        backgroundColor: 'white',
                        height: 45, width: 300,
                        borderRadius: 10,
                        shadowOpacity: 0.5,
                        shadowRadius: 3,
                        shadowOffset: {
                            height: 2,
                            width: 0,
                        }
                    }} placeholder='Enter code'
                        value={code}
                        onChangeText={setCode} />

                    <TouchableOpacity style={{
                        alignItems: 'center',
                        backgroundColor: '#4B62D9',
                        // padding: 5,
                        justifyContent: 'center',
                        height: 45, width: 300,
                        borderRadius: 10,
                        shadowOpacity: 0.5,
                        shadowRadius: 3,
                        shadowOffset: {
                            height: 1,
                            width: 0,
                        }
                    }}
                        onPress={confirmCode}
                    >
                        <Text style={{ color: 'white', fontSize: 25, fontWeight: '400' }}>Login</Text>
                    </TouchableOpacity>

                </View>

            </View> */}
        </>
    );
}


export default MobileLogin

const styles = StyleSheet.create({
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
        color: '#4A90E2',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 20,
        color: '#4A4A4A',
        marginBottom: 50,
    },
    inputContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
        marginBottom: 10,
        alignItems: 'center', width: '80%'
    },
    loginButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        paddingHorizontal: width * 0.2, // Responsive width adjustment
        borderRadius: 25,
        marginTop: 10,
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textInput: {
        flex: 1,
        padding: 10,
        marginLeft: 10,
        fontSize: 18,
        color: 'grey'
    },
    inputIcon: {
        marginRight: 10,
    },
    signinButton: {
        marginTop: 20,
        backgroundColor: 'white',
        paddingVertical: 12,
        borderWidth: 2,
        paddingVertical: 12,
        paddingHorizontal: width * 0.2, // Responsive width adjustment
        borderRadius: 25,
        marginBottom: 20,
        borderColor: '#4A90E2',
    },
    signinButtonText: {
        color: '#4A90E2',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    orText: {
        fontSize: 16,
        color: '#4A4A4A',
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
        color: '#4A4A4A',
    },
    signupLink: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    }
});
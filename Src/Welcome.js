import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { BounceIn, BounceOutDown, FadeInDown } from "react-native-reanimated";

const Welcome = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.headerText}>Foodie</Text>
                <Text style={[styles.headerText, styles.fleetText]}>Fleet</Text>
               <Image style={styles.logo} source={require('./assets/logo.jpg')} />
                <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <Text style={styles.signInPrompt}>
                    Already have an Account ?
                </Text>
                <TouchableOpacity style={styles.signinButton} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.signinButtonText}>Sign In</Text>
                </TouchableOpacity>
                <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>By using this app, you agree to</Text>
                    <Text style={styles.termsText}>Pre Food Terms of Use and</Text>
                    <Text style={styles.termsText}>Privacy Policy.</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        marginHorizontal: 40,
        marginTop: 100,
        alignItems: 'center',
    },
    headerText: {
        color: 'black',
        fontSize: 45,
        fontWeight: 'bold',
    },
    fleetText: {
        color: 'orange',
    },
    logo: {
        marginVertical: 30,
        width: 500,
        height: 200,
        resizeMode: 'contain',
    },
    signupButton: {
        backgroundColor: 'orange',
        borderRadius: 30,
        width: 250,
        paddingVertical: 12,
        borderWidth: 0,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 2,
        borderColor: 'black',
    },
    buttonText: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    signInPrompt: {
        color: 'black',
        fontSize: 18,
        marginVertical: 20,
    },
    signinButton: {
        backgroundColor: 'orange',
        borderRadius: 30,
        width: 250,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: 'black',
    },
    signinButtonText: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    termsContainer: {
        marginTop: 40,
        alignItems:'center'
    },
    termsText: {
        color: 'black',
        fontSize: 15,
    }
});

export default Welcome;

import * as React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, TouchableOpacity } from "react-native";


const Dashboard = (props) => {
  return (
      <View style={{ backgroundColor: 'white', height: '100%' }}>
          <View style={{ marginHorizontal: 60, marginTop: 120, alignItems: 'center' }}>
              <Text style={{ color: '#1E90FF', fontSize: 50, fontWeight: 'bold' }}>
                  Let's Start
              </Text>
              <Text style={{ color: '#7F00FF', fontSize: 64, fontWeight: 'bold' }}>
                  Shopping
              </Text>

              <Image style={styles.logo} source={require('./assets/cart.png')} />
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
  },
  logo: {
      marginVertical:20,
      marginTop: 30,
      width: 200,
      height: 200,
      resizeMode: 'contain',
  },
  login: {
      backgroundColor: '#0066FF', borderRadius: 50,
      alignSelf: 'center', alignContent: 'center',
      width: 250, padding: 8, borderWidth: 2,
      borderColor: '#0066FF'
  },
  signup: {
      backgroundColor: 'white', borderRadius: 50,
      alignSelf: 'center', alignContent: 'center',
      width: 250, padding: 8, borderWidth: 2,
      borderColor: '#0066FF'
  }
})

export default Dashboard;
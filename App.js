import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './src/Welcome';
import Signup from './src/Signup';
import Login from './src/Login';
import Dashboard from './src/Dashboard';
import AddCategory from './src/Admin/Screens/AddCategory';
import AddProduct from './src/Admin/Screens/AddProduct';
import BottomBar from './src/Admin/Component/BottomBar';
import Home from './src/Admin/Screens/Home';
import Unit from './src/Admin/Screens/Unit';
import Product from './src/Admin/Screens/Product';
import Category from './src/Admin/Screens/Category';
import Shop from './src/Admin/Screens/Shop';
import AddShop from './src/Admin/Screens/AddShop';
import RequestProduct from './src/Customer/RequestProduct';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import MobileLogin from './src/MobileLogin';
import Profile from './src/Customer/Profile';
import Employee from './src/Admin/Screens/Employee';
import AddEmployee from './src/Admin/Screens/AddEmployee';
import PendingRequest from './src/Customer/PendingRequest';
import RequestHistory from './src/Customer/History';
import { blue } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

GoogleSignin.configure({
  webClientId: '1044242588477-cu65p32iftafan235ftgcgp3c3vtk29r.apps.googleusercontent.com',
  offlineAccess: true
});


const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const primaryColor = 'orange';  // Define primary color for ease of use
const backgroundColor = 'white';
const accentColor = '#333';
const whiteColor = 'black';
const borderColor = 'black';

function CustomDrawerContent(props) {

  const navigation = useNavigation(); // Use the navigation hook for navigating.

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        Alert.alert('Logout successful.');
        console.log('User signed out!');
        navigation.navigate("Login");
      })
      .catch(error => {
        Alert.alert('Logout failed.', error.message);
      });
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ flex: 1 }}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerHeaderText}>Track, Order, Enjoy!</Text>
        </View>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.drawerFooter}>
        <Button title="Sign Out" onPress={signOut} color="orange" />
      </View>
    </DrawerContentScrollView>
  );
}


const generalHeaderStyle = {
  headerStyle: {
    backgroundColor: 'orange',  // Background color of the header
  },
  headerTitleAlign: 'center',
  headerTintColor: 'black',  // Color of the header title and icons
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};


function App() {

  function DrawerNavigator() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          drawerIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Category':
                iconName = 'folder';
                break;
              case 'Product':
                iconName = 'cube';
                break;
              case 'Unit':
                iconName = 'archive';
                break;
              case 'Shop':
                iconName = 'storefront';
                break;
              case 'Requests':
                iconName = 'cart';
                break;
              // case 'Request Product':
              //   iconName = 'cart';
              //   break;
              case 'Profile':
                iconName = 'person-circle-outline';
                break;
              case 'Employee':
                iconName = 'person-add';
                break;
              default:
                iconName = 'alert-circle';
                break;
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          drawerActiveTintColor: 'orange',  // Highlight color for active drawer items
          drawerInactiveTintColor: '#333',  // Color for inactive drawer items
          drawerLabelStyle: styles.drawerLabelStyle,
          drawerItemStyle: styles.drawerItemStyle,
          drawerStyle: styles.drawerStyle,
          ...generalHeaderStyle,  // Apply general header styles here
        })}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Shop" component={Shop} />
        <Drawer.Screen name="Category" component={Category} />
        <Drawer.Screen name="Unit" component={Unit} />
        <Drawer.Screen name="Product" component={Product} />
        <Drawer.Screen name="Employee" component={Employee} />
        {/* <Drawer.Screen name="Request Product" component={RequestProduct} /> */}
        <Drawer.Screen name="Requests" component={PendingRequest} />
      </Drawer.Navigator>
    );
  }

  function UserDrawerNavigator() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          drawerIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Request Product':
                iconName = 'cart';
                break;
              case 'Profile':
                iconName = 'person-circle-outline';
                break;
              case 'Request History':
                iconName = 'bag-handle';
                break;
              default:
                iconName = 'alert-circle';
                break;
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          drawerActiveTintColor: '#72A1E5',  // Highlight color for active drawer items
          drawerInactiveTintColor: '#333',  // Color for inactive drawer items
          drawerLabelStyle: styles.drawerLabelStyle,
          drawerItemStyle: styles.drawerItemStyle,
          drawerStyle: styles.drawerStyle,
          ...generalHeaderStyle,  // Apply general header styles here
        })}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Request Product" component={RequestProduct} />
        <Drawer.Screen name="Request History" component={RequestHistory} />
        

      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="UserDrawer" component={UserDrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="mobile" component={MobileLogin} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="AddCategory" component={AddCategory} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="BottomBar" component={BottomBar} />
        <Stack.Screen name="Product" component={Product} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="AddShop" component={AddShop} />
        <Stack.Screen name="AddEmployee" component={AddEmployee} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  drawerHeader: {
    height: 140,
    backgroundColor: primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  drawerHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: whiteColor,
  },
  drawerLabelStyle: {
    fontSize: 16,
    fontWeight: '500',
  },
  drawerItemStyle: {
    marginVertical: 10,
  },
  drawerStyle: {
    backgroundColor: backgroundColor,
    width: 250,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: borderColor,
    alignItems: 'center',  // Align button to center horizontally
  },
  generalHeaderStyle: {
    headerStyle: {
      backgroundColor: primaryColor,
    },
    headerTitleAlign: 'center',
    headerTintColor: whiteColor,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});


export default App;
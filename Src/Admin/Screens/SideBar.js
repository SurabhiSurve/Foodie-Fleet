 import React from 'react';
 import { NavigationContainer } from '@react-navigation/native';
 import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import { View, StyleSheet, Text, Button, Alert } from 'react-native';
 import Icon from 'react-native-vector-icons/Ionicons';
 import AddCategory from './AddCategory';
 import AddProduct from './AddProduct';
 import Login from '../../Login';
 import Home from './Home';
 import Product from './Product';
 import Category from './Category';
 import Unit from './Unit';
 import auth from '@react-native-firebase/auth';
 import Welcome from '../../Welcome';
 import { useNavigation } from '@react-navigation/native';


 const Drawer = createDrawerNavigator();
 const Stack = createNativeStackNavigator();

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
   headerTintColor: '#fff',  // Color of the header title and icons
   headerTitleStyle: {
     fontWeight: 'bold',
   },
 };


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
             default:
               iconName = 'alert-circle';
               break;
           }
           return <Icon name={iconName} size={size} color={color} />;
         },
         drawerActiveTintColor: '#6200ee',  // Highlight color for active drawer items
         drawerInactiveTintColor: '#333',  // Color for inactive drawer items
        drawerLabelStyle: styles.drawerLabelStyle,
         drawerItemStyle: styles.drawerItemStyle,
         drawerStyle: styles.drawerStyle,
         ...generalHeaderStyle,  // Apply general header styles here
       })}
     >
       <Drawer.Screen name="Home" component={Home} />
       <Drawer.Screen name="Product" component={Product} />
       <Drawer.Screen name="Category" component={Category} />
       <Drawer.Screen name="Unit" component={Unit} />
     </Drawer.Navigator>
   );
 }



 function SideBar() {
   return (
     <NavigationContainer independent={true}>
       <Stack.Navigator
         screenOptions={{
           headerStyle: {
             backgroundColor: 'orange', // Consistent with the drawer header color
             elevation: 0,  // Remove shadow on Android
             shadowOpacity: 0,  // Remove shadow on iOS
           },
           headerTintColor: '#fff', // Color for the header title and buttons (if any)
           headerTitleStyle: {
             fontWeight: 'bold',
           },
           headerTitleAlign: 'center', // Center align the header title
           headerBackTitleVisible: false,  // On iOS, this removes the back label text
         }}
       >
//         <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
//         <Stack.Screen name="AddCategory" component={AddCategory} options={{ title: 'New Category' }} />
//         <Stack.Screen name="AddProduct" component={AddProduct} options={{ title: 'New Product' }} />
//         <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//         <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
   );
 }

 const styles = StyleSheet.create({
   drawerHeader: {
     height: 140,  // Increased height for better visual balance
     backgroundColor: '#6200ee',  // Using a more vibrant color
     alignItems: 'center',
     justifyContent: 'center',
     paddingTop: 40,  // Adjusted padding for better layout
   },
   drawerHeaderText: {
     fontSize: 24,  // Larger font size for the header text
     fontWeight: 'bold',
     color: '#ffffff',  // White color for better contrast
   },
   drawerLabelStyle: {
     fontSize: 16,
     fontWeight: '500',  // Medium font weight for better readability
   },
   drawerItemStyle: {
     marginVertical: 10,
   },
   drawerStyle: {
     backgroundColor: '#f7f7f7',
     width: 240,
   },
   drawerFooter: {
     padding: 20,
     borderTopWidth: 1,
     borderTopColor: '#ccc',
   },
 });


 export default SideBar;

// CustomDrawerContent.js
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label="Home" onPress={() => props.navigation.navigate('Home')} />
      <DrawerItem label="Profile" onPress={() => props.navigation.navigate('Profile')} />
    </DrawerContentScrollView>
  );
}
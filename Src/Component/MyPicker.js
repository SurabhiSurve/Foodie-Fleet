import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

class MyPicker extends React.Component {
  state = {
    selectedValue: this.props.initialValue || (this.props.items.length > 0 ? this.props.items[0].value : null)
  };

  onValueChange = (itemValue, itemIndex) => {
    this.setState({ selectedValue: itemValue });
    if (this.props.onValueChange) {
      this.props.onValueChange(itemValue, itemIndex);
    }
  };

  render() {
    const { items, style, mode, enabled } = this.props;
    return (
      <View style={[styles.pickerContainer, style]}>
        <Picker
          selectedValue={this.state.selectedValue}
          onValueChange={this.onValueChange}
          mode={mode || 'dropdown'}
          enabled={enabled !== false}
          style={styles.picker}
        >
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerContainer: {
    height: 40,
    marginTop: 30,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#001090',
    backgroundColor: 'white'
  },
  picker: {
    width: '100%',
    color: '#202020'
  }
});

export default MyPicker;

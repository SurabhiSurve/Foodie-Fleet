import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const BLACK = "BLACK";
const LIGHT_GRAY = "#D3D3D3";

class MyTextInput extends React.Component {
  state = {
    isFocused: false
  };

  handleFocus = event => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = event => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  render() {
    const { isFocused } = this.state;
    const { onFocus, onBlur, placeholder, fontSize, width, textAlign, autoFocus, ...otherProps } = this.props;
    return (
      <TextInput
        selectionColor={BLACK}
        underlineColorAndroid={isFocused ? BLACK : LIGHT_GRAY}
        placeholder={placeholder || 'Enter text'}
        placeholderTextColor="#888"
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        autoFocus={autoFocus}
        style={[
          styles.textInput,
          { fontSize: fontSize, width: width, textAlign: textAlign }
        ]}
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    paddingTop:3,
    paddingHorizontal: 10, width: '80%', fontSize: 20,
    backgroundColor: 'white', marginTop: 30,
    borderColor: 'black', paddingLeft: 10,
    color:'black'
  }
});

export default MyTextInput;

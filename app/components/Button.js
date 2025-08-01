import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default function Button({ mode, style, children, ...props }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        mode === "outlined" && styles.outlined,
        style,
      ]}
      {...props}
    >
      <Text style={[
        styles.text,
        mode === "outlined" && styles.outlinedText
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0072ff',
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: '#0072ff',
  },
  outlinedText: {
    color: '#0072ff',
  },
});

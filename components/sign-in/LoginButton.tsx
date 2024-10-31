import { Component, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
interface LoginButtonStyle {
  loginButtonContainer: object;
  loginButton: object;
  loginButtonText: object;
}

interface LoginButtonProps {
  loginFunction: () => Promise<void>;
  style: LoginButtonStyle;
}

export default function LoginButton({ loginFunction, style }: LoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await loginFunction();
    setLoading(false);
  };

  return (
    <View style={style.loginButtonContainer}>
      <TouchableOpacity style={style.loginButton} onPress={handleClick} disabled={loading}>
        <Text
          style={{
            opacity: loading ? 0 : 100,
          }}
        >
          Login
        </Text>
        <ActivityIndicator style={{ position: 'absolute' }} animating={loading} />
      </TouchableOpacity>
    </View>
  );
}

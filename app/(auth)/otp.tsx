import { useAuth } from "@/context/auth-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OTPScreen() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const { userid } = useLocalSearchParams();
  const otpInputRef = useRef<TextInput>(null);
  const { verifyOtp } = useAuth();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [timer, canResend]);

  const handleOtpChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setOtp(numericText);

    // Auto-verify if 6 digits are entered
    if (numericText.length === 6) {
      handleVerifyOtp(numericText);
    }
  };

  const handleVerifyOtp = async (otpValue: string = otp) => {
    if (otpValue.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const success = await verifyOtp(userid as string, otpValue);

      if (success) {
        // Navigate to dashboard
        router.replace("/(app)/dashboard");
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred during OTP verification. Please try again.",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    setOtp("");
    setTimer(60);
    setCanResend(false);
    otpInputRef.current?.focus();

    // Simulate resending OTP
    Alert.alert("Success", `OTP resent to user ${userid}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent {"\n"}to your registered phone
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>One-Time Password</Text>
            <TextInput
              ref={otpInputRef}
              style={styles.otpInput}
              placeholder="000000"
              placeholderTextColor="#999"
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="numeric"
              maxLength={6}
              editable={!loading}
              textAlign="center"
            />
            <Text style={styles.helperText}>{otp.length}/6 digits entered</Text>
          </View>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => handleVerifyOtp()}
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendSection}>
            <Text style={styles.resendLabel}>
              Didn&apos;t receive the code?
            </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendButton}>Resend OTP</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            )}
          </View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            This is a secure verification process
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  headerSection: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 24,
  },
  formSection: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  otpInput: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    fontSize: 32,
    height: 70,
    fontWeight: "600",
    letterSpacing: 10,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  verifyButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#007AFF",
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resendSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  resendLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  resendButton: {
    fontSize: 14,
    fontWeight: "600",
  },
  timerText: {
    fontSize: 14,
    opacity: 0.6,
  },
  footerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
  },
});

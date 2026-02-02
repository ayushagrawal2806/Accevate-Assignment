import { useAuth } from "@/context/auth-context";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const {
    logout,
    fetchDashboard,
    dashboardData,
    userId,
    dynamicColor,
    isLoading,
  } = useAuth();

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await fetchDashboard();
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefreshDashboard = async () => {
    try {
      setPageLoading(true);
      await fetchDashboard();
    } catch {
      Alert.alert("Error", "Failed to refresh dashboard");
    } finally {
      setPageLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  if (pageLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={{ marginTop: 10 }}>Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  const dashboard = dashboardData?.dashboard;
  const user = dashboardData?.user;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeTitle}>Welcome Back!</Text>
              <Text style={styles.subtitle}>
                {user?.name ?? "User"} ({userId ?? "N/A"})
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: dynamicColor }]}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.sectionTitle}>Dynamic Theme Color</Text>

          <View
            style={[styles.colorDisplay, { backgroundColor: dynamicColor }]}
          >
            <Text style={styles.colorValue}>{dynamicColor}</Text>
          </View>

          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: dynamicColor }]}
            onPress={handleRefreshDashboard}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons
                  name="refresh"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.refreshButtonText}>Refresh Dashboard</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <View style={[styles.statCard, { borderColor: dynamicColor }]}>
            <MaterialIcons name="payments" size={26} color={dynamicColor} />
            <Text style={styles.statValue}>
              ₹{dashboard?.amount?.Paid ?? 0}
            </Text>
            <Text style={styles.statLabel}>Paid</Text>
          </View>

          <View style={[styles.statCard, { borderColor: dynamicColor }]}>
            <MaterialIcons name="pending" size={26} color={dynamicColor} />
            <Text style={styles.statValue}>₹{dashboard?.amount?.due ?? 0}</Text>
            <Text style={styles.statLabel}>Due</Text>
          </View>
        </View>

        <View style={styles.dataSection}>
          <Text style={styles.sectionTitle}>Students</Text>

          <View
            style={[
              styles.dataCard,
              { borderColor: dynamicColor, borderWidth: 2 },
            ]}
          >
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Boys</Text>
              <Text style={styles.dataText}>
                {dashboard?.student?.Boy ?? 0}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Girls</Text>
              <Text style={styles.dataText}>
                {dashboard?.student?.Girl ?? 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View
            style={[styles.infoCard, { backgroundColor: dynamicColor + "15" }]}
          >
            <MaterialIcons name="info" size={22} color={dynamicColor} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Dynamic Dashboard</Text>
              <Text style={styles.infoText}>
                Dashboard data and theme color update dynamically from the API.
                Token expiry is handled automatically.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSection: {
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  colorDisplay: {
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  colorValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  refreshButton: {
    flexDirection: "row",
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  dataSection: {
    marginBottom: 30,
  },
  dataCard: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dataLabel: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.7,
  },
  dataText: {
    fontSize: 13,
    fontWeight: "500",
  },
  infoSection: {
    marginBottom: 30,
  },
  infoCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 18,
  },
});

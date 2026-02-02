import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = "https://aapsuj.accevate.co/flutter-api";

interface AuthContextType {
  isLoggedIn: boolean;
  isHydrated: boolean;
  userId: string | null;
  token: string | null;
  login: (
    userid: string,
    password: string,
  ) => Promise<{ status: boolean; msg: string; userid: number }>;
  verifyOtp: (userid: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  dashboardData: any;
  dynamicColor: string;
  fetchDashboard: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenExpiredResponse = (data: any) => {
  return (
    data?.status === false &&
    typeof data?.msg === "string" &&
    data.msg.toLowerCase().includes("token")
  );
};

const memoryStorage: { [key: string]: string } = {};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicColor, setDynamicColor] = useState("#007AFF");
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUserId = await AsyncStorage.getItem("userId");
        const savedToken = await AsyncStorage.getItem("authToken");

        if (savedUserId && savedToken) {
          setUserId(savedUserId);
          setToken(savedToken);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsHydrated(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userid: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, password }),
      });

      const data = await response.json();

      if (data.status) {
        memoryStorage["pendingUserid"] = data.userid.toString();
        memoryStorage["pendingPassword"] = password;
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (userid: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      console.log(userid, otp);

      const response = await fetch(`${API_BASE_URL}/verify_otp.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, otp }),
      });

      const data = await response.json();

      if (data.status && data.token) {
        await AsyncStorage.setItem("userId", userid);
        await AsyncStorage.setItem("authToken", data.token);

        setUserId(userid);
        setToken(data.token);
        setIsLoggedIn(true);

        return true;
      }

      return false;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);

      if (!token) {
        await logout();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/dashboard.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (isTokenExpiredResponse(data)) {
        await logout();
        return;
      }

      if (!data?.status) {
        throw new Error(data?.msg || "Failed to fetch dashboard");
      }

      setDashboardData(data);

      if (data?.dashboard?.color?.dynamic_color) {
        setDynamicColor(data.dashboard.color.dynamic_color);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["userId", "authToken"]);
      Object.keys(memoryStorage).forEach((k) => delete memoryStorage[k]);

      setDynamicColor("#007AFF");
      setUserId(null);
      setToken(null);
      setDashboardData(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    isLoggedIn,
    isHydrated,
    userId,
    token,
    login,
    verifyOtp,
    logout,
    isLoading,
    dynamicColor,
    dashboardData,
    fetchDashboard,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

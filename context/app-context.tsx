import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  signIn: (data: { token: string; userId: string }) => void;
  signOut: () => void;
  session?: string | null;
  userId?: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  userId: null,
  isLoading: false,
});

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem("session");
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedSession) setSession(storedSession);
        if (storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const signIn = async (data: { token: string; userId: string }) => {
    setSession(data.token);
    setUserId(data.userId);
    try {
      await AsyncStorage.setItem("session", data.token);
      await AsyncStorage.setItem("userId", data.userId);
    } catch (error) {
      console.error("Error storing session:", error);
    }
  };

  const signOut = async () => {
    setSession(null);
    setUserId(null);
    try {
      await AsyncStorage.removeItem("session");
      await AsyncStorage.removeItem("userId");
    } catch (error) {
      console.error("Error removing session:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, session, userId, isLoading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

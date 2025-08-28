import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  clearAuthState,
  // getProfile,
  refreshToken,
  setAccessToken,
} from "@/store/auth-slice";
import LoadingPage from "../common/loading-page";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  // ✅ Auto-refresh token khi app khởi động
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Nếu có user từ localStorage nhưng không có token
        if (user && !accessToken) {
          // const result = await dispatch(refreshToken()).unwrap();
          // dispatch(setAccessToken(result.accessToken));
          // await dispatch(getProfile());
          await dispatch(refreshToken()).unwrap();
        }
      } catch (error) {
        // Refresh failed → clear auth state
        dispatch(clearAuthState());
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [dispatch, user, accessToken]);

  // ✅ Tự động fetch profile nếu có accessToken mà chưa có user
  // useEffect(() => {
  //   if (accessToken && !user) {
  //     dispatch(getProfile());
  //   }
  // }, [accessToken, user, dispatch]);

  // ✅ Show loading while initializing
  if (isInitializing) {
    return <LoadingPage />;
  }

  return <>{children}</>;
}

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { clearAuthState, loginUser, logoutUser, registerUser } from '@/store/auth-slice';


export const useAuth = () => {
    const { user, accessToken, loading, error } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const login = async (credentials: { email: string; password: string }) => {
        return dispatch(loginUser(credentials)).unwrap();
    };

    const register = async (data: { name: string; email: string; password: string }) => {
        return dispatch(registerUser(data)).unwrap();
    };

    const logout = async () => {
        return dispatch(logoutUser()).unwrap();
    };

    const clearError = () => {
        dispatch(clearAuthState());
    };

    return {
        // State
        user,
        // Sau khi refresh token thành công qua interceptor → accessToken trong state sẽ có, 
        // nhưng nếu chưa call /auth/profile lại thì user có thể là null.
        isAuthenticated: !!user && !!accessToken,
        loading: loading,
        error,

        // Actions
        login,
        register,
        logout,
        clearError,
    };
};
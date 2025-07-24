import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser, setUser } from "@/store/auth-slice";
import { AppDispatch } from "@/store/store";
import { LoginFormData } from "../../store/auth-slice/auth.types";

const initialState: LoginFormData = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState<LoginFormData>(initialState);
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        const user = data.payload.user;
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
        toast.success(data.payload.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?{" "}
          <Link
            className="font-medium text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText="Sign In"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;

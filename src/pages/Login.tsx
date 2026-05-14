import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

const REMEMBERED_EMAIL_KEY = "auth.rememberedEmail";

const Login = () => {
  const { t } = useTranslation();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY));
  });

  const schema = z.object({
    email: z.string().min(1, t("login.email_required")).email(t("login.email_invalid")),
    password: z.string().min(1, t("login.password_required")),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (remembered) {
      setValue("email", remembered);
    }
  }, [setValue]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const fromPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";

  const appName = (import.meta.env.VITE_APP_NAME as string | undefined) || "Breezy Admin";

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);

      if (remember) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      navigate(fromPath, { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : t("login.invalid_credentials");
      toast.error(message || t("login.invalid_credentials"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="text-xl font-semibold tracking-tight">{appName}</div>
          <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
          <CardDescription>{t("login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("login.password")}</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  {t("login.forgot_password")}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                {t("login.remember_me")}
              </Label>
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("login.submitting")}
                </>
              ) : (
                t("login.submit")
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">{appName}</CardFooter>
      </Card>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";

const REMEMBERED_EMAIL_KEY = "auth.rememberedEmail";

const schema = z.object({
  email: z.string().min(1, "Email kerak").email("Email noto'g'ri"),
  password: z.string().min(1, "Parol kerak"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState<boolean>(() =>
    Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY)),
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? "admin@example.com",
      password: "password",
    },
  });

  if (isAuthenticated) return <Navigate to="/" replace />;

  const fromPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      if (remember) localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
      else localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      navigate(fromPath, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login muvaffaqiyatsiz");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="text-xl font-semibold tracking-tight">Breezy Starter</div>
          <CardTitle className="text-2xl">Tizimga kirish</CardTitle>
          <CardDescription>Email va parolni kiriting</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="password">Parol</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Parolni unutdingizmi?
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
                Meni eslab qol
              </Label>
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kirilmoqda…
                </>
              ) : (
                "Kirish"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          Mock auth — istalgan email/parol ishlaydi
        </CardFooter>
      </Card>
      <Toaster richColors />
    </div>
  );
}

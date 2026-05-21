import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Xush kelibsiz, {user?.name ?? "foydalanuvchi"}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Foydalanuvchilar</CardDescription>
            <CardTitle className="text-3xl">1,284</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">+12% bu oy</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tushum</CardDescription>
            <CardTitle className="text-3xl">$48,210</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">+8% bu oy</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Faol sessiyalar</CardDescription>
            <CardTitle className="text-3xl">312</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Hozir online</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Boshlash</CardTitle>
          <CardDescription>
            Bu mock dashboard. Real ma'lumot uchun service qo'shing.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Welcome guide sahifasini sidebar'dan oching — yangi sahifa qo'shish va component
          ko'chirish bo'yicha yo'riqnoma mavjud.
        </CardContent>
      </Card>
    </div>
  );
}

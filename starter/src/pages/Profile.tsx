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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Hisob va shaxsiy ma'lumotlarni boshqarish.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
          <CardDescription>Hisob va aloqa ma'lumotlarini yangilash.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">Ism</Label>
              <Input id="first-name" defaultValue={user?.name?.split(" ")[0] ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Familiya</Label>
              <Input id="last-name" defaultValue={user?.name?.split(" ")[1] ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" type="email" defaultValue={user?.email ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" defaultValue="" placeholder="O'zingiz haqida qisqacha…" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button">Saqlash</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sozlamalar</CardTitle>
          <CardDescription>Profil va xabarnomalar ko'rinishi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ommaviy profil</p>
              <p className="text-sm text-muted-foreground">Ismni jamoaga ko'rsatish.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email yangiliklar</p>
              <p className="text-sm text-muted-foreground">Xabarnomalarni email orqali olish.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

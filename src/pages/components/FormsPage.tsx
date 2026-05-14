import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocSection } from "@/components/docs/DocSection";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
  name: z.string().min(2, "Kamida 2 ta belgi kiriting."),
  email: z.string().email("Email noto'g'ri."),
  role: z.enum(["admin", "manager", "viewer"]),
});

type Values = z.infer<typeof schema>;

const FormsPage = () => {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", role: "viewer" },
  });

  const onSubmit = (values: Values) => {
    toast({
      title: "Form submitted",
      description: `${values.name} (${values.role}) saqlandi.`,
    });
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Forms</h2>
        <p className="text-muted-foreground">
          Type-safe forma: react-hook-form + zod validatsiya bilan.
        </p>
      </div>

      <DocSection
        title="Form Integration"
        description="FormField + FormControl patterni bilan controlled inputlar."
        usage="`useForm` va `zodResolver` bilan schema asosida validatsiya qiling. Har bir field uchun `FormField` render callback ishlating va xatolarni `FormMessage` bilan ko'rsating."
        typesCode={`const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "manager", "viewer"])
});
type Values = z.infer<typeof schema>;`}
        code={`const form = useForm<Values>({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "", role: "viewer" }
});`}
        demo={
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ali Valiyev" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Ruxsat darajasini belgilaydi.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="sm">
                Submit
              </Button>
            </form>
          </Form>
        }
      />
    </div>
  );
};

export default FormsPage;

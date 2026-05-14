import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { DocSection } from "@/components/docs/DocSection";

const MiscComponentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Misc Components</h2>
        <p className="text-muted-foreground">
          Qo'shimcha ko'p ishlatiladigan komponentlar to'plami.
        </p>
      </div>

      <DocSection
        title="Badge, Tabs, Toast"
        description="Status ko'rsatish, kontent bo'lish va feedback uchun."
        usage="`Badge` statuslar uchun, `Tabs` bir sahifada bo'limlash uchun, `toast` esa muvaffaqiyat/xato feedbacklari uchun ishlatiladi."
        typesCode={`type BadgeVariant = "default" | "secondary" | "destructive" | "outline";
type TabsProps = { defaultValue?: string };
type ToastInput = { title?: React.ReactNode; description?: React.ReactNode };`}
        code={`<Badge variant="secondary">Draft</Badge>

<Tabs defaultValue="preview">
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
  </TabsList>
</Tabs>

toast({ title: "Saved", description: "Changes applied." });`}
        demo={
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge>Active</Badge>
              <Badge variant="secondary">Draft</Badge>
              <Badge variant="outline">Archived</Badge>
            </div>
            <Tabs defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="text-sm text-muted-foreground">
                Preview block
              </TabsContent>
              <TabsContent value="code" className="text-sm text-muted-foreground">
                Code block
              </TabsContent>
            </Tabs>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast({
                  title: "Toast demo",
                  description: "Additional components bo'limidan xabar.",
                })
              }
            >
              Show Toast
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default MiscComponentsPage;

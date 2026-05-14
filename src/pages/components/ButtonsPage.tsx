import { Button } from "@/components/ui/button";
import { DocSection } from "@/components/docs/DocSection";

const ButtonsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Buttons</h2>
        <p className="text-muted-foreground">
          Button komponenti action, submit va icon triggerlar uchun ishlatiladi.
        </p>
      </div>

      <DocSection
        title="Button Component"
        description="Variant va size orqali har xil UI holatlarni boshqarish."
        usage="Asosiy qoida: primary action uchun default, xavfli action uchun destructive, ikkinchi darajali action uchun outline/secondary ishlating. Icon-only tugma uchun size='icon' tavsiya etiladi."
        typesCode={`export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}`}
        code={`<Button>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline" size="sm">Filter</Button>
<Button variant="destructive">Delete</Button>
<Button size="icon" aria-label="Settings">...</Button>`}
        demo={
          <div className="flex flex-wrap gap-2">
            <Button>Save</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="destructive">Delete</Button>
            <Button size="icon" aria-label="Icon button">
              +
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default ButtonsPage;

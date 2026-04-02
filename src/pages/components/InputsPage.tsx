import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocSection } from "@/components/docs/DocSection";

const InputsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inputs</h2>
        <p className="text-muted-foreground">Form input komponentlarining amaliy qo'llanmasi.</p>
      </div>

      <DocSection
        title="Input Family"
        description="Input, textarea, select, checkbox, switch, radiogroup."
        usage="`Label` bilan accessibility saqlang, `placeholder` yordamchi matn sifatida ishlating, majburiy maydonlar uchun validatsiya qo'shing. Select va radio doim oldindan aniq variantlar uchun ishlatiladi."
        typesCode={`type InputProps = React.ComponentProps<"input">;
type TextareaProps = React.ComponentProps<"textarea">;
type SelectValue = string;`}
        code={`<Input type="email" placeholder="name@company.com" />
<Textarea placeholder="Notes..." />
<Select>...</Select>
<Checkbox />
<Switch />
<RadioGroup>...</RadioGroup>`}
        demo={
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="name@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Qo'shimcha ma'lumot..." />
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Terms accepted</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="notify">Notify</Label>
                <Switch id="notify" />
              </div>
            </div>
            <RadioGroup defaultValue="monthly" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">Yearly</Label>
              </div>
            </RadioGroup>
          </div>
        }
      />
    </div>
  );
};

export default InputsPage;

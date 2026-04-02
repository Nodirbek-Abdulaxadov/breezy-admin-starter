import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DocSection } from "@/components/docs/DocSection";

const DialogsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dialogs</h2>
        <p className="text-muted-foreground">Modal va confirm flowlari uchun Dialog komponentlari.</p>
      </div>

      <DocSection
        title="Dialog & AlertDialog"
        description="CRUD modal va delete confirm holatlari."
        usage="Edit/create flow uchun `Dialog`, xavfli tasdiqlash (delete, reset) uchun `AlertDialog` ishlating. Triggerlarni `asChild` bilan mavjud buttonlarga biriktirish tavsiya etiladi."
        typesCode={`type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};`}
        code={`<Dialog>
  <DialogTrigger asChild><Button>Edit</Button></DialogTrigger>
  <DialogContent>...</DialogContent>
</Dialog>

<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>...</AlertDialogContent>
</AlertDialog>`}
        demo={
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit item</DialogTitle>
                  <DialogDescription>Bu joyga forma yoki metadata joylashadi.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete record?</AlertDialogTitle>
                  <AlertDialogDescription>Bu amal qaytarilmaydi.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />
    </div>
  );
};

export default DialogsPage;

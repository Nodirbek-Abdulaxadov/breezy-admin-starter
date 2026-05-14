import { cn } from "@/lib/utils";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn("border-t border-border px-6 py-4 text-center text-sm text-muted-foreground")}
    >
      <p>© {currentYear} AdminPanel. All rights reserved.</p>
    </footer>
  );
};

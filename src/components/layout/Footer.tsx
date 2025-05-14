
import { cn } from "@/lib/utils";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "border-t border-border py-4 px-6 text-center text-sm text-muted-foreground"
    )}>
      <p>© {currentYear} AdminPanel. All rights reserved.</p>
    </footer>
  );
};

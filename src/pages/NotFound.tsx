import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <h1 className="text-7xl font-extrabold tracking-tight">404</h1>
      <p className="mt-4 text-2xl">Page not found</p>
      <p className="mt-2 max-w-md text-center text-muted-foreground">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
};

export default NotFound;

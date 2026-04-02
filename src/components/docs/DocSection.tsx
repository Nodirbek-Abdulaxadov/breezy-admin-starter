import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const CodeBlock = ({ code }: { code: string }) => (
  <pre className="rounded-md border bg-muted p-3 text-xs overflow-x-auto">
    <code>{code}</code>
  </pre>
);

export const DocSection = ({
  title,
  description,
  usage,
  typesCode,
  code,
  demo,
}: {
  title: string;
  description: string;
  usage: string;
  typesCode: string;
  code: string;
  demo: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="rounded-md border p-3 text-sm text-muted-foreground">{usage}</div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2">
          <p className="text-sm font-medium">Types</p>
          <CodeBlock code={typesCode} />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Code</p>
          <CodeBlock code={code} />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Example</p>
          <div className="rounded-md border p-3">{demo}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

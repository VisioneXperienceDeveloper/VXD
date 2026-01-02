import { cn } from "@/lib/utils";

type TextProps = {
  text: {
    type: string;
    text?: {
      content: string;
      link: { url: string } | null;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href?: string | null;
  }[];
  className?: string;
};

export function TextRenderer({ text, className }: TextProps) {
  if (!text) {
    return null;
  }

  return (
    <span className={cn(className)}>
      {text.map((value, i) => {
        const {
          annotations: { bold, code, color, italic, strikethrough, underline },
          text,
        } = value;

        return (
          <span
            key={i}
            className={cn(
              bold ? "font-bold" : "",
              code
                ? "bg-neutral-200 dark:bg-neutral-800 rounded px-1 py-0.5 font-mono text-sm text-red-500"
                : "",
              italic ? "italic" : "",
              strikethrough ? "line-through" : "",
              underline ? "underline" : "",
              color !== "default" ? `text-${color}-500` : ""
            )}
          >
            {text?.link ? (
              <a
                href={text.link.url}
                className="underline underline-offset-2 text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noreferrer"
              >
                {text.content}
              </a>
            ) : (
              text?.content
            )}
          </span>
        );
      })}
    </span>
  );
}

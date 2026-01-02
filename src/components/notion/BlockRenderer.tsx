import { Fragment } from "react";
import { TextRenderer } from "./TextRenderer";
import { cn } from "@/lib/utils";
import Image from "next/image";

type BlockRendererProps = {
  block: any; // Using any for simplicity with Notion types, but ideally should be BlockObjectResponse
};

export function BlockRenderer({ block }: BlockRendererProps) {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p className="mb-4 text-neutral-800 dark:text-neutral-200 leading-7">
          <TextRenderer text={value.rich_text} />
        </p>
      );
    case "heading_1":
      return (
        <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          <TextRenderer text={value.rich_text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="mt-6 mb-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          <TextRenderer text={value.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="mt-4 mb-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          <TextRenderer text={value.rich_text} />
        </h3>
      );
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li className="mb-1 ml-4">
          <TextRenderer text={value.rich_text} />
        </li>
      );
    case "to_do":
      return (
        <div className="flex items-start mb-2">
          <input
            type="checkbox"
            checked={value.checked}
            readOnly
            className="mr-2 mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
          />
          <div className={cn(value.checked ? "line-through text-neutral-500" : "")}>
            <TextRenderer text={value.rich_text} />
          </div>
        </div>
      );
    case "toggle":
      return (
        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-neutral-900 dark:text-neutral-100">
            <TextRenderer text={value.rich_text} />
          </summary>
          {/* Children handling would go here if we fetched recursively */}
          <div className="ml-4 mt-2 text-neutral-600">
            {/* Placeholder for nested content */}
            (Nested content not loaded)
          </div>
        </details>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-neutral-300 pl-4 py-1 my-4 italic text-neutral-700 dark:text-neutral-300">
          <TextRenderer text={value.rich_text} />
        </blockquote>
      );
    case "callout":
      return (
        <div className="flex p-4 my-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="mr-3 text-xl">{value.icon?.emoji || "💡"}</div>
          <div className="text-neutral-900 dark:text-neutral-100">
            <TextRenderer text={value.rich_text} />
          </div>
        </div>
      );
    case "code":
      return (
        <pre className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md overflow-x-auto my-4 text-sm font-mono">
          <code className="language-{value.language}">
            <TextRenderer text={value.rich_text} />
          </code>
        </pre>
      );
    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure className="my-6">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
            {/* Using standard img tag for now to avoid Next.js Image config issues with external domains, or we can use Next Image if we configure domains later. Let's use img for simplicity in this iteration. */}
            <Image 
                src={src} 
                alt={caption || "Blog image"} 
                className="object-cover w-full h-full"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-neutral-500 mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    case "divider":
        return <hr className="my-8 border-neutral-200 dark:border-neutral-800" />;
    default:
      return (
        <div className="p-2 bg-red-50 text-red-500 text-xs mb-2">
          Unsupported block type: {type}
        </div>
      );
  }
}

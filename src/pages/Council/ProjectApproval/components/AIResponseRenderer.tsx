import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AIResponseRendererProps {
  content: string;
  className?: string;
}

const AIResponseRenderer: React.FC<AIResponseRendererProps> = ({
  content,
  className = "",
}) => {
  const renderContent = (text: string) => {
    // Split content into lines for processing
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentListItems: string[] = [];
    let currentListType: "ul" | "ol" | null = null;
    let inCodeBlock = false;

    const flushList = () => {
      if (currentListItems.length > 0 && currentListType) {
        const ListComponent = currentListType === "ul" ? "ul" : "ol";
        elements.push(
          <ListComponent
            key={elements.length}
            className="list-disc list-inside space-y-1 ml-4 mb-4"
          >
            {currentListItems.map((item, index) => (
              <li key={index} className="text-gray-700 leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ListComponent>
        );
        currentListItems = [];
        currentListType = null;
      }
    };

    const renderInlineFormatting = (text: string) => {
      // Handle bold text **text**
      let formatted = text.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-gray-900">$1</strong>'
      );

      // Handle italic text *text*
      formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

      // Handle inline code `code`
      formatted = formatted.replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
      );

      return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        flushList();
        return;
      }

      // Handle headings
      if (trimmedLine.startsWith("### ")) {
        flushList();
        const headingText = trimmedLine.substring(4);
        elements.push(
          <h3
            key={elements.length}
            className="text-xl font-bold text-gray-900 mt-6 mb-3 border-b border-gray-200 pb-2"
          >
            {renderInlineFormatting(headingText)}
          </h3>
        );
      } else if (trimmedLine.startsWith("## ")) {
        flushList();
        const headingText = trimmedLine.substring(3);
        elements.push(
          <h2
            key={elements.length}
            className="text-2xl font-bold text-gray-900 mt-8 mb-4"
          >
            {renderInlineFormatting(headingText)}
          </h2>
        );
      } else if (trimmedLine.startsWith("# ")) {
        flushList();
        const headingText = trimmedLine.substring(2);
        elements.push(
          <h1
            key={elements.length}
            className="text-3xl font-bold text-gray-900 mt-8 mb-6"
          >
            {renderInlineFormatting(headingText)}
          </h1>
        );
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(trimmedLine)) {
        if (currentListType !== "ol") {
          flushList();
          currentListType = "ol";
        }
        const listItem = trimmedLine.replace(/^\d+\.\s/, "");
        currentListItems.push(listItem);
      }
      // Handle bullet points
      else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        if (currentListType !== "ul") {
          flushList();
          currentListType = "ul";
        }
        const listItem = trimmedLine.substring(2);
        currentListItems.push(listItem);
      }
      // Handle sub-bullets (indented)
      else if (
        trimmedLine.startsWith("   - ") ||
        trimmedLine.startsWith("   * ")
      ) {
        if (currentListType !== "ul") {
          flushList();
          currentListType = "ul";
        }
        const listItem = "   " + trimmedLine.substring(5); // Keep indentation for sub-items
        currentListItems.push(listItem);
      }
      // Handle code blocks
      else if (trimmedLine.startsWith("```")) {
        flushList();
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock) {
          // End of code block - we'll handle this when we encounter the opening
        }
      }
      // Handle regular paragraphs
      else {
        flushList();

        // Check if this is a special formatted line (like **Title:** description)
        if (trimmedLine.includes("**") && trimmedLine.includes(":**")) {
          elements.push(
            <div key={elements.length} className="mb-3">
              {renderInlineFormatting(trimmedLine)}
            </div>
          );
        } else {
          elements.push(
            <p
              key={elements.length}
              className="text-gray-700 leading-relaxed mb-3"
            >
              {renderInlineFormatting(trimmedLine)}
            </p>
          );
        }
      }
    });

    // Flush any remaining list items
    flushList();

    return elements;
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="prose prose-gray max-w-none">
          {renderContent(content)}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponseRenderer;

/**
 * Utility functions for formatting AI response content
 */

export interface FormattedAIContent {
  html: string;
  plainText: string;
}

/**
 * Formats AI response content for better display
 * Converts markdown-like formatting to HTML and handles line breaks properly
 */
export function formatAIContent(content: string): FormattedAIContent {
  if (!content) {
    return { html: "", plainText: "" };
  }

  let formatted = content;

  // Handle headers (### -> h3, ## -> h2, # -> h1)
  formatted = formatted.replace(
    /### (.*?)(?=\n|$)/g,
    '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900">$1</h3>'
  );
  formatted = formatted.replace(
    /## (.*?)(?=\n|$)/g,
    '<h2 class="text-xl font-semibold mt-8 mb-4 text-gray-900">$1</h2>'
  );
  formatted = formatted.replace(
    /# (.*?)(?=\n|$)/g,
    '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h1>'
  );

  // Handle bold text (**text** -> <strong>)
  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-gray-900">$1</strong>'
  );

  // Handle italic text (*text* -> <em>)
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Handle bullet points (- item -> <li>)
  formatted = formatted.replace(
    /^- (.*?)$/gm,
    '<li class="ml-4 mb-1">• $1</li>'
  );

  // Handle numbered lists (1. item -> <li>)
  formatted = formatted.replace(
    /^\d+\.\s+(.*?)$/gm,
    '<li class="ml-4 mb-1 list-decimal">$1</li>'
  );

  // Group consecutive list items
  formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, (match) => {
    return `<ul class="mb-4 space-y-1">${match}</ul>`;
  });

  // Handle paragraphs (double line breaks)
  const paragraphs = formatted.split(/\n\s*\n/);
  formatted = paragraphs
    .map((paragraph) => {
      paragraph = paragraph.trim();
      if (!paragraph) return "";

      // Don't wrap headers or lists in paragraphs
      if (
        paragraph.startsWith("<h") ||
        paragraph.startsWith("<ul") ||
        paragraph.startsWith("<li")
      ) {
        return paragraph;
      }

      // Handle single line breaks within paragraphs
      paragraph = paragraph.replace(/\n/g, "<br/>");

      return `<p class="mb-4 text-gray-700 leading-relaxed">${paragraph}</p>`;
    })
    .filter((p) => p)
    .join("\n");

  // Clean up extra spacing
  formatted = formatted.replace(/\n\s*\n/g, "\n");
  formatted = formatted.replace(/(<\/h[1-6]>)\s*(<p)/g, "$1\n$2");
  formatted = formatted.replace(/(<\/ul>)\s*(<p)/g, "$1\n$2");

  // Handle quoted text with special styling
  formatted = formatted.replace(
    /"([^"]+)"/g,
    '<span class="italic text-blue-600 font-medium">"$1"</span>'
  );

  return {
    html: formatted,
    plainText: content,
  };
}

/**
 * Converts AI content to clean, readable HTML for display
 */
export function formatAIContentForTinyMCE(content: string): string {
  if (!content) {
    return "";
  }

  let formatted = content;

  // Handle project titles in quotes
  formatted = formatted.replace(/"([^"]+)"/g, '<strong>"$1"</strong>');

  // Handle scoring patterns (X/Y format)
  formatted = formatted.replace(/(\d+\/\d+)/g, "<strong>$1</strong>");

  // Handle headers (no inline styles, let CSS handle it)
  formatted = formatted.replace(/### (.*?)(?=\n|$)/g, "<h3>$1</h3>");
  formatted = formatted.replace(/## (.*?)(?=\n|$)/g, "<h2>$1</h2>");
  formatted = formatted.replace(/# (.*?)(?=\n|$)/g, "<h1>$1</h1>");

  // Handle bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Handle italic text
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Handle bullet points
  formatted = formatted.replace(/^- (.*?)$/gm, "<li>$1</li>");

  // Handle numbered lists
  formatted = formatted.replace(/^\d+\.\s+(.*?)$/gm, "<li>$1</li>");

  // Group consecutive list items
  formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, (match) => {
    return `<ul>${match}</ul>`;
  });

  // Split long sentences at logical points for better readability
  formatted = formatted.replace(/(\w+:)\s+/g, "$1<br/>");

  // Add line breaks after colons followed by scores
  formatted = formatted.replace(
    /(score\s+\d+\/\d+[^.]*\.)\s+/g,
    "$1<br/><br/>"
  );

  // Add line breaks after "However," and similar transition words
  formatted = formatted.replace(
    /(However,|Therefore,|Additionally,|Furthermore,|Moreover,|Nevertheless,|Consequently,)\s+/g,
    "<br/><br/>$1 "
  );

  // Add line breaks before "The" when it starts a new evaluation point
  formatted = formatted.replace(
    /\.\s+(The\s+\w+\s+(?:score|receive|is|remains))/g,
    ".<br/><br/>$1"
  );

  // Add line breaks before "Lastly," and "Overall,"
  formatted = formatted.replace(
    /(Lastly,|Overall,|Finally,)\s+/g,
    "<br/><br/>$1 "
  );

  // Handle paragraphs (double line breaks)
  const paragraphs = formatted.split(/\n\s*\n/);
  formatted = paragraphs
    .map((paragraph) => {
      paragraph = paragraph.trim();
      if (!paragraph) return "";

      // Don't wrap headers or lists in paragraphs
      if (
        paragraph.startsWith("<h") ||
        paragraph.startsWith("<ul") ||
        paragraph.startsWith("<li")
      ) {
        return paragraph;
      }

      // Handle single line breaks within paragraphs
      paragraph = paragraph.replace(/\n/g, "<br/>");

      return `<p>${paragraph}</p>`;
    })
    .filter((p) => p)
    .join("\n");

  // Clean up extra spacing
  formatted = formatted.replace(/\n\s*\n/g, "\n");
  formatted = formatted.replace(/(<\/h[1-6]>)\s*(<p)/g, "$1\n$2");
  formatted = formatted.replace(/(<\/ul>)\s*(<p)/g, "$1\n$2");

  // Clean up multiple consecutive <br/> tags
  formatted = formatted.replace(/(<br\/>\s*){3,}/g, "<br/><br/>");

  return formatted;
}

/**
 * Extracts project details from AI evaluation content
 */
export function extractProjectDetails(content: string): {
  title?: string;
  description?: string;
  keyElements?: string[];
  conclusion?: string;
} {
  const result: {
    title?: string;
    description?: string;
    keyElements?: string[];
    conclusion?: string;
  } = {};

  // Extract title
  const titleMatch = content.match(/\*\*Title:\*\*\s*(.*?)(?=\n|\*\*)/);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  // Extract description
  const descMatch = content.match(/\*\*Description:\*\*\s*(.*?)(?=\n\n|###)/s);
  if (descMatch) {
    result.description = descMatch[1].trim();
  }

  // Extract key elements
  const keyElementsMatch = content.match(/### Key Elements\s*(.*?)(?=###|$)/s);
  if (keyElementsMatch) {
    const elements = keyElementsMatch[1]
      .split(/\d+\.\s+\*\*/)
      .filter((item) => item.trim())
      .map((item) => item.replace(/\*\*/g, "").trim());
    result.keyElements = elements;
  }

  // Extract conclusion
  const conclusionMatch = content.match(/### Conclusion\s*(.*?)(?=###|$)/s);
  if (conclusionMatch) {
    result.conclusion = conclusionMatch[1].trim();
  }

  return result;
}

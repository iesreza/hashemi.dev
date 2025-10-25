/**
 * Simple markdown to HTML converter with uniform text size
 * Maintains terminal aesthetic by using colors only (no size changes)
 *
 * @param {string} markdown - The markdown string to parse
 * @returns {string} HTML string wrapped in markdown-content div
 */
export const parseMarkdown = (markdown) => {
  let html = markdown
    // Headers - convert to span with color only
    .replace(/^### (.*$)/gim, '<span class="md-h3">$1</span>')
    .replace(/^## (.*$)/gim, '<span class="md-h2">$1</span>')
    .replace(/^# (.*$)/gim, '<span class="md-h1">$1</span>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<span class="md-bold">$1</span>')
    // Lists
    .replace(/^\* (.*$)/gim, '<div class="md-li">• $1</div>')
    .replace(/^- (.*$)/gim, '<div class="md-li">• $1</div>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="md-link">$1</a>')
    // Horizontal rule
    .replace(/^---$/gim, '<div class="md-hr"></div>')
    // Italic
    .replace(/\*(.*?)\*/g, '<span class="md-italic">$1</span>')
    // Clean up multiple newlines to single break
    .replace(/\n\n+/g, '<br>')
    // Remove single newlines between block elements
    .replace(/(<\/div>)\n/g, '$1')
    .replace(/(<\/span>)\n/g, '$1<br>')
    // Remove remaining single newlines
    .replace(/\n/g, ' ')

  return `<div class="markdown-content">${html}</div>`
}

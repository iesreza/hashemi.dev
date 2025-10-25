/**
 * Utility functions for rendering GitHub activity output
 */

/**
 * Format GitHub activity results into HTML
 * @param {Array<Object>} results - Array of {account, activity} objects
 * @returns {string} - HTML string for terminal output
 */
export function formatGitHubOutput(results) {
  let output = '<div class="github-feed">'

  for (const { account, activity } of results) {
    const displayName = account === 'iesreza'
      ? '@iesreza (Personal)'
      : '@getevo (Open Source)'

    output += `<div class="github-section">`
    output += `<div class="github-header">${displayName}</div>`

    if (!activity || activity.length === 0) {
      output += '<div class="github-empty">No recent activity found</div>'
    } else {
      activity.forEach((item) => {
        output += `<div class="github-item">`
        output += `<span class="github-text">${item.text}</span>`
        output += `<span class="github-time">${item.time}</span>`
        output += `</div>`
      })
    }

    output += `</div>`
  }

  output += '<div class="github-footer">Try: <span class="cmd">github iesreza</span> or <span class="cmd">github getevo</span></div>'
  output += '</div>'

  return output
}

/**
 * Parse GitHub command arguments
 * @param {string} args - Command arguments
 * @returns {Array<string>} - Array of GitHub usernames to fetch
 */
export function parseGitHubArgs(args) {
  const username = args?.trim().toLowerCase()

  // Determine which accounts to show
  if (username === 'iesreza' || username === 'reza') {
    return ['iesreza']
  } else if (username === 'getevo' || username === 'evo') {
    return ['getevo']
  } else {
    // Show both by default
    return ['iesreza', 'getevo']
  }
}

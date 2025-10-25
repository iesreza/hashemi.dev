import { ref } from 'vue'

/**
 * Composable for fetching GitHub activity
 * Fetches public events from GitHub API with caching
 * Supports multiple GitHub accounts
 *
 * @returns {Object} - GitHub state and fetch methods
 */
export function useGitHub() {
  const githubCache = ref({
    iesreza: { data: null, timestamp: null },
    getevo: { data: null, timestamp: null }
  })

  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Calculate time ago from a date
   * @param {Date} date - The date to calculate from
   * @returns {string} - Human readable time ago (e.g., "2h ago")
   */
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return `${Math.floor(seconds / 604800)}w ago`
  }

  /**
   * Format GitHub event into display object
   * @param {Object} event - GitHub event object
   * @returns {Object} - Formatted event with icon, text, and time
   */
  const formatEvent = (event) => {
    const repo = event.repo.name
    const time = new Date(event.created_at)
    const timeAgo = getTimeAgo(time)

    switch(event.type) {
      case 'PushEvent':
        const commits = event.payload.commits?.length || 0
        return {
          icon: '📝',
          text: `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${repo}`,
          time: timeAgo
        }
      case 'WatchEvent':
        return {
          icon: '⭐',
          text: `Starred ${repo}`,
          time: timeAgo
        }
      case 'ForkEvent':
        return {
          icon: '🍴',
          text: `Forked ${repo}`,
          time: timeAgo
        }
      case 'IssuesEvent':
        return {
          icon: '🐛',
          text: `${event.payload.action} issue in ${repo}`,
          time: timeAgo
        }
      case 'PullRequestEvent':
        return {
          icon: '🔀',
          text: `${event.payload.action} PR in ${repo}`,
          time: timeAgo
        }
      case 'CreateEvent':
        return {
          icon: '✨',
          text: `Created ${event.payload.ref_type} in ${repo}`,
          time: timeAgo
        }
      case 'DeleteEvent':
        return {
          icon: '🗑️',
          text: `Deleted ${event.payload.ref_type} in ${repo}`,
          time: timeAgo
        }
      case 'ReleaseEvent':
        return {
          icon: '🚀',
          text: `Released ${event.payload.release?.tag_name} in ${repo}`,
          time: timeAgo
        }
      default:
        return {
          icon: '📌',
          text: `${event.type.replace('Event', '')} in ${repo}`,
          time: timeAgo
        }
    }
  }

  /**
   * Fetch GitHub activity for a user
   * Uses cache to reduce API calls
   * @param {string} username - GitHub username to fetch activity for
   * @returns {Array|null} - Array of formatted events or null on error
   */
  const fetchGitHubActivity = async (username) => {
    const now = Date.now()
    const cache = githubCache.value[username]

    // Return cached data if fresh
    if (cache?.data && cache?.timestamp && now - cache.timestamp < CACHE_DURATION) {
      return cache.data
    }

    try {
      const response = await fetch(`https://api.github.com/users/${username}/events/public`)

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`)
      }

      const events = await response.json()

      // Format events (take last 20)
      const formatted = events.slice(0, 20).map(formatEvent)

      // Update cache
      githubCache.value[username] = {
        data: formatted,
        timestamp: now
      }

      return formatted
    } catch (error) {
      console.error(`Failed to fetch GitHub activity for ${username}:`, error)
      return null
    }
  }

  /**
   * Fetch activity for multiple GitHub accounts
   * @param {Array<string>} usernames - Array of GitHub usernames
   * @returns {Array<Object>} - Array of {account, activity} objects
   */
  const fetchMultipleAccounts = async (usernames) => {
    const results = await Promise.all(
      usernames.map(async (account) => {
        const activity = await fetchGitHubActivity(account)
        return { account, activity }
      })
    )
    return results
  }

  return {
    githubCache,
    fetchGitHubActivity,
    fetchMultipleAccounts
  }
}

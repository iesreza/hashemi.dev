import { ref } from 'vue'

/**
 * Composable for fetching visitor IP and geolocation
 * Tries multiple IP geolocation APIs with fallback
 * Prefers IPv4 addresses over IPv6
 *
 * @returns {Object} - Visitor info state and fetch method
 */
export function useVisitorInfo() {
  const visitorInfo = ref({
    ip: '192.168.1.3',
    city: 'Milan',
    country: 'Italy'
  })

  /**
   * Check if an IP address is IPv6
   * @param {string} ip - IP address to check
   * @returns {boolean} - True if IPv6
   */
  const isIPv6 = (ip) => ip && ip.includes(':')

  /**
   * Fetch visitor information from geolocation APIs
   * Tries multiple APIs in sequence until one succeeds
   * Filters out IPv6 addresses to prefer IPv4
   */
  const fetchVisitorInfo = async () => {
    // Try multiple IP geolocation APIs in sequence, preferring IPv4
    const apis = [
      {
        url: 'https://api.ipify.org?format=json',
        parse: async (data) => {
          // First get IP from ipify (more likely to be IPv4)
          const ip = data.ip
          if (isIPv6(ip)) {
            return null // Skip if IPv6
          }
          // Then get location info
          try {
            const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json')
            const geoData = await geoResponse.json()
            return {
              ip: ip,
              city: geoData.city,
              country: geoData.country
            }
          } catch {
            return { ip: ip, city: 'Unknown', country: 'Unknown' }
          }
        }
      },
      {
        url: 'https://get.geojs.io/v1/ip/geo.json',
        parse: (data) => {
          if (isIPv6(data.ip)) {
            return null // Skip if IPv6
          }
          return {
            ip: data.ip,
            city: data.city,
            country: data.country
          }
        }
      },
      {
        url: 'https://ipapi.co/json/',
        parse: (data) => {
          if (isIPv6(data.ip)) {
            return null // Skip if IPv6
          }
          return {
            ip: data.ip,
            city: data.city,
            country: data.country_name
          }
        }
      },
      {
        url: 'https://ipwho.is/',
        parse: (data) => {
          if (isIPv6(data.ip)) {
            return null // Skip if IPv6
          }
          return {
            ip: data.ip,
            city: data.city,
            country: data.country
          }
        }
      }
    ]

    for (const api of apis) {
      try {
        const response = await fetch(api.url)
        const data = await response.json()
        const parsed = await api.parse(data)

        if (parsed) {
          visitorInfo.value = parsed
          console.log('Fetched visitor info from:', api.url, visitorInfo.value)
          return // Success, exit
        } else {
          console.log(`Got IPv6 from ${api.url}, trying next...`)
        }
      } catch (error) {
        console.log(`Failed to fetch from ${api.url}, trying next...`)
      }
    }

    // If all APIs fail, use default values
    console.log('All APIs failed, using default visitor info')
    visitorInfo.value = { ip: '192.168.1.3', city: 'Milan', country: 'Italy' }
  }

  return {
    visitorInfo,
    fetchVisitorInfo
  }
}

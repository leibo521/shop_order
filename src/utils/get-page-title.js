import defaultSettings from '@/settings'

const title = defaultSettings.title || 'shop store'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

import axios from 'axios'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

export const strapi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Fetch Open Calls
export async function getOpenCalls() {
  try {
    const response = await strapi.get('/open-calls?populate=*&sort=deadline:desc')
    return response.data.data
  } catch (error) {
    console.error('Error fetching open calls:', error)
    return []
  }
}

// Fetch Members
export async function getMembers() {
  try {
    const response = await strapi.get('/members?populate=*')
    return response.data.data
  } catch (error) {
    console.error('Error fetching members:', error)
    return []
  }
}

export async function getActivities() {
  try {
    const response = await strapi.get('/activities?populate=*&sort=date:desc')
    return response.data.data
  } catch (error) {
    console.error('Error fetching activities:', error)
    return []
  }
}

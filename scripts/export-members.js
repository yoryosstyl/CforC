/**
 * Script to export all members from Strapi to CSV
 *
 * Usage:
 * 1. Make sure you have your .env.local file with STRAPI_URL and STRAPI_API_TOKEN
 * 2. Run: node scripts/export-members.js
 * 3. Find the output in: members-export-[date].csv
 */

const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const STRAPI_URL = process.env.STRAPI_URL
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  console.error('❌ Error: STRAPI_URL and STRAPI_API_TOKEN must be set in .env.local')
  process.exit(1)
}

// Function to convert Blocks format to plain text
function convertBlocksToText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return ''
  return blocks
    .map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children
          .map(child => child.text || '')
          .join('')
      }
      return ''
    })
    .join('\n')
}

// Function to escape CSV values
function escapeCsvValue(value) {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  // If contains comma, quotes, or newlines, wrap in quotes and escape existing quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

// Function to fetch all members
async function fetchAllMembers() {
  console.log('📡 Fetching members from Strapi...')

  let allMembers = []
  let page = 1
  let pageSize = 100
  let hasMore = true

  while (hasMore) {
    const url = `${STRAPI_URL}/api/members?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[0]=Image&populate[1]=Project1Pictures&populate[2]=Project2Pictures`

    console.log(`   Fetching page ${page}...`)

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch members: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.data && data.data.length > 0) {
      allMembers = allMembers.concat(data.data)
      console.log(`   Got ${data.data.length} members (total: ${allMembers.length})`)
    }

    // Check if there are more pages
    if (data.meta && data.meta.pagination) {
      hasMore = page < data.meta.pagination.pageCount
      page++
    } else {
      hasMore = false
    }
  }

  console.log(`✅ Fetched ${allMembers.length} members total`)
  return allMembers
}

// Function to convert members to CSV
function convertToCSV(members) {
  console.log('📝 Converting to CSV format...')

  // Define CSV headers
  const headers = [
    'ID',
    'Document ID',
    'Name',
    'Email',
    'Phone',
    'City',
    'Province',
    'Fields of Work',
    'Websites',
    'Bio',
    'Profile Image URL',
    'Project 1 Title',
    'Project 1 Tags',
    'Project 1 Description',
    'Project 1 Images Count',
    'Project 2 Title',
    'Project 2 Tags',
    'Project 2 Description',
    'Project 2 Images Count',
    'Created At',
    'Updated At',
    'Published At'
  ]

  // Create CSV rows
  const rows = members.map(member => {
    // Convert Bio and project descriptions from Blocks format
    const bio = convertBlocksToText(member.Bio)
    const project1Desc = convertBlocksToText(member.Project1Description)
    const project2Desc = convertBlocksToText(member.Project2Description)

    // Get profile image URL
    const profileImageUrl = member.Image && member.Image.length > 0
      ? member.Image[0].url
      : ''

    // Count project images
    const project1ImagesCount = member.Project1Pictures ? member.Project1Pictures.length : 0
    const project2ImagesCount = member.Project2Pictures ? member.Project2Pictures.length : 0

    return [
      member.id,
      member.documentId,
      member.Name,
      member.Email,
      member.Phone,
      member.City,
      member.Province,
      member.FieldsOfWork,
      member.Websites,
      bio,
      profileImageUrl,
      member.Project1Title,
      member.Project1Tags,
      project1Desc,
      project1ImagesCount,
      member.Project2Title,
      member.Project2Tags,
      project2Desc,
      project2ImagesCount,
      member.createdAt,
      member.updatedAt,
      member.publishedAt
    ]
  })

  // Combine headers and rows
  const csvLines = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.map(escapeCsvValue).join(','))
  ]

  return csvLines.join('\n')
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting member export...\n')

    // Fetch all members
    const members = await fetchAllMembers()

    if (members.length === 0) {
      console.log('⚠️  No members found')
      return
    }

    // Convert to CSV
    const csv = convertToCSV(members)

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `members-export-${timestamp}.csv`
    const filepath = path.join(process.cwd(), filename)

    // Write to file
    fs.writeFileSync(filepath, csv, 'utf8')

    console.log(`\n✅ Export completed successfully!`)
    console.log(`📁 File saved: ${filename}`)
    console.log(`📊 Total members exported: ${members.length}`)
    console.log(`\n💡 You can now open this file in Excel, Google Sheets, or any spreadsheet application`)

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

// Run the script
main()

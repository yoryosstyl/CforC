/**
 * Script to transfer members from CforC_Members.csv to Strapi database
 *
 * This script:
 * 1. Reads CforC_Members.csv with full member data
 * 2. Creates member entries in Strapi with all provided information
 * 3. Creates auth-token records with hashed magic links
 * 4. Tracks which members were successfully transferred
 *
 * Usage: node scripts/transfer-members-to-database.js
 */

const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const STRAPI_URL = process.env.STRAPI_URL
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN
const JWT_SECRET = process.env.JWT_SECRET

if (!STRAPI_URL || !STRAPI_API_TOKEN || !JWT_SECRET) {
  console.error('❌ Error: Missing required environment variables')
  console.error('   Required: STRAPI_URL, STRAPI_API_TOKEN, JWT_SECRET')
  process.exit(1)
}

// Greek to Latin transliteration map
const greekToLatinMap = {
  'α': 'a', 'ά': 'a', 'Α': 'A', 'Ά': 'A',
  'β': 'b', 'Β': 'B',
  'γ': 'g', 'Γ': 'G',
  'δ': 'd', 'Δ': 'D',
  'ε': 'e', 'έ': 'e', 'Ε': 'E', 'Έ': 'E',
  'ζ': 'z', 'Ζ': 'Z',
  'η': 'i', 'ή': 'i', 'Η': 'I', 'Ή': 'I',
  'θ': 'th', 'Θ': 'TH',
  'ι': 'i', 'ί': 'i', 'ϊ': 'i', 'ΐ': 'i', 'Ι': 'I', 'Ί': 'I', 'Ϊ': 'I',
  'κ': 'k', 'Κ': 'K',
  'λ': 'l', 'Λ': 'L',
  'μ': 'm', 'Μ': 'M',
  'ν': 'n', 'Ν': 'N',
  'ξ': 'ks', 'Ξ': 'KS',
  'ο': 'o', 'ό': 'o', 'Ο': 'O', 'Ό': 'O',
  'π': 'p', 'Π': 'P',
  'ρ': 'r', 'Ρ': 'R',
  'σ': 's', 'ς': 's', 'Σ': 'S',
  'τ': 't', 'Τ': 'T',
  'υ': 'y', 'ύ': 'y', 'ϋ': 'y', 'ΰ': 'y', 'Υ': 'Y', 'Ύ': 'Y', 'Ϋ': 'Y',
  'φ': 'f', 'Φ': 'F',
  'χ': 'ch', 'Χ': 'CH',
  'ψ': 'ps', 'Ψ': 'PS',
  'ω': 'o', 'ώ': 'o', 'Ω': 'O', 'Ώ': 'O',
  'αι': 'ai', 'ει': 'ei', 'οι': 'oi', 'ου': 'ou',
  'αυ': 'av', 'ευ': 'ev', 'ηυ': 'iv',
  'μπ': 'b', 'ντ': 'd', 'γκ': 'g', 'γγ': 'ng',
  'τσ': 'ts', 'τζ': 'tz'
}

function transliterate(text) {
  let result = text
  const multiChar = ['αι', 'ει', 'οι', 'ου', 'αυ', 'ευ', 'ηυ', 'μπ', 'ντ', 'γκ', 'γγ', 'τσ', 'τζ', 'θ', 'χ', 'ψ', 'ξ']
  multiChar.forEach(combo => {
    const regex = new RegExp(combo, 'gi')
    result = result.replace(regex, (match) => greekToLatinMap[match] || match)
  })
  result = result.split('').map(char => greekToLatinMap[char] || char).join('')
  return result
}

function generateSlug(name) {
  let slug = transliterate(name)
  slug = slug.toLowerCase()
  slug = slug
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug
}

// Parse CSV line respecting quoted fields
function parseCSVLine(line) {
  const parts = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ';' && !inQuotes) {
      parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Push the last part
  parts.push(current.trim())

  return parts
}

// Parse CSV content (format: Name;Slug;Profile Image;Tags;Email;Phone;Website;Website - Extra;Website - Extra 02;Biography)
function parseCSV(content) {
  const lines = content.trim().split('\n')
  const members = []

  for (let i = 1; i < lines.length; i++) { // Skip header
    const line = lines[i].trim()
    if (!line) continue

    // Parse CSV line respecting quotes
    const parts = parseCSVLine(line)

    if (parts.length < 10) {
      console.warn(`⚠️  Skipping malformed line ${i + 1}: expected 10 fields, got ${parts.length}`)
      continue
    }

    const name = parts[0]?.trim()
    const slug = parts[1]?.trim()
    const profileImage = parts[2]?.trim()
    const tags = parts[3]?.trim() // Format: "tag1; tag2; tag3"
    const email = parts[4]?.trim()
    const phone = parts[5]?.trim()
    const website1 = parts[6]?.trim()
    const website2 = parts[7]?.trim()
    const website3 = parts[8]?.trim()
    const biography = parts[9]?.trim() // HTML format

    if (!email || !name) {
      console.warn(`⚠️  Skipping line ${i + 1}: missing email or name`)
      continue
    }

    // Combine websites into comma-separated string
    const websites = [website1, website2, website3].filter(w => w && w !== '').join(', ')

    members.push({
      name,
      slug: slug || generateSlug(name),
      profileImage,
      tags,
      email,
      phone: phone || '-',
      websites: websites || '-',
      biography
    })
  }

  return members
}

// Convert HTML biography to Strapi blocks format
function htmlToBioBlocks(html) {
  if (!html || html === '') {
    return []
  }

  // Simple conversion: extract text from HTML paragraphs
  const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gs) || []

  return paragraphs.map(p => {
    // Remove HTML tags but keep basic formatting
    const text = p
      .replace(/<p[^>]*>/g, '')
      .replace(/<\/p>/g, '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, '') // Remove all other HTML tags
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .trim()

    return {
      type: 'paragraph',
      children: [{ type: 'text', text }]
    }
  }).filter(block => block.children[0].text !== '')
}

// Create member in Strapi with full data
async function createMemberInStrapi(memberData) {
  const bioBlocks = htmlToBioBlocks(memberData.biography)

  const strapiData = {
    data: {
      Name: memberData.name,
      Slug: memberData.slug,
      Email: memberData.email,
      Phone: memberData.phone,
      Websites: memberData.websites,
      Bio: bioBlocks,
      FieldsOfWork: memberData.tags || '-',
      City: '-',
      Province: '-',
      Project1Title: '',
      Project1Description: [],
      Project1Tags: '',
      Project2Title: '',
      Project2Description: [],
      Project2Tags: ''
    }
  }

  const response = await fetch(`${STRAPI_URL}/api/members`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(strapiData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Strapi error: ${error.error?.message || response.statusText}`)
  }

  return await response.json()
}

// Upload profile image from URL to Strapi
async function uploadProfileImage(imageUrl, memberId, memberName) {
  if (!imageUrl || imageUrl === '') {
    return null
  }

  try {
    // Download image from URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const blob = new Blob([imageBuffer])

    // Determine file extension from URL
    const urlPath = new URL(imageUrl).pathname
    const extension = path.extname(urlPath) || '.jpg'
    const filename = `${memberName.replace(/\s+/g, '_')}${extension}`

    // Create form data
    const formData = new FormData()
    formData.append('files', blob, filename)
    formData.append('ref', 'api::member.member')
    formData.append('refId', memberId.toString())
    formData.append('field', 'Image')

    // Upload to Strapi
    const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      },
      body: formData
    })

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`)
    }

    return await uploadResponse.json()
  } catch (error) {
    console.warn(`   ⚠️  Image upload failed: ${error.message}`)
    return null
  }
}

// Generate magic link JWT token
function generateMagicLinkToken(memberId, email) {
  const payload = {
    memberId,
    email,
    type: 'magic-link'
  }

  const options = {
    expiresIn: '6h'
  }

  return jwt.sign(payload, JWT_SECRET, options)
}

// Hash token function
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// Create auth-token record in Strapi
async function generateMagicLink(email, memberId) {
  const token = generateMagicLinkToken(memberId.toString(), email)
  const tokenHash = hashToken(token)
  const expiryTime = new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours

  const response = await fetch(`${STRAPI_URL}/api/auth-tokens`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        email: email,
        tokenHash: tokenHash,
        tokenExpiry: expiryTime.toISOString(),
        tokenType: 'magic-link'
      }
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to create auth token: ${error.error?.message || response.statusText}`)
  }

  return token
}

// Main transfer function
async function transferMember(memberData) {
  console.log(`\n📧 Processing: ${memberData.email} (${memberData.name})`)

  try {
    // Step 1: Create member in Strapi
    console.log('   Creating member in Strapi...')
    const member = await createMemberInStrapi(memberData)
    const memberId = member.data.id
    console.log(`   ✅ Member created (ID: ${memberId})`)

    // Step 2: Upload profile image if provided
    if (memberData.profileImage) {
      console.log('   Uploading profile image...')
      await uploadProfileImage(memberData.profileImage, memberId, memberData.name)
      console.log('   ✅ Profile image uploaded')
    }

    // Step 3: Generate magic link
    console.log('   Generating magic link token...')
    const token = await generateMagicLink(memberData.email, memberId)
    console.log('   ✅ Magic link generated')

    return { success: true, email: memberData.email, memberId, token }

  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`)
    return { success: false, email: memberData.email, error: error.message }
  }
}

// Main execution
async function main() {
  const csvPath = path.resolve(__dirname, 'CforC_Members.csv')

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Error: File not found: ${csvPath}`)
    process.exit(1)
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8')
  const members = parseCSV(csvContent)

  if (members.length === 0) {
    console.error('❌ Error: No members found to transfer')
    process.exit(1)
  }

  console.log(`🚀 Starting member database transfer...`)
  console.log(`📊 Total members to transfer: ${members.length}\n`)

  const results = []

  for (const member of members) {
    const result = await transferMember(member)
    results.push(result)

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Save magic link tokens to file for email sending script
  const tokensData = results
    .filter(r => r.success)
    .map(r => ({
      email: r.email,
      token: r.token
    }))

  fs.writeFileSync(
    path.resolve(__dirname, 'magic-link-tokens.json'),
    JSON.stringify(tokensData, null, 2)
  )

  // Summary
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  console.log('\n' + '='.repeat(60))
  console.log('📊 TRANSFER SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Successfully transferred: ${successful}`)
  console.log(`❌ Failed: ${failed}`)

  if (failed > 0) {
    console.log('\n❌ Failed members:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.email}: ${r.error}`)
    })
  }

  console.log('\n💾 Magic link tokens saved to: magic-link-tokens.json')
  console.log('✨ Transfer process complete!')
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

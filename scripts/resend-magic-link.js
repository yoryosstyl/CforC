/**
 * Resend Magic Link Script
 *
 * Regenerates and sends a new magic link for an existing member.
 * Usage: node scripts/resend-magic-link.js <email>
 */

const jwt = require('jsonwebtoken')
const crypto = require('crypto')
require('dotenv').config({ path: '.env.local' })

const STRAPI_URL = process.env.STRAPI_URL
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN
const JWT_SECRET = process.env.JWT_SECRET
const RESEND_API_KEY = process.env.RESEND_API_KEY

// Validate environment variables
if (!STRAPI_URL || !STRAPI_API_TOKEN || !JWT_SECRET || !RESEND_API_KEY) {
  console.error('❌ Missing required environment variables')
  console.error('Required: STRAPI_URL, STRAPI_API_TOKEN, JWT_SECRET, RESEND_API_KEY')
  process.exit(1)
}

// Generate JWT token for magic link
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

// Hash token for database storage
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// Find member by email
async function findMemberByEmail(email) {
  const response = await fetch(
    `${STRAPI_URL}/api/members?filters[Email][$eq]=${encodeURIComponent(email)}`,
    {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to find member: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.data || data.data.length === 0) {
    throw new Error(`No member found with email: ${email}`)
  }

  return data.data[0]
}

// Generate and store magic link token
async function generateMagicLink(email, memberId) {
  // Generate JWT token
  const token = generateMagicLinkToken(memberId.toString(), email)
  const tokenHash = hashToken(token)
  const expiryTime = new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours

  // First, update existing auth-token for this email to clear password and set as magic-link
  console.log('   Cleaning up old tokens...')
  const existingTokensResponse = await fetch(
    `${STRAPI_URL}/api/auth-tokens?filters[email][$eq]=${encodeURIComponent(email)}`,
    {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  )

  let authTokenId = null

  if (existingTokensResponse.ok) {
    const existingTokens = await existingTokensResponse.json()
    if (existingTokens.data && existingTokens.data.length > 0) {
      // Update the existing token instead of creating a new one
      const existingToken = existingTokens.data[0]
      authTokenId = existingToken.documentId || existingToken.id

      console.log('   Updating existing auth-token...')
      const updateResponse = await fetch(`${STRAPI_URL}/api/auth-tokens/${authTokenId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            tokenHash: tokenHash,
            tokenExpiry: expiryTime.toISOString(),
            tokenType: 'magic-link',
            passwordHash: null // Clear the password
          }
        })
      })

      if (!updateResponse.ok) {
        const error = await updateResponse.json()
        throw new Error(`Failed to update auth token: ${error.error?.message || updateResponse.statusText}`)
      }

      return token
    }
  }

  // Create new auth-token record
  console.log('   Creating new magic link token...')
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

// Send magic link email
async function sendMagicLinkEmail(email, name, token) {
  const magicLink = `https://www.cultureforchange.gr/auth/set-password?token=${token}`

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #E8845C 0%, #D67355 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
    .button { display: inline-block; background: #E8845C; color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
    .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🔑 Νέος Σύνδεσμος Ορισμού Κωδικού</h1>
    </div>

    <div class="content">
      <p>Γεια σου${name && name !== 'Νέο Μέλος' ? ` ${name}` : ''}!</p>

      <p>Ζήτησες νέο σύνδεσμο για να ορίσεις τον κωδικό σου στη νέα ιστοσελίδα Culture for Change.</p>

      <div style="text-align: center;">
        <a href="${magicLink}" class="button">
          Ορισμός Κωδικού Πρόσβασης
        </a>
      </div>

      <div class="warning">
        <p style="margin: 0;"><strong>⚠️ Σημαντικό:</strong></p>
        <ul style="margin: 5px 0;">
          <li>Ο σύνδεσμος λήγει σε <strong>6 ώρες</strong></li>
          <li>Έλεγξε τον φάκελο <strong>SPAM</strong> αν δεν βρεις το email</li>
        </ul>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Αν δεν ζήτησες εσύ αυτόν τον σύνδεσμο, παράβλεψε αυτό το email.
      </p>
    </div>

    <div class="footer">
      Culture for Change<br>
      <a href="https://www.cultureforchange.gr" style="color: #E8845C;">www.cultureforchange.gr</a>
    </div>
  </div>
</body>
</html>
`

  const emailText = `
🔑 ΝΕΟΣ ΣΥΝΔΕΣΜΟΣ ΟΡΙΣΜΟΥ ΚΩΔΙΚΟΥ

Γεια σου${name && name !== 'Νέο Μέλος' ? ` ${name}` : ''}!

Ζήτησες νέο σύνδεσμο για να ορίσεις τον κωδικό σου στη νέα ιστοσελίδα Culture for Change.

Κάνε κλικ στον παρακάτω σύνδεσμο:
${magicLink}

⚠️ ΣΗΜΑΝΤΙΚΟ:
- Ο σύνδεσμος λήγει σε 6 ώρες

Αν δεν ζήτησες εσύ αυτόν τον σύνδεσμο, παράβλεψε αυτό το email.

Η ομάδα του Culture for Change
`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Culture for Change <noreply@cultureforchange.gr>',
      to: email,
      subject: '🔑 Νέος Σύνδεσμος Ορισμού Κωδικού - Culture for Change',
      html: emailHtml,
      text: emailText
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Resend error: ${error.message || response.statusText}`)
  }

  return await response.json()
}

// Main function
async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error('Usage: node scripts/resend-magic-link.js <email>')
    process.exit(1)
  }

  console.log('🔄 Resending magic link...\n')
  console.log(`📧 Email: ${email}`)

  try {
    // Find the member
    console.log('\n1️⃣ Finding member in Strapi...')
    const member = await findMemberByEmail(email)
    console.log(`   ✅ Found member: ${member.Name} (ID: ${member.id}, documentId: ${member.documentId})`)

    // Generate new magic link
    console.log('\n2️⃣ Generating new magic link...')
    const token = await generateMagicLink(email, member.id)
    console.log('   ✅ Magic link token generated')

    // Send email
    console.log('\n3️⃣ Sending email...')
    await sendMagicLinkEmail(email, member.Name, token)
    console.log('   ✅ Email sent successfully!')

    console.log('\n✨ Done! Check your email for the magic link.')

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`)
    process.exit(1)
  }
}

main()

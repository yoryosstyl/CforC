import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const STRAPI_URL = process.env.STRAPI_URL
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Μη εξουσιοδοτημένος χρήστης' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(sessionToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Μη έγκυρη σύνοδος' },
        { status: 401 }
      )
    }

    const memberId = payload.memberId

    // Parse the request - could be FormData (with image) or JSON
    const contentType = request.headers.get('content-type') || ''
    let updateData: any = {}
    let imageFile: File | null = null

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (image upload)
      const formData = await request.formData()

      // Extract text fields
      const fields = ['Name', 'Bio', 'FieldsOfWork', 'City', 'Province', 'Email', 'Phone', 'Websites']
      fields.forEach(field => {
        const value = formData.get(field)
        if (value !== null) {
          updateData[field] = value
        }
      })

      // Extract image if present
      const image = formData.get('image')
      if (image && image instanceof File) {
        imageFile = image
      }
    } else {
      // Handle JSON
      updateData = await request.json()
    }

    // Validate required fields
    if (updateData.Name !== undefined && !updateData.Name.trim()) {
      return NextResponse.json(
        { error: 'Το όνομα είναι υποχρεωτικό' },
        { status: 400 }
      )
    }

    if (updateData.Email !== undefined && !updateData.Email.trim()) {
      return NextResponse.json(
        { error: 'Το email είναι υποχρεωτικό' },
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (updateData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.Email)) {
      return NextResponse.json(
        { error: 'Μη έγκυρη διεύθυνση email' },
        { status: 400 }
      )
    }

    // Handle image upload if present
    let imageId: number | null = null
    if (imageFile) {
      const imageFormData = new FormData()
      imageFormData.append('files', imageFile)

      const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        },
        body: imageFormData
      })

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()
        if (uploadResult && uploadResult.length > 0) {
          imageId = uploadResult[0].id

          // Get current member to remove old image
          const currentMemberResponse = await fetch(
            `${STRAPI_URL}/api/members/${memberId}?populate=Image`,
            {
              headers: {
                'Authorization': `Bearer ${STRAPI_API_TOKEN}`
              }
            }
          )

          if (currentMemberResponse.ok) {
            const currentMember = await currentMemberResponse.json()
            const oldImages = currentMember.data?.Image

            // Delete old images
            if (oldImages && Array.isArray(oldImages)) {
              for (const img of oldImages) {
                if (img.id) {
                  await fetch(`${STRAPI_URL}/api/upload/files/${img.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${STRAPI_API_TOKEN}`
                    }
                  })
                }
              }
            }
          }

          // Add new image to update data
          updateData.Image = [imageId]
        }
      }
    }

    // Update member in Strapi
    const updateResponse = await fetch(`${STRAPI_URL}/api/members/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      },
      body: JSON.stringify({
        data: updateData
      })
    })

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      console.error('Strapi update error:', errorData)
      return NextResponse.json(
        { error: 'Αποτυχία ενημέρωσης προφίλ' },
        { status: 500 }
      )
    }

    // Fetch updated member with populated fields
    const memberResponse = await fetch(
      `${STRAPI_URL}/api/members/${memberId}?populate=Image,Projects`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    )

    if (!memberResponse.ok) {
      return NextResponse.json(
        { error: 'Αποτυχία ανάκτησης ενημερωμένου προφίλ' },
        { status: 500 }
      )
    }

    const memberData = await memberResponse.json()
    const member = memberData.data

    // Transform member data for response
    const transformedMember = {
      id: member.id,
      documentId: member.documentId,
      Name: member.Name,
      Email: member.Email,
      Bio: member.Bio,
      FieldsOfWork: member.FieldsOfWork,
      City: member.City,
      Province: member.Province,
      Phone: member.Phone,
      Websites: member.Websites,
      Image: member.Image && Array.isArray(member.Image) && member.Image.length > 0
        ? member.Image.map((img: any) => ({
            url: img.url.startsWith('http') ? img.url : `${STRAPI_URL}${img.url}`,
            alternativeText: img.alternativeText
          }))
        : undefined,
      Projects: member.Projects
    }

    return NextResponse.json({
      success: true,
      message: 'Το προφίλ ενημερώθηκε επιτυχώς',
      member: transformedMember
    })

  } catch (error) {
    console.error('Member update error:', error)
    return NextResponse.json(
      { error: 'Σφάλμα διακομιστή' },
      { status: 500 }
    )
  }
}

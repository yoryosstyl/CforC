import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Clear session cookie
    const cookieStore = await cookies()
    cookieStore.delete('cforc_session')

    return NextResponse.json({
      success: true,
      message: 'Επιτυχής αποσύνδεση'
    })

  } catch (error) {
    console.error('Error in logout:', error)
    return NextResponse.json(
      { error: 'Κάτι πήγε στραβά' },
      { status: 500 }
    )
  }
}

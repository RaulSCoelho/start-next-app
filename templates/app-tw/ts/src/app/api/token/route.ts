import { NextRequest, NextResponse } from 'next/server'

import { privateRoutesMiddleware } from '../middleware'

export async function GET(req: NextRequest) {
  const { payload, error } = await privateRoutesMiddleware(req)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(payload)
}

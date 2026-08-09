import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#0C0E14',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F4B942',
          borderRadius: 6,
          fontWeight: 800,
          border: '1px solid #2A2D42',
        }}
      >
        A
      </div>
    ),
    {
      ...size,
    }
  )
}

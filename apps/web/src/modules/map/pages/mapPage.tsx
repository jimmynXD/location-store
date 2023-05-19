import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useMemo, useState } from 'react'
import { PlacesAutocomplete } from '../components'
import clsx from 'clsx'
import Link from 'next/link'

export function MapPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  })
  const [selected, setSelected] = useState(null)

  const center = useMemo(() => ({ lat: 49.2827291, lng: -123.1207375 }), [])

  if (!isLoaded) return <div>loading...</div>

  const options: google.maps.MapOptions = {
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_LEFT,
    },
  }
  return (
    <div className="h-screen relative">
      <div
        className={clsx(
          'fixed top-2 left-2 right-2 z-10',
          'lg:w-full lg:max-w-[400px]'
        )}
      >
        <PlacesAutocomplete setSelected={setSelected} />
        <div className="absolute -bottom-2 lg:bottom-[unset] translate-y-full lg:translate-y-0 lg:-right-2 lg:top-0 lg:translate-x-full">
          <Link
            href="/"
            className={clsx(
              'transition-all h-12',
              'flex items-center px-4 rounded-sm text-lg',
              'bg-white shadow',
              'hover:bg-gray-100'
            )}
          >
            <span>My List</span>
          </Link>
        </div>
      </div>
      <GoogleMap
        options={options}
        mapContainerClassName="w-full h-full"
        center={selected ?? center}
        zoom={selected ? 15 : 10}
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </div>
  )
}

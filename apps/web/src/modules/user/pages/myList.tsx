import { PageLayout } from '@/meta'
import { useEffect, useState } from 'react'
import { ReadDbProps, readDb } from '@/api/routes'
import clsx from 'clsx'
import { calcTimeElapsed } from '../utils'
import Link from 'next/link'
import { PlacesAutocomplete } from '~/modules/map/components'
import { useLoadScript } from '@react-google-maps/api'

export function MyList() {
  const [myResponse, setMyResponse] = useState<ReadDbProps>({
    data: [],
  })
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  })

  const [selected, setSelected] = useState()
  useEffect(() => {
    readDb((data) => {
      setMyResponse({ data })
    })
  }, [])

  if (!isLoaded) return <div>loading...</div>

  return (
    <PageLayout title="My List" className="bg-gray-300 pt-4">
      <div className="z-10 sticky top-0 px-4">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>
      <header className="pt-4 px-8 pb-2">
        <div className="pt-4 flex items-center justify-between">
          <button className="text-sm flex items-center space-x-1">
            <span>Sort</span>
            <span className={clsx('material-symbols-rounded text-base', {})}>
              sort
            </span>
          </button>
          <Link
            href="/map"
            className={clsx(
              'transition-all',
              'text-sm flex items-center space-x-1',
              'px-4 py-1 border bg-green-800/10 text-green-800 border-green-800 rounded-full',
              'hover:bg-green-800 hover:text-white'
            )}
          >
            <span>Map</span>
            <span className="material-symbols-rounded text-base">map</span>
          </Link>
        </div>
      </header>
      <main className="py-4 px-8 space-y-4">
        {myResponse.data?.map((res, index) => {
          const dateAdded = new Date(res.createdAt)

          return (
            <div
              key={index}
              className={clsx(
                'relative',
                'p-4 rounded shadow',
                'bg-white',
                'text-sm'
              )}
            >
              <div className="flex items-start">
                <div className="mr-1">
                  <div
                    className={clsx('transition-all', {
                      'text-gray-400 ': !res.visited,
                      'text-green-700': res.visited,
                    })}
                  >
                    <span
                      className={clsx('material-symbols-rounded ', {
                        fill: res.visited,
                      })}
                    >
                      {res.visited ? 'beenhere' : 'notifications'}
                    </span>
                  </div>
                </div>
                <Link className="flex-1" href={res.website ?? ''}>
                  <h2 className="text-base font-medium">{res.name}</h2>
                </Link>
                <aside
                  className={clsx('pl-4 flex items-baseline', {
                    'text-red-700': !res.visited,
                    'text-green-700': res.visited,
                  })}
                >
                  <span className="material-symbols-rounded text-xs">add</span>
                  <span>{calcTimeElapsed(dateAdded)}</span>
                </aside>
              </div>
              <div className="pt-2">{res.formatted_address}</div>
              <div className="text-gray-700">
                <span>{res.rating}</span>{' '}
                <span>({res.user_ratings_total})</span>
              </div>
              <div className="flex items-center justify-end">
                <button
                  className={clsx(
                    'transition-all relative h-8',
                    'before:absolute before:-left-2 before:top-1/2 before:-translate-x-full before:-translate-y-1/2 before:content-["visited?_"] before:leading-0',
                    {
                      'text-gray-400 ': !res.visited,
                      'text-green-700': res.visited,
                    }
                  )}
                >
                  <span
                    className={clsx(
                      'material-symbols-rounded text-[32px] leading-0',
                      {
                        fill: res.visited,
                      }
                    )}
                  >
                    {res.visited ? 'toggle_on' : 'toggle_off'}
                  </span>
                </button>
              </div>
            </div>
          )
        })}
      </main>
    </PageLayout>
  )
}

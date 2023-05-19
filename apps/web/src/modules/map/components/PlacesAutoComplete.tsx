import type { ChangeEvent } from 'react'
import { KeyboardEvent, useState } from 'react'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails,
} from 'use-places-autocomplete'
import useOnclickOutside from 'react-cool-onclickoutside'
import clsx from 'clsx'
import { PostPlace, RestaurantStoreWithoutId } from './PostPlace'

interface PlacesAutocompleteProps {
  setSelected: React.Dispatch<React.SetStateAction<any>>
}

type Suggestion = google.maps.places.AutocompletePrediction
type PlaceResults = google.maps.places.PlaceResult
type PlaceGeometry = google.maps.places.PlaceGeometry
type PlaceLatLng = google.maps.LatLng
export function PlacesAutocomplete({ setSelected }: PlacesAutocompleteProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: 'initMap',
    cache: 24 * 60 * 60,
    requestOptions: {
      types: ['establishment'],
    },
  })

  const [currIndex, setCurrIndex] = useState<number | null>(null)

  let cachedVal = ''

  const hasSuggestions = status === 'OK'

  const setLatLong = (description: string) => {
    getGeocode({ address: description }).then((results) => {
      const { lat, lng } = getLatLng(results[0])
      setSelected({ lat, lng })
    })
  }

  function placeDetail({ place_id }: Suggestion) {
    const parameter = {
      placeId: place_id,
      fields: [
        'name',
        'business_status',
        'formatted_address',
        'price_level',
        'website',
        'rating',
        'user_ratings_total',
        'geometry',
      ],
    }

    getDetails(parameter)
      .then((details) => {
        console.log(details)
        const {
          name,
          business_status,
          formatted_address,
          price_level,
          website,
          rating,
          user_ratings_total,
          geometry,
          url,
        } = details as PlaceResults
        console.log('deee', details)
        const { location } = geometry as PlaceGeometry
        console.log(place_id, location?.lat())
        const mapDetails: RestaurantStoreWithoutId = {
          place_id: place_id ?? '',
          name: name ?? '',
          business_status: business_status ?? '',
          formatted_address: formatted_address ?? '',
          price_level: price_level ?? null,
          website: website ?? null,
          google_map_url: url ?? null,
          rating: rating ?? null,
          user_ratings_total: user_ratings_total ?? null,
          lat: location?.lat() ?? null,
          lng: location?.lng() ?? null,
        }
        console.log('mapDetails', mapDetails)
        PostPlace(mapDetails)
      })
      .catch((error) => {
        console.log('Error: ', error)
      })
  }

  const dismissSuggestions = () => {
    setCurrIndex(null)
    clearSuggestions()
  }

  const clearInput = () => {
    setValue('')
    dismissSuggestions()
  }

  const ref = useOnclickOutside(dismissSuggestions)

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    cachedVal = e.target.value
  }

  const handleSelect = (props: Suggestion) => () => {
    setValue(props.description, false)
    setLatLong(props.description)
    placeDetail(props)
    dismissSuggestions()
  }

  const handleEnter = (idx: number) => () => {
    setCurrIndex(idx)
  }

  const handleLeave = () => {
    setCurrIndex(null)
  }
  const acceptedKeys = ['ArrowUp', 'ArrowDown', 'Escape', 'Enter']

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!hasSuggestions || !acceptedKeys.includes(e.key)) return

    if (e.key === 'Escape') {
      dismissSuggestions()
      return
    }

    let nextIndex: number | null

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = currIndex ?? data.length
      nextIndex = nextIndex && nextIndex > 0 ? nextIndex - 1 : null
    } else {
      nextIndex = currIndex ?? -1
      nextIndex = nextIndex < data.length - 1 ? nextIndex + 1 : null
    }

    if (e.key === 'Enter' && currIndex !== null) {
      setLatLong(data[currIndex].description)
      dismissSuggestions()
      // blur the input
      e.currentTarget.blur()
      return
    }

    setCurrIndex(nextIndex)
    // @ts-ignore
    setValue(data[nextIndex] ? data[nextIndex].description : cachedVal, false)
  }

  const renderSuggestions = (): JSX.Element => {
    const suggestions = data.map((suggestion: Suggestion, idx: number) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion

      return (
        <li key={place_id} aria-selected={idx === currIndex}>
          <button
            id={`ex-list-item-${idx}`}
            onClick={handleSelect(suggestion)}
            onMouseEnter={handleEnter(idx)}
            role="option"
            className={clsx(
              'w-full px-4 py-2 flex flex-col',
              'text-left text-sm',
              {
                'bg-gray-100': idx === currIndex,
              }
            )}
          >
            <span>{main_text}</span>
            <span className="text-gray-700 text-xs">{secondary_text}</span>
          </button>
        </li>
      )
    })

    return <ul>{suggestions}</ul>
  }

  return (
    <div
      ref={ref}
      className={clsx('relative', 'h-12 flex rounded', 'bg-white', {
        'rounded-b-none': hasSuggestions,
      })}
      role="combobox"
      aria-owns="ex-list-box"
      aria-haspopup="listbox"
      aria-expanded={hasSuggestions}
    >
      <input
        className={clsx(
          'w-full pl-4 pr-8 outline-none shadow',
          'bg-transparent'
        )}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={!ready}
        placeholder="Search restaurants..."
        type="text"
        aria-autocomplete="list"
        aria-controls="ex-list-box"
        aria-activedescendant={
          currIndex !== null ? `ex-list-item-${currIndex}` : undefined
        }
      />
      {/** clear input button */}
      {value && (
        <button
          className="absolute right-0 inset-y-0 w-8 text-center"
          onClick={() => clearInput()}
        >
          <span className="material-symbols-rounded fill text-xl leading-none text-gray-500">
            cancel
          </span>
        </button>
      )}
      {hasSuggestions && (
        <div
          className={clsx(
            'z-10 shadow-lg absolute bottom-0 translate-y-full w-full',
            'max-h-72 overflow-y-auto',
            'bg-white border-t border-gray-200 rounded-b'
          )}
          id="ex-list-box"
          onMouseLeave={handleLeave}
          role="listbox"
        >
          {renderSuggestions()}
        </div>
      )}
    </div>
  )
}

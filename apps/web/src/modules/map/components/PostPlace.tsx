import { RestaurantStore } from '@prisma/client'

// Omit 'id', 'createdAt', and 'updatedAt' from the type
export type OmitIdCreatedAtUpdatedAt<T> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>

// Usage example: omit 'id', 'createdAt', and 'updatedAt' from RestaurantStore
export type RestaurantStoreWithoutId = OmitIdCreatedAtUpdatedAt<RestaurantStore>

export async function PostPlace(props: RestaurantStoreWithoutId) {
  const body: RestaurantStoreWithoutId = { ...props }
  try {
    const response = await fetch('/api/restaurant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.status !== 200) {
      console.log('something went wrong')
    } else {
      console.log('submitted')
    }
  } catch (error) {
    console.log('there was an error submitting', error)
  }
}

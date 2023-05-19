import { RestaurantStore } from '@prisma/client'

export interface ReadDbProps {
  data: RestaurantStore[]
}

export const readDb = async (getData: (data: RestaurantStore[]) => void) => {
  try {
    const response = await fetch('/api/restaurant', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = (await response.json()) as ReadDbProps

    if (response.status !== 200) {
      console.log('something went wrong')
    } else {
      console.log('data found!')
      getData(data.data)
    }
  } catch (error) {
    console.log('there was an error submitting', error)
  }
}

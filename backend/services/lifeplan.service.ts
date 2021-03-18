import axios from 'axios'

const headers = {
  Authorization: `Bearer ${process.env.LIFEPLAN_API_TOKEN}`
}

//due to imitations queries the first page of activties from lifeplan, but only returns the total count from pages metadata.
export const getTotalCount = async (processingStatus: string): Promise<number> => {
  const params = {
    processing_status: processingStatus,
  }

  const res = await axios.get(
    process.env.LIFEPLAN_API_URL || '',
    {
      params,
      headers
    }
  )

  return res.data?.meta?.total
}

//recursively gets all activities from paginated results from lifeplan
export const getActivities = async (processingStatus: string, activities: Array<any> = [], page = 1): Promise<Array<any>> => {
  const params = {
    processing_status: processingStatus,
    page: page
  }

  const res = await axios.get(
    process.env.LIFEPLAN_API_URL || '',
    {
      params,
      headers
    }
  )

  activities = activities.concat(res.data.data)

  if (res.data?.meta?.last_page > page) {
    return getActivities(processingStatus, activities, page + 1)
  }

  return activities
}


//patches activity's status on lifeplan backend to unprocessed
export const resetActivity = async (id: string): Promise<number> => {
  const payload = {
    processing_status: 'unprocessed'
  }

  const res = await axios.patch(
    process.env.LIFEPLAN_API_URL ? `${process.env.LIFEPLAN_API_URL}/${id}` : '',
    payload,
    {
      headers
    }
  )

  return res.data.id
}
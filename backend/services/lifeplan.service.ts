import axios from 'axios'

const headers = {
  Authorization: `Bearer ${process.env.LIFEPLAN_API_TOKEN}`
}

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
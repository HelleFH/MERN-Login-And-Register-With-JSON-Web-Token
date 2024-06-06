import axiosInstance from "./axiosInstance";


const getFollowUpEntriesByDateAndId = async (date, userID) => {
  try {
    const response = await axiosInstance.get(`/entries/follow-up/date/${date}?userID=${userID}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No entries found for the date and username, return an empty array
      return [];
    } else {
      throw error;
    }
  }
};

export default getFollowUpEntriesByDateAndId;
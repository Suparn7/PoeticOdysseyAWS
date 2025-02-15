// This file contains extracted functions for fetching author information and toggling the theme, providing meaningful names for better readability.

import dynamoUserInformationService from "../aws/dynamoUserInformationService";

export const fetchAuthorInfo = async (userId, setAuthor, setLoading, setFadeOut) => {
    try {
      const user = await dynamoUserInformationService.getUserInfoByUserNameId(userId);
      setAuthor(user); // Set the author in state
    } catch (error) {
      console.error("Failed to fetch author:", error);
    } finally {
      setFadeOut(true); // Start fade out effect
      setTimeout(() => setLoading(false), 500); // Delay to allow fade out to complete
    }
  };
  
  export const toggleTheme = (isDarkTheme, setIsDarkTheme) => {
    setIsDarkTheme(!isDarkTheme);
  };
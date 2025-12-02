import { badgesApi } from '../lib/api';

export const checkAndAwardBadges = async (userId: string) => {
  try {
    const response = await badgesApi.checkAndAward();
    return response.badgesAwarded || 0;
  } catch (error) {
    console.error('Error checking badges:', error);
    return 0;
  }
};

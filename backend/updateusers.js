export const updateUser = async (userId, updates) => {
  // Only keep fields relevant to the user model
  const allowedUpdates = {};
  if (updates.teamName !== undefined) allowedUpdates.teamName = updates.teamName;
  if (updates.budget !== undefined) allowedUpdates.budget = updates.budget;

  return handleApi(API.put(`/users/${userId}`, allowedUpdates));
};

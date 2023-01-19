import { httpClient } from 'api';
import { ShortUser } from 'model';

export const getVotedUsers = async (id: string): Promise<ShortUser[]> => {
  const { data: votedUsers } = await httpClient.get<ShortUser[]>(
    `/meetups/${id}/votedusers`,
  );
  return votedUsers;
};

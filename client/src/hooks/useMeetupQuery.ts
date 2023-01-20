import { getMeetup } from 'api';
import { AxiosError } from 'axios';
import { MeetupDto } from 'model';
import { useEffect, useState } from 'react';

type UseMeetupQueryResult = {
  meetup?: MeetupDto;
  error?: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export const useMeetupQuery = (
  id: string | null | undefined,
): UseMeetupQueryResult => {
  const [meetup, setMeetup] = useState<MeetupDto | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!id) {
        setIsError(true);
        setError('Не задан id митапа!');
        return;
      }

      setIsLoading(true);

      try {
        setMeetup(await getMeetup(id));
        setIsSuccess(true);
      } catch (error) {
        setIsError(true);

        const status = (error as AxiosError).response?.status;
        switch (status) {
          case 404:
            setError('Митап не найден!');
            break;
          default:
            setError('Что-то пошло не так!');
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  return {
    meetup,
    error,
    isLoading,
    isSuccess,
    isError,
  };
};

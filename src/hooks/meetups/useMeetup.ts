import { getMeetup } from 'api';
import { AxiosError } from 'axios';
import { Meetup } from 'model';
import { useEffect, useState } from 'react';

type UseMeetupResult = {
  meetup?: Meetup | null;
  isLoading: boolean;
  error: string | null;
}

export function useMeetup(id: string) : UseMeetupResult {
  const [meetup, setMeetup] = useState<Meetup | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        setMeetup(await getMeetup(id));
      }
      catch(e) {
        const error = e as AxiosError;
        const status = error.response?.status;

        switch(status){
          case 404:
            setError('Митап не найден!');
            setMeetup(null);
            break;
          default:
            setError('Что-то пошло не так!');
        }
      }
      finally {
        setIsLoading(false);
      }
    })();
  }, [id]);


  return {
    meetup,
    isLoading,
    error,
  };
}
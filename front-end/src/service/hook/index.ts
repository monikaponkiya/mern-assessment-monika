import {
  MutationFunction,
  MutationKey,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery
} from '@tanstack/react-query';

import { IApiError } from '../../utils/types';

/* custom hook useFetch will use useQuery to fetch data from server */
interface QueryConfig<T> {
  queryKey?: QueryKey;
  queryFn: QueryFunction<T>;
  queryOptions?: Omit<UseQueryOptions<T, IApiError, T, QueryKey>, 'queryKey' | 'queryFn'>;
}

type QueryResult<T> = UseQueryResult<T, IApiError>;

const useFetch = <T>({ queryKey = [], queryFn, queryOptions }: QueryConfig<T>): QueryResult<T> => {
  return useQuery<T, IApiError, T, QueryKey>(
    queryKey,
    queryFn,
    queryOptions as UseQueryOptions<T, IApiError, T, QueryKey>
  );
};
/* custom hook useFetch logic end */

/* custom hook useRequest will use useMutation to send data to server */
interface MutationConfig<T, P> {
  mutationKey?: MutationKey;
  mutationFn: MutationFunction<T, P>;
  mutationOptions?: Omit<UseMutationOptions<T, IApiError, P>, 'mutationKey' | 'mutationFn'>;
}

type MutationResult<T, P> = UseMutationResult<T, IApiError, P>;

const useRequest = <T, P>({
  mutationKey = [],
  mutationFn,
  mutationOptions
}: MutationConfig<T, P>): MutationResult<T, P> => {
  return useMutation<T, IApiError, P>(
    mutationKey,
    mutationFn,
    mutationOptions as UseMutationOptions<T, IApiError, P>
  );
};
/* custom hook useRequest logic end */

export { useFetch, useRequest };

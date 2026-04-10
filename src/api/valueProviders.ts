import { useSuspenseQuery } from '@tanstack/react-query'

import ValueProvider from 'models/ValueProvider'

import valueProviderData from './valueProviderSrc.json'

export const useValueProviders = (): ValueProvider[] => {
  return useSuspenseQuery({
    queryKey: ['valueProviders'],
    queryFn: () => valueProviderData as unknown as ValueProvider[],
  }).data
}

import { z } from "zod"
import { Route } from "@tanstack/react-router"
import { brandsRoute } from "../router"
import { brandQueryOptions } from "../api"
import { useSuspenseQuery } from "@tanstack/react-query"

export const brandDetailsRoute = new Route({
  getParentRoute: () => brandsRoute,
  path: "$brandId",
  parseParams: (params) => ({
    brandId: z.number().int().parse(Number(params.brandId)),
  }),
  stringifyParams: ({ brandId }) => ({ brandId: `${brandId}` }),
  loader: ({ context: { queryClient }, params: { brandId } }) =>
    queryClient.ensureQueryData(brandQueryOptions(brandId)),
  component: BrandsDetailRouteComponent,
  pendingComponent: () => <BrandDetailRouteSkeleton />,
})

function BrandDetailRouteSkeleton() {
  return <div>todo: brand detail route skeleton...</div>
}

function BrandsDetailRouteComponent() {
  const { brandId } = brandDetailsRoute.useParams()
  const brandQuery = useSuspenseQuery(brandQueryOptions(brandId))
  const brand = brandQuery.data

  return (
    <div>
      <p>brands detail route component</p>
      <pre>{JSON.stringify(brand, null, 2)}</pre>
    </div>
  )
}

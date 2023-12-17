import { useCallback, useState } from "react"
import { DataTable } from "@/components/data-table"
import { TableColumn } from "react-data-table-component"
import { BrandSummary } from "./types"
import {
  PaginatedList,
  apiClient,
  getPaginationMetadata,
} from "@/lib/api-client"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

async function getBrandSummaryListing(page: number, pageSize: number) {
  const res = await apiClient.get<BrandSummary[]>(
    `/brands?PageNumber=${page}&PageSize=${pageSize}`
  )

  return {
    result: res.data,
    paginationMetadata: getPaginationMetadata(res),
  } as PaginatedList<BrandSummary>
}

const summaryColumns: TableColumn<BrandSummary>[] = [
  {
    name: "Name",
    sortable: true,
    selector: (row) => row.name,
  },
  {
    name: "Created",
    sortable: true,
    selector: (row) => new Date(row.createdAt).toLocaleString(),
  },
  {
    name: "Modified",
    sortable: true,
    selector: (row) =>
      row.modifiedAt ? new Date(row.modifiedAt).toLocaleString() : "-",
  },
  {
    name: "Food Count",
    sortable: true,
    selector: (row) => row.foodCount,
  },
]

export const BrandSummaryListing = () => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const fetchBrandSummaryListing = useQuery({
    queryKey: ["brand-summary-list", page, perPage],
    queryFn: () => getBrandSummaryListing(page, perPage),
    placeholderData: keepPreviousData,
  })

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handlePerPageChange = (perPage: number, currentPage: number) => {
    setPage(currentPage)
    setPerPage(perPage)
  }

  const brandSummaries = fetchBrandSummaryListing.data?.result ?? []

  return (
    <div>
      <DataTable
        title="Brands"
        columns={summaryColumns}
        data={brandSummaries}
        highlightOnHover
        pagination
        paginationServer
        paginationTotalRows={
          fetchBrandSummaryListing.data?.paginationMetadata?.totalCount
        }
        progressPending={fetchBrandSummaryListing.isPending}
        selectableRows
        onChangeRowsPerPage={handlePerPageChange}
        onChangePage={handlePageChange}
      />
    </div>
  )
}

// export const BrandSummaryListing = () => {
//   const state = useGetBrandSummaryListing()
//   const [selectedRows, setSelectedRows] = useState<BrandSummary[]>()

//   const handleSelectedRowsChange = useCallback(
//     (tableState: { selectedRows: BrandSummary[] }) =>
//       setSelectedRows(tableState.selectedRows),
//     []
//   )

//   const contextActions = useMemo(() => {
//     return <Button variant="destructive">Delete</Button>
//   }, [])

//   if (state.isError) {
//     return <div>error: {state.error.message}</div>
//   }

//   if (state.isLoading) {
//     return <div>loading...</div>
//   }

//   return (
//     <div>
//       <DataTable
//         title="Brands"
//         columns={summaryColumns}
//         contextActions={contextActions}
//         data={state.data ?? []}
//         highlightOnHover
//         pagination
//         selectableRows
//         onSelectedRowsChange={handleSelectedRowsChange}
//       />
//     </div>
//   )
// }

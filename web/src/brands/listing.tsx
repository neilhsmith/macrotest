import { useState } from "react"
import {
  BRAND_LISTING_QUERY_KEY,
  BrandSummaryDto,
  deleteBrands,
  useBrandListingQuery,
  useDeleteBrandsMutation,
} from "./api"
import {
  DataTable,
  DeleteContextActions,
  SelectedRowsChangeEventPayload,
} from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { TableColumn } from "react-data-table-component"
import { BRAND_ROUTES } from "./routes"
import { queryClient } from "@/lib/query-client"
import { useMutation } from "@tanstack/react-query"
import { ApiError } from "@/api/api-client"
import toast from "react-hot-toast"

const tableColumns: TableColumn<BrandSummaryDto>[] = [
  {
    name: "Name",
    sortable: true,
    selector: (row) => row.name,
  },
  {
    name: "Food Count",
    sortable: true,
    selector: (row) => row.foodCount,
  },
  {
    name: "Created",
    sortable: true,
    selector: (row) => new Date(row.createdAt).toLocaleString(),
  },
  {
    name: "Modified",
    sortable: true,
    selector: (row) => (row.modifiedAt ? new Date(row.modifiedAt).toLocaleString() : "-"),
  },
  {
    button: true,
    cell: (row) => (
      <Link to={BRAND_ROUTES.DETAIL.buildPath({ id: row.id })} className="text-blue-500">
        Edit
      </Link>
    ),
  },
]

export const BrandListing = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [selected, setSelected] = useState<BrandSummaryDto[]>([])
  const [clearSelectedToggled, setClearSelectedToggled] = useState(false)

  const brandlistingQuery = useBrandListingQuery({ page, pageSize })
  const deleteBrandsMutation = useMutation<void, ApiError, number[]>({
    mutationFn: (ids) => deleteBrands({ ids }),
    onSuccess: (_, ids) => {
      toast.success(`Deleted ${ids.length} Brand${ids.length > 1 ? "s" : ""}.`)
      setClearSelectedToggled(!clearSelectedToggled)
      queryClient.invalidateQueries({ queryKey: [BRAND_LISTING_QUERY_KEY, page, pageSize] })
    },
    onError: () => toast.error("Something went wrong. Please try again later."),
  })

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handlePerPageChange = (perPage: number, currentPage: number) => {
    setPage(currentPage)
    setPageSize(perPage)
  }

  const handleSelectedRowsChange = ({
    selectedRows,
  }: SelectedRowsChangeEventPayload<BrandSummaryDto>) => {
    setSelected(selectedRows)
  }

  const handleDeleteClick = async () => {
    const selectedIds = selected.map((b) => b.id)
    deleteBrandsMutation.mutate(selectedIds)
  }

  const disabled = deleteBrandsMutation.isPaused
  const brandSummaries = brandlistingQuery.data?.items ?? []
  const brandsCount = brandlistingQuery.data?.paginationMetadata?.totalCount

  return (
    <div>
      <DataTable
        title={<Header />}
        columns={tableColumns}
        data={brandSummaries}
        disabled={disabled}
        clearSelectedRows={clearSelectedToggled}
        contextActions={
          <DeleteContextActions
            disabled={disabled}
            loading={deleteBrandsMutation.isPending}
            selectedItemCount={selected.length}
            onClick={handleDeleteClick}
          />
        }
        highlightOnHover
        pagination
        paginationServer
        paginationTotalRows={brandsCount}
        progressPending={brandlistingQuery.isPending}
        selectableRows
        onChangeRowsPerPage={handlePerPageChange}
        onChangePage={handlePageChange}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
    </div>
  )
}

function Header() {
  return (
    <div className="flex justify-between items-center">
      <div>Brands</div>
      <Button size="sm" variant="secondary" asChild>
        <Link to="/brands/create">Create Brand</Link>
      </Button>
    </div>
  )
}

import { useState } from "react"
import { BRAND_ROUTES } from "./routes"
import { BrandSummaryDto, useBrandListingQuery, useDeleteBrandsMutation } from "./api"
import {
  DataTable,
  DeleteContextActions,
  SelectedRowsChangeEventPayload,
} from "@/components/data-table"
import { Link } from "react-router-dom"
import { TableColumn } from "react-data-table-component"
import { PromiseModalProps, renderUncontrolledAsyncModal } from "@/modals/uncontrolled-async-modal"
import { ConfirmationModal } from "@/modals/confirm-modal"
import { CreateBrandTrigger } from "./upsert"

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
  const deleteBrandsMutation = useDeleteBrandsMutation({
    onSuccess: () => setClearSelectedToggled(!clearSelectedToggled),
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

    renderUncontrolledAsyncModal<void, ConfirmBrandsDeletionModalProps>(
      ConfirmBrandsDeletionModal,
      {
        count: selected.length,
      }
    ).then(() => deleteBrandsMutation.mutate(selectedIds))
  }

  const brandSummaries = brandlistingQuery.data?.items ?? []
  const brandsCount = brandlistingQuery.data?.paginationMetadata?.totalCount

  return (
    <div>
      <DataTable
        title={<Header />}
        columns={tableColumns}
        data={brandSummaries}
        disabled={deleteBrandsMutation.isPending || brandlistingQuery.isFetching}
        clearSelectedRows={clearSelectedToggled}
        contextActions={
          <DeleteContextActions
            loading={deleteBrandsMutation.isPending}
            selectedItemCount={selected.length}
            onClick={handleDeleteClick}
          />
        }
        highlightOnHover
        pagination
        paginationServer
        paginationTotalRows={brandsCount}
        progressPending={brandlistingQuery.isLoading}
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
      <CreateBrandTrigger />
    </div>
  )
}

type ConfirmBrandsDeletionModalProps = {
  count: number
} & PromiseModalProps<void>

function ConfirmBrandsDeletionModal({
  isOpen,
  onResolve,
  onReject,
  count,
}: ConfirmBrandsDeletionModalProps) {
  const plural = count > 1
  const title = `Delete ${count} brand${plural ? "s" : ""}`

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onDismiss={onReject}
      onConfirm={onResolve}
      title={title}
      description="Are you sure? This action cannot be undone."
    />
  )
}

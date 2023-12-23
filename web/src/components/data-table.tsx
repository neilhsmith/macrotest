import { ComponentPropsWithoutRef } from "react"
import DataTableBase, { Alignment, TableProps } from "react-data-table-component"
import { RxCaretSort } from "react-icons/rx"
import { Button } from "./ui/button"
import { FaRegTrashCan } from "react-icons/fa6"

const sortIcon = <RxCaretSort />
const selectProps = {
  indeterminate: (isIndeterminate: boolean) => isIndeterminate,
}

export type SelectedRowsChangeEventPayload<T> = {
  allSelected: boolean
  selectedCount: number
  selectedRows: T[]
}

export function DataTable<T>(props: TableProps<T>): JSX.Element {
  return (
    <DataTableBase
      pagination
      responsive
      selectableRowsComponentProps={selectProps}
      selectableRowsHighlight
      sortIcon={sortIcon}
      subHeaderAlign={Alignment.RIGHT}
      subHeaderWrap
      {...props}
    />
  )
}

type DeleteContextActionsProps = {
  loading: boolean
  selectedItemCount?: number
  onClick: () => void
} & ComponentPropsWithoutRef<"button">

export function DeleteContextActions({
  loading,
  selectedItemCount,
  onClick,
  ...rest
}: DeleteContextActionsProps) {
  const label =
    selectedItemCount === undefined
      ? "Delete"
      : `Delete ${selectedItemCount} item${selectedItemCount > 1 ? "s" : ""}`

  return (
    <Button
      key="delete"
      type="button"
      size="sm"
      variant="destructive"
      icon={<FaRegTrashCan />}
      loading={loading}
      onClick={onClick}
      {...rest}
    >
      {label}
    </Button>
  )
}

import DataTableBase, {
  Alignment,
  TableProps,
} from "react-data-table-component"
import { RxCaretSort } from "react-icons/rx"
import { Button } from "./ui/button"

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
  selectedItemCount?: number
  onClick: () => void
}

export function DeleteContextActions({
  selectedItemCount,
  onClick,
}: DeleteContextActionsProps) {
  const label =
    selectedItemCount === undefined
      ? "Delete"
      : `Delete ${selectedItemCount} item${selectedItemCount > 1 ? "s" : ""}`

  return (
    <Button key="delete" variant="destructive" onClick={onClick}>
      {label}
    </Button>
  )
}

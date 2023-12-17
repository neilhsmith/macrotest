import DataTableBase, {
  Alignment,
  TableProps,
} from "react-data-table-component"
import { RxCaretSort } from "react-icons/rx"

const sortIcon = <RxCaretSort />
const selectProps = {
  indeterminate: (isIndeterminate: boolean) => isIndeterminate,
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

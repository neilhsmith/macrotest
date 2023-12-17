import { DatePicker } from "@/components/date-picker"
import { Button } from "@/components/ui/button"
import { create } from "zustand"

type DateState = {
  date: Date
  update: (date: Date) => void
}

const useDateStore = create<DateState>((set) => ({
  date: new Date(),
  update: (date) =>
    set(() => ({
      date,
    })),
}))

export const Timeline = () => {
  const state = useDateStore()

  function updateDate(days: number) {
    const newDate = new Date(state.date)
    newDate.setDate(newDate.getDate() + days)
    state.update(newDate)
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex gap-4">
        <Button onClick={() => updateDate(-1)}>{"<"}</Button>
        <DatePicker
          date={state.date}
          onSelect={(date) => state.update(date ?? new Date())}
        />
        <Button onClick={() => updateDate(1)}>{">"}</Button>
      </div>
      <div>{state.date.toDateString()}</div>
    </div>
  )
}

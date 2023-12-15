import { create } from "zustand"
import { Button } from "./components/ui/button"
import { DatePicker } from "./components/date-picker"

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

function App() {
  const state = useDateStore()

  function updateDate(days: number) {
    const newDate = new Date(state.date)
    newDate.setDate(newDate.getDate() + days)
    state.update(newDate)
  }

  return (
    <div className="bg-slate-50 h-screen flex flex-col items-center justify-start gap-y-8 py-2">
      <div className="flex gap-4">
        <Button onClick={() => updateDate(-1)}>{"<"}</Button>
        <DatePicker
          date={state.date}
          onSelect={(date) => state.update(date ?? new Date())}
        />
        <Button onClick={() => updateDate(1)}>{">"}</Button>
      </div>
      <div className="flex gap-4">
        <div>{state.date.toDateString()}</div>
      </div>
    </div>
  )
}

export default App

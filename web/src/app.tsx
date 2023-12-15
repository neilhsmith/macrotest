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

function App() {
  const state = useDateStore()

  function updateDate(days: number) {
    const newDate = new Date(state.date)
    newDate.setDate(newDate.getDate() + days)
    state.update(newDate)
  }

  return (
    <div className="bg-slate-50 h-screen flex flex-col items-center justify-start gap-y-8">
      <div className="flex gap-4">
        <button className="border" onClick={() => updateDate(-1)}>
          back
        </button>
        <div className="border">{state.date.toDateString()}</div>
        <button className="border" onClick={() => updateDate(1)}>
          next
        </button>
      </div>
      <div className="flex gap-4">
        <div>todo</div>
      </div>
    </div>
  )
}

export default App

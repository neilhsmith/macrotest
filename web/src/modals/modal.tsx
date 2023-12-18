import { X } from "lucide-react"
import { PropsWithChildren } from "react"

export type ModalProps = {
  isOpen: boolean
  onDismiss: () => void
}

export const Modal = ({ children, isOpen, onDismiss }: PropsWithChildren<ModalProps>) => {
  return (
    <dialog open={isOpen}>
      <ModalOverlay />
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        {children}
        <button
          type="button"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </dialog>
  )
}

export const ModalOverlay = () => (
  <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
)

export const ModalHeader = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>
}

export const ModalTitle = ({ children }: PropsWithChildren) => {
  return <div className="text-lg font-semibold leading-none tracking-tight">{children}</div>
}

export const ModalDescription = ({ children }: PropsWithChildren) => {
  return <div className="text-sm text-muted-foreground">{children}</div>
}

export const ModalFooter = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">{children}</div>
  )
}

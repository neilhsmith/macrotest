import { Button } from "@/components/ui/button"
import {
  Modal,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalProps,
  ModalTitle,
} from "@/modals/modal"

export type ConfirmModelProps = {
  title?: string
  description?: string
  onConfirm?: () => void
}

export function ConfirmationModal({
  isOpen,
  onConfirm,
  onDismiss,
  title = "Are you sure?",
  description = "This action cannot be undone.",
}: ConfirmModelProps & ModalProps) {
  const handleSubmit = () => {
    onConfirm && onConfirm()
    onDismiss()
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription>{description}</ModalDescription>
      </ModalHeader>
      <ModalFooter>
        <Button variant="secondary" onClick={onDismiss}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </ModalFooter>
    </Modal>
  )
}

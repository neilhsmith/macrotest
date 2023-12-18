// /**
//  * https://github.com/prezly/react-promise-modal/blob/master/src/index.ts
//  */

import { ReactElement } from "react"
import { createRoot } from "react-dom/client"

export interface PromiseModalProps<R> {
  isOpen: boolean
  onResolve: Callback<R>
  onReject: Callback<void>
}

type Callback<R> = void extends R ? () => void : (value: R) => void
type ModalCallbacks<T> = Pick<PromiseModalProps<T>, "onResolve" | "onReject">
type RenderFunction<T> = (props: PromiseModalProps<T>) => ReactElement<unknown>

const noop = () => {}

export function reactModal(
  renderModal: RenderFunction<void> | RenderFunction<unknown>
): Promise<unknown> {
  const container = document.createElement("div")
  document.body.appendChild(container)

  const root = createRoot(container)

  function displayModal({ onResolve, onReject }: ModalCallbacks<unknown>) {
    root.render(renderModal({ onResolve, onReject, isOpen: true }))
  }

  function hideModal({ onResolve, onReject }: ModalCallbacks<unknown>) {
    root.render(renderModal({ onResolve, onReject, isOpen: false }))
  }

  function destroyModal() {
    root.unmount()
    document.body.removeChild(container)
  }

  const confirmation = new Promise((resolve) => {
    function onSubmit(value?: unknown) {
      if (arguments.length === 0) {
        resolve(true)
      } else {
        resolve(value)
      }
    }
    function onDismiss() {
      resolve(undefined)
    }
    displayModal({ onResolve: onSubmit, onReject: onDismiss })
  })

  return confirmation.finally(() => {
    hideModal({ onResolve: noop, onReject: noop })
    destroyModal()
  })
}

/**
 * based on https://github.com/prezly/react-promise-modal/blob/master/src/index.ts
 * but adds componentProps & adjust types accordingly
 *
 * Renders a modal to its own React root.
 */

import { ReactElement } from "react"
import { createRoot } from "react-dom/client"

export type PromiseModalProps<TResult> = {
  isOpen: boolean
  onResolve: Callback<TResult>
  onReject: Callback<void>
}

type Callback<R> = void extends R ? () => void : (value: R) => void
type ModalCallbacks<TResult, T extends PromiseModalProps<TResult>> = Pick<
  T,
  "onResolve" | "onReject"
>
type RenderFunction<TResult, T extends PromiseModalProps<TResult>> = (props: T) => ReactElement

const noop = () => {}

export function renderUncontrolledAsyncModal<TResult, T extends PromiseModalProps<TResult>>(
  renderModal: RenderFunction<TResult, T>,
  componentProps?: Omit<T, keyof PromiseModalProps<TResult>>
): Promise<TResult> {
  const container = document.createElement("div")
  document.body.appendChild(container)

  const root = createRoot(container)

  function displayModal({ onResolve, onReject }: ModalCallbacks<TResult, T>) {
    root.render(renderModal({ onResolve, onReject, isOpen: true, ...componentProps } as T))
  }

  function hideModal({ onResolve, onReject }: ModalCallbacks<TResult, T>) {
    root.render(renderModal({ onResolve, onReject, isOpen: false, ...componentProps } as T))
  }

  function destroyModal() {
    root.unmount()
    document.body.removeChild(container)
  }

  const confirmation = new Promise<TResult>((resolve, reject) => {
    function onResolve(value: TResult) {
      resolve(value)
    }

    function onReject() {
      reject()
    }

    displayModal({ onResolve, onReject } as Pick<T, "onResolve" | "onReject">)
  })

  return confirmation.finally(() => {
    hideModal({ onResolve: noop, onReject: noop } as Pick<T, "onResolve" | "onReject">)
    destroyModal()
  })
}

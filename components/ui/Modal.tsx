import { useState, Children, cloneElement, isValidElement } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
}

interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
}

interface ModalContentProps {
  children: React.ReactNode;
  onClose?: () => void; // ← added
}

interface ModalFooterProps {
  children: React.ReactNode;
  onClose?: () => void;
}

interface ModalTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}


export function Modal({ children, isOpen: externalOpen, onClose: externalClose }: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
  const close = externalClose !== undefined ? externalClose : () => setInternalOpen(false)
  const open = () => setInternalOpen(true)

  return (
    <>
      {Children.map(children, (child) => {
        if (isValidElement(child) && child.type === ModalTrigger) {
          return cloneElement(child as React.ReactElement<any>, { onClick: open })
        }
        if (isValidElement(child) && child.type === ModalOverlay) {
          return cloneElement(child as React.ReactElement<any>, { isOpen, onClose: close })
        }
        return child
      })}
    </>
  )
}

export function ModalTrigger({ children, onClick }: ModalTriggerProps) {
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}

export function ModalOverlay({
  children,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4">
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            const boxChildren = (child.props as any).children;
            const updatedChildren = Children.map(boxChildren, (boxChild) => {
              if (isValidElement(boxChild) && boxChild.type === ModalHeader) {
                return cloneElement(boxChild as React.ReactElement<any>, { onClose });
              }
              if (isValidElement(boxChild) && boxChild.type === ModalContent) {
                return cloneElement(boxChild as React.ReactElement<any>, { onClose });
              }
              if (isValidElement(boxChild) && boxChild.type === ModalFooter) {
                return cloneElement(boxChild as React.ReactElement<any>, { onClose });
              }
              return boxChild;
            });
            return cloneElement(child as React.ReactElement<any>, {}, updatedChildren);
          }
          return child;
        })}
      </div>
    </div>
  );

  return createPortal(content, document.body); // ← only change here
}
export function ModalHeader({ children, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      {typeof children === "string"
        ? <h2 className="text-base font-medium text-gray-800">{children}</h2>
        : <div>{children}</div>
      }
      <button
        onClick={onClose}
        className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400
          hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        ✕
      </button>
    </div>
  )
}

export function ModalContent({ children, onClose }: ModalContentProps) { // ← added onClose
  return (
    <div className="px-5 py-4 text-sm text-gray-600">
      {Children.map(children, (child) => {               // ← inject into children
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<any>, { onClose });
        }
        return child;
      })}
    </div>
  );
}

export function ModalFooter({ children, onClose }: ModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<any>, {
            onClick: (child.props as any).onClick ?? onClose,
          });
        }
        return child;
      })}
    </div>
  );
}
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
} from "@/components/ui/Modal"
import { LoginForm } from "@/app/(auth)/login/LoginForm"
import { RegisterForm } from "@/components/forms/RegisterForm"
import { useState } from "react"

interface LoginModalProps {
  isOpen:     boolean
  onClose:    () => void
  onSuccess?: () => void
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [view, setView] = useState<"login" | "register">("login")

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">

          {/* title changes based on view */}
          <ModalHeader>
            {view === "login" ? "Sign in" : "Create account"}
          </ModalHeader>

          <ModalContent>
            {view === "login" ? (

              <>
                <LoginForm
                  onSuccess={() => {
                    onSuccess?.()
                    onClose()
                  }}
                />
                {/* 👇 link to register */}
                <p className="text-xs text-center text-gray-400 mt-4">
                  No account?{" "}
                  <button
                    onClick={() => setView("register")}
                    className="text-green-700 font-medium hover:underline"
                  >
                    Create one here
                  </button>
                </p>
              </>

            ) : (

              <>
                <RegisterForm
                  onSuccess={() => {
                    onSuccess?.()
                    onClose()
                  }}
                />
                {/* 👇 link back to login */}
                <p className="text-xs text-center text-gray-400 mt-4">
                  Already have an account?{" "}
                  <button
                    onClick={() => setView("login")}
                    className="text-green-700 font-medium hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </>

            )}
          </ModalContent>

        </div>
      </ModalOverlay>
    </Modal>
  )
}
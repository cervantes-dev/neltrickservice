"use client"

import { logout } from "@/libs/validations/logout"
import { useState } from "react"
import Button from "../ui/Button"
import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalOverlay,
    ModalContent,
    ModalFooter
} from "../ui/Modal"

export function LogoutButton() {
    const [open, setOpen] = useState(false)

    return (
        <Modal isOpen={open} onClose={() => setOpen(false)}>
            <ModalTrigger>
                <Button
                    className="w-full"
                    size="sm"
                    variant="danger"
                    onClick={() => setOpen(true)}
                >
                    Logout
                </Button>
            </ModalTrigger>
            <ModalOverlay>
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <ModalHeader>Logout</ModalHeader>
                    <form action={logout}>
                        <ModalContent>
                            <p>Are you sure you want to logout?</p>
                        </ModalContent>
                        <ModalFooter>
                            <Button
                                size="sm"
                                variant="ghost"
                                type="button"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                variant="danger"
                                type="submit"
                            >
                                OK
                            </Button>
                        </ModalFooter>
                    </form>
                </div>
            </ModalOverlay>
        </Modal>
    )
}
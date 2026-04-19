"use client"
import { useState } from "react"
import Link from "next/link"
import NeltrickLogo from "../logo/NeltrickLogo"
import { LoginForm } from "@/app/(auth)/login/LoginForm"
import { Modal, ModalTrigger, ModalOverlay, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [isModalOpen, setModalOpen] = useState(false)

    return (
        <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">

            {/* Main row */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <NeltrickLogo />

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Tracking</Link>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Services</Link>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About</Link>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</Link>
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Modal>
                        <ModalTrigger>
                            <Button
                                variant="outline"
                                size="md"
                                onClick={() => { }}
                            >
                                Sign In
                            </Button>
                        </ModalTrigger>
                        <ModalOverlay>
                            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                                <ModalHeader>
                                    Login
                                </ModalHeader>
                                <ModalContent>
                                  <LoginForm />
                                </ModalContent>
                            </div>
                        </ModalOverlay>
                    </Modal>

                    <Link href="/register"
                        className="text-sm font-medium bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-gray-500 hover:text-gray-900"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

            </div>

            {/* Mobile menu — drops down when open */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</a>
                    <hr className="border-gray-100" />
                    <a href="#" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg text-center">
                        Login
                    </a>
                </div>
            )}
        </nav>
    )
}
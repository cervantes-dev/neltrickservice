import { logout } from "@/libs/validations/logout"

export function LogoutButton() {
    return (
        <form action={logout}>
            <button
                type="submit"
                className="w-full text-left text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-b-lg transition-colors"
            >
                Logout
            </button>
        </form>
    )
}
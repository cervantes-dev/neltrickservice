'use client'
import { Search, Close, Delete, WarningAmber } from "@mui/icons-material"
import UserFilter from "@/components/admin/users/users-filters"
import { UsersTablesSkeleton } from "@/components/admin/users/users-tables-skeleton"
import { Menu, MenuTrigger, MenuList, MenuItem } from "@/components/ui/Menu";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Modal, ModalTrigger, ModalOverlay, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useUsers } from "@/app/(dashboard)/users/hooks/useUser"; 

interface UserTablesProps {
    currentPage: number;
    onTotalPagesChange: (total: number) => void;
    onTotalChange: (total: number) => void;
    onPageReset: () => void;
    refetchTrigger?: number; 
}

export function UserTables({ currentPage, onTotalPagesChange, onTotalChange, onPageReset,  }: UserTablesProps) {

    const {
        loading,
        error,
        search,
        setSearch,
        filtered,
        activeTab,
        setActiveTab,
        verifiedFilter,
        handleVerifiedFilter,
        deletingId,
        total,
        handleDelete,
    } = useUsers({ currentPage, onTotalPagesChange, onTotalChange, onPageReset });

    if (loading) return <UsersTablesSkeleton />;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

                {/* Left — Segmented Tab Control */}
                <div className="flex items-center gap-1 bg-brand-green/10 p-1 rounded-lg w-fit">
                    {["All", "Staff", "Customer"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-150 cursor-pointer
          ${activeTab === tab
                                    ? "bg-white text-brand-green shadow-sm"
                                    : "text-gray-500 hover:text-brand-green"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Right — Search + Filter */}
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center">
                        {/* Search icon */}
                        <span className="absolute left-3 text-gray-400 pointer-events-none">
                            <Search fontSize="small" />
                        </span>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-48 sm:w-56 border border-brand-green/20 bg-brand-green/5 rounded-md pl-9 pr-8 py-1.5
                                text-sm text-gray-600 placeholder:text-gray-400 outline-none
                                focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40
                                transition-all duration-150"
                            type="text"
                            placeholder="Search users..."
                        />

                        {/* X button — only shows when there is text */}
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Close fontSize="small" />
                            </button>
                        )}
                    </div>
                    <UserFilter
                        options={["Verified", "Not Verified"]}
                        onSelect={handleVerifiedFilter}
                        filterCount={verifiedFilter ? total : 0}
                        value={verifiedFilter}
                    />
                </div>

            </div>
            <div className="overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        <TableHead className="w-12">No.</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead hidden="sm">Status</TableHead>
                        <TableHead hidden="lg">Date Registered</TableHead>
                        <TableHead className="w-10" />
                    </TableHeader>

                    <TableBody>
                        {filtered.map((user, index) => (
                            <TableRow key={user._id}>

                                {/* No. */}
                                <TableCell className="text-gray-400">
                                    {(currentPage - 1) * 10 + index + 1}
                                </TableCell>

                                {/* Email */}
                                <TableCell>
                                    {user.email}
                                    <dl className="lg:hidden mt-1 space-y-1">
                                        <dd className="sm:hidden">
                                            {user.isVerified ? (
                                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full text-xs">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                                    Not verified
                                                </span>
                                            )}
                                        </dd>
                                        <dd className="text-xs text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </dd>
                                    </dl>
                                </TableCell>

                                {/* Role */}
                                <TableCell>
                                    <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 capitalize">
                                        {user.role}
                                    </span>
                                </TableCell>

                                {/* Status */}
                                <TableCell hidden="sm">
                                    {user.isVerified ? (
                                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full text-xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                            Not verified
                                        </span>
                                    )}
                                </TableCell>

                                {/* Date */}
                                <TableCell hidden="lg" className="text-gray-400">
                                    {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </TableCell>

                                {/* Actions */}
                                <TableCell>
                                    <Menu>
                                        <MenuTrigger />
                                        <MenuList>
                                            <Modal>
                                                <ModalTrigger>
                                                    <MenuItem
                                                        label="Delete"
                                                        icon={<Delete fontSize="small" />}
                                                        variant="danger"
                                                        onClick={() => { }}
                                                    />
                                                </ModalTrigger>

                                                <ModalOverlay>
                                                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                                                        <ModalHeader>
                                                            <WarningAmber className="text-red-500 bg-red-200 p-2 rounded-full" sx={{ fontSize: 40 }} /> Delete Account?
                                                        </ModalHeader>
                                                        <ModalContent>
                                                            <p className="flex justify-center">Your account and all data will be permanently deleted.</p>
                                                        </ModalContent>
                                                        <ModalFooter>
                                                            <Button variant="ghost" size="sm">Cancel</Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                disabled={deletingId === user._id}
                                                                onClick={() => handleDelete(user._id)}
                                                            >
                                                                {deletingId === user._id ? "Deleting..." : "Delete"}
                                                            </Button>
                                                        </ModalFooter>
                                                    </div>
                                                </ModalOverlay>
                                            </Modal>
                                        </MenuList>
                                    </Menu>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
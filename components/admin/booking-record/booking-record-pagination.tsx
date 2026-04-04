"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Pagination from "@/components/ui/Pagination";

interface Props {
    total: number;
    perPage?: number;
}

export default function BookingRecordPagination({ total, perPage = 10 }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page") ?? 1);
    const totalPages = Math.ceil(total / perPage);

    function handlePageChange(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={handlePageChange}
        />
    );
}
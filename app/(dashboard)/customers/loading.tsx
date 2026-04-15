import CustomersTableSkeleton from "@/components/admin/customers/customers-table-skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function CustomerLoading() {
    <section>
        <Card>
            <CardHeader>
                Customer List <br />
                <span className="text-xs text-gray-400">Manage Walk - in / Online Booking details</span>
            </CardHeader>
            <CardContent>
                <CustomersTableSkeleton />
            </CardContent>
        </Card>
    </section>
}
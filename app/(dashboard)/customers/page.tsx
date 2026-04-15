import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import CustomersTable from "@/components/admin/customers/customers-table"
export default function CustomerPage() {
    return (
        <section>
            <Card>
                <CardHeader>
                    Customer List <br />
                    <span className="text-xs text-gray-400">Manage Walk - in / Online Booking details</span>
                </CardHeader>
                <CardContent>
                    <CustomersTable/>
                </CardContent>
            </Card>
        </section >
    )
}
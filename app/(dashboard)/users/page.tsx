"use client"
import { useState } from "react";
import { UserStats } from "@/components/admin/users/users-stats";
import { UserTables } from "@/components/admin/users/users-tables";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Add } from "@mui/icons-material";
import { Modal, ModalTrigger, ModalOverlay, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import AddUserForm from "@/components/admin/users/add-user-form";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  return (
    <section className="flex flex-col gap-4 p-4">
      <UserStats />
      <Card>
        <CardHeader
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {total} total  {/* 👈 dynamic */}
              </span>
              <div className="w-px h-4 bg-gray-200" />
              <Modal>
                <ModalTrigger>
                  <Button
                    size="xs"
                    icon={<Add fontSize="small" />}
                    onClick={() => { }}
                  >
                    Add Staff
                  </Button>
                </ModalTrigger>

                <ModalOverlay>
                  <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <ModalHeader>
                      Create Staff
                    </ModalHeader>
                    <ModalContent>
                      <AddUserForm
                        onSuccess={() => setRefetchTrigger(prev => prev + 1)}
                      />
                    </ModalContent>
                  </div>
                </ModalOverlay>

              </Modal>
            </div>
          }
        >
          User list
        </CardHeader>

        <CardContent>
          <UserTables
            currentPage={currentPage}
            onTotalPagesChange={setTotalPages}
            onTotalChange={setTotal}
            onPageReset={() => setCurrentPage(1)}
            refetchTrigger={refetchTrigger}
          />
        </CardContent>

        <CardFooter>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>

    </section>
  );
}
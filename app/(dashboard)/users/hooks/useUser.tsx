import { useState, useEffect } from "react";
import axios from "axios";
import { sileo } from "sileo";

interface User {
  _id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface UseUsersProps {
  currentPage: number;
  onTotalPagesChange: (total: number) => void;
  onTotalChange: (total: number) => void;
  onPageReset: () => void;
  refetchTrigger?: number;
}

export const useUsers = ({ currentPage, onTotalPagesChange, onTotalChange, onPageReset, refetchTrigger }: UseUsersProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const handleVerifiedFilter = (value: string) => {
    setVerifiedFilter(value);
    onPageReset();
  };

  const filtered = activeTab === "All"
    ? users
    : users.filter((user) => user.role.toLowerCase() === activeTab.toLowerCase());

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      onPageReset();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/users`, {
          params: {
            page: currentPage,
            limit: 10,
            search: debouncedSearch,
            verified: verifiedFilter === "Verified"
              ? "true"
              : verifiedFilter === "Not Verified"
                ? "false"
                : "",
          }
        });
        setUsers(res.data.data);
        setTotal(res.data.total);
        onTotalPagesChange(res.data.totalPages);
        onTotalChange(res.data.total);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Status:", err.response?.status);
          console.error("Response:", err.response?.data);
        }
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, debouncedSearch, verifiedFilter]);

  // delete user
  const handleDelete = async (userId: string) => {
    try {
      setDeletingId(userId);

      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const result = await res.json();

      if (!result.success) {
        sileo.error({ title: "Failed", description: result.message, duration: 5000 });
        return;
      }

      setUsers(prev => prev.filter(user => user._id !== userId));

      sileo.success({
        title: "Success",
        position: "top-center",
        description: "User deleted successfully",
        duration: 5000,
        fill: "black",
        styles: { title: "text-white", description: "text-white/75" }
      });

    } catch (error) {
      sileo.error({ title: "Error", description: "Something went wrong", duration: 5000 });
    } finally {
      setDeletingId(null);
    }
  };

  return {
    users,
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
  };
};
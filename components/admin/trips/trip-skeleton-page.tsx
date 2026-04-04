
export function TripSkeleton() {
  return (
    <div className="w-full">

      {/* ---- Toolbar ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 pt-2 pr-1">

        {/* mirrors: All | Staff | Customer tabs */}
        <div className="flex flex-wrap gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-sm h-7 w-16"
            />
          ))}
        </div>

        {/* mirrors: search input + filter button */}
        <div className="flex items-center w-full sm:w-64 gap-2">
          <div className="animate-pulse bg-gray-200 rounded-sm h-8 flex-1" />
          <div className="animate-pulse bg-gray-200 rounded h-8 w-9" />
        </div>

      </div>

      {/* ---- Table ---- */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse">

          {/* keep real headers — never skeleton them! */}
          <thead>
            <tr className="border-b-2 border-brand-green/20 bg-brand-green/10">
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">No.</th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Email</th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Role</th>
              <th className="hidden sm:table-cell px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Status</th>
              <th className="hidden lg:table-cell px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Date Registered</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-green/20">
            {[...Array(10)].map((_, i) => (
              <tr key={i}>

                {/* No. */}
                <td className="px-5 py-4">
                  <div className="animate-pulse bg-gray-200 rounded h-3 w-5" />
                </td>

                {/* Email — with responsive sub-info below */}
                <td className="px-5 py-4">
                  <div className="animate-pulse bg-gray-200 rounded h-3 w-40" />
                  <dl className="lg:hidden mt-2 space-y-1">
                    {/* mirrors status badge (sm:hidden) */}
                    <dd className="sm:hidden">
                      <div className="animate-pulse bg-gray-200 rounded-full h-4 w-16" />
                    </dd>
                    {/* mirrors date */}
                    <dd>
                      <div className="animate-pulse bg-gray-200 rounded h-3 w-20" />
                    </dd>
                  </dl>
                </td>

                {/* Role */}
                <td className="px-5 py-4">
                  <div className="animate-pulse bg-gray-200 rounded h-3 w-14" />
                </td>

                {/* Status badge — hidden on mobile */}
                <td className="hidden sm:table-cell px-5 py-4">
                  <div className="animate-pulse bg-gray-200 rounded-full h-5 w-20" />
                </td>

                {/* Date Registered — hidden on smaller screens */}
                <td className="hidden lg:table-cell px-5 py-4">
                  <div className="animate-pulse bg-gray-200 rounded h-3 w-24" />
                </td>

                {/* Actions (MoreVert icon) */}
                <td className="px-5 py-4">
                  <div className="animate-pulse bg-gray-200 rounded h-5 w-5" />
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}
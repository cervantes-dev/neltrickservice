export function UsersPaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 mt-10">

      {/* mimics: <ChevronLeft /> Prev button */}
      <div className="animate-pulse bg-gray-200 rounded-md h-8 w-20" />

      {/* mimics: page number buttons — fake 5 since totalPages is unknown */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-md h-8 w-9"
        />
      ))}

      {/* mimics: Next <ChevronRight /> button */}
      <div className="animate-pulse bg-gray-200 rounded-md h-8 w-20" />

    </div>
  )
}
import { SortDescriptor } from "@nextui-org/react";

export const onRowsPerPageChange = (
  e: React.ChangeEvent<HTMLSelectElement>,
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>,
  setPage: React.Dispatch<React.SetStateAction<number>>,
) => {
  setRowsPerPage(Number(e.target.value));
  setPage(1);
};

export const handleSearchChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setSearchText: React.Dispatch<React.SetStateAction<string>>,
) => {
  setSearchText(e.target.value);
};

export const handleSortChange = (
  columnId: string,
  sortDescriptor: SortDescriptor,
  setSortDescriptor: React.Dispatch<React.SetStateAction<SortDescriptor>>,
) => {
  if (sortDescriptor.column === columnId) {
    const newDirection =
      sortDescriptor.direction === "ascending" ? "descending" : "ascending";
    setSortDescriptor({
      column: columnId,
      direction: newDirection,
    });
  } else {
    setSortDescriptor({
      column: columnId,
      direction: "ascending",
    });
  }
};

export function filterUsersByText<T extends { [key: string]: any }>(
  items: T[],
  searchText: string,
  filterKey: keyof T,
): T[] {
  return items.filter((item) =>
    item[filterKey]
      ?.toString()
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );
}

export function calculateTotalPages(
  totalItems: number,
  rowsPerPage: number,
): number {
  return Math.ceil(totalItems / rowsPerPage);
}

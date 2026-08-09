import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Columns3, Funnel } from "lucide-react";

export default function DynamicTableControls({
    allColumns,
    visibleColumns,
    setVisibleColumns,
    toggleShowFilters,
    showFilters,
}) {
    return (
        <div className="flex items-center gap-2">
            {/* Columns Dropdown */}{" "}
            <DropdownMenu>
                {" "}
                <DropdownMenuTrigger asChild>
                    {" "}
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        {" "}
                        <Columns3 className="h-4 w-4" />
                    </Button>{" "}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuCheckboxItem
                        checked={visibleColumns.length === allColumns.length}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setVisibleColumns(
                                    allColumns.map((col) => col.key),
                                );
                            } else {
                                setVisibleColumns([]);
                            }
                        }}
                    >
                        Select All
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                        checked={visibleColumns.length === 0}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setVisibleColumns([]);
                            } else {
                                setVisibleColumns(
                                    allColumns.map((col) => col.key),
                                );
                            }
                        }}
                    >
                        Deselect All
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator />

                    {allColumns.map((col) => (
                        <DropdownMenuCheckboxItem
                            key={col.key}
                            checked={visibleColumns.includes(col.key)}
                            onCheckedChange={(checked) => {
                                setVisibleColumns((prev) => {
                                    if (checked) {
                                        return [...prev, col.key];
                                    }

                                    return prev.filter(
                                        (key) => key !== col.key,
                                    );
                                });
                            }}
                        >
                            {col.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {/* Filter Button */}
            <Button
                variant={showFilters ? "secondary" : "outline"}
                onClick={toggleShowFilters}
                className="flex items-center gap-2"
            >
                <Funnel className="h-4 w-4" />

                {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
        </div>
    );
}

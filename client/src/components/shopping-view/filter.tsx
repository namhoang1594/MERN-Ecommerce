import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import type { FilterOptions } from "../../types/config/index.types";

interface ProductFilterProps {
  filters: Record<string, string[]>;
  handleFilters: (category: string, value: string) => void;
}

function ProductFilter({ filters, handleFilters }: ProductFilterProps) {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {(Object.keys(filterOptions) as (keyof FilterOptions)[]).map(
          (keyItem) => (
            <Fragment key={keyItem}>
              <div>
                <h3 className="text-base font-bold">
                  {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
                </h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      key={option.id}
                      className="flex items-center gap-2 font-medium"
                    >
                      <Checkbox
                        checked={
                          !!(
                            filters?.[keyItem] &&
                            filters[keyItem].includes(option.id)
                          )
                        }
                        onCheckedChange={() =>
                          handleFilters(keyItem, option.id)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
              <Separator />
            </Fragment>
          )
        )}
      </div>
    </div>
  );
}

export default ProductFilter;

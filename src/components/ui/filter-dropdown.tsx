import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

interface FilterOption {
  label: string
  value: string
}

interface FilterDropdownProps {
  options: FilterOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}

export function FilterDropdown({
  options,
  value,
  onValueChange,
  placeholder = "Filter by...",
}: FilterDropdownProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

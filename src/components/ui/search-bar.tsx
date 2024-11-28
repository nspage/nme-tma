import { Search } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
}

export function SearchBar({ className, onSearch, ...props }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value)
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        className="pl-8"
        onChange={handleChange}
        {...props}
      />
    </div>
  )
}

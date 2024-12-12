"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";

type DropdownProps = {
  studentClasses: { id: string | number; name: string }[]; // Define the shape of the studentClasses prop
};

const Dropdown = ({ studentClasses }: DropdownProps) => {
  const router = useRouter();

  const handleSearch = (name: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("class", name);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none ring-0">
        <button className="w-full h-8 px-1.5 flex items-center justify-center rounded-full bg-lamaYellow space-x-2">
          <Image src="/icons/sort.png" alt="Filter" width={14} height={14} />
          <span className="text-sm font-medium capitalize">
            Filter by class
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {studentClasses?.map((item) => (
          <DropdownMenuItem
            onClick={() => handleSearch(item.name)}
            key={item.id}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;

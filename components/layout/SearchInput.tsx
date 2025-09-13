"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useDebounceValue } from "@/hooks/useDebounceValue";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const [value, setValue] = useState(title || "");
  const router = useRouter();
  const pathname = usePathname();

  const debouncedValue = useDebounceValue<string>(value, 500);

  useEffect(() => {
    let currentQuery = {};

    if (searchParams) {
      currentQuery = queryString.parse(searchParams.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      ...(debouncedValue
        ? { title: debouncedValue.toLowerCase() }
        : { title: undefined }),
    };

    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: updatedQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debouncedValue, router, searchParams, pathname]);

  const isFeedPage = pathname.includes("/blog/feed");

  if (!isFeedPage) return null;

  return (
    <div className="relative hidden sm:block">
      <Search className="absolute top-3 left-4 h-4 w-4 text-muted-foreground outline-none" />
      <Input
        placeholder="Search..."
        className="pl-10 bg-primary/10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;

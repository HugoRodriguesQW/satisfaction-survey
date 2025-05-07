import { IoSearchOutline } from "react-icons/io5";
import { Input } from "../input.module";
import { ChangeEvent, HTMLAttributes, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { normalizeText } from "@/resources/utils";

type SearchBarProps = {
  onChange?: (search: string[]) => void;
  searchDelay?: number;
  input?: HTMLAttributes<HTMLInputElement>;
};

export function SearchBar({ onChange, searchDelay = 1000, input }: SearchBarProps) {
  const [search, setSearch] = useState<string[]>([]);
  const [rawSearch, setRawSearch] = useState<string>();

  function handleInputChange(event: ChangeEvent<HTMLInputElement> | { target: { value: string } }) {
    const raw = event.target.value;
    setRawSearch(raw);

    setSearch(
      raw
        .split(" ")
        .map(normalizeText)
        .filter((t) => Boolean(t.length))
    );
  }

  function handlePrefill(raw: string) {
    handleInputChange({
      target: {
        value: raw,
      },
    });
  }

  

  useEffect(() => {
    if (search.length) {
      const timeout = setTimeout(() => {
        onChange?.(search);
      }, searchDelay);


      return () => {
        clearTimeout(timeout);
      };
    }
  }, [search, onChange, searchDelay]);

  return (
    <div className="flex  flex-col gap-2 relative w-full max-w-[800px]">
      <div className="w-full flex gap-2 items-center">
        <Input
          onKeyDown={(event) => {
            if (event.key == "Enter" && search?.length) {
              onChange?.(search);
            }
          }}
          value={rawSearch}
          placeholder="Search..."
          container={{ className: "w-full" }}
          onChange={handleInputChange}
          {...input}
        />
        <button
          className="absolute right-0 px-3"
          onClick={() => {
            if (search.length) {
              onChange?.(search);
            }
          }}
        >
          <IoSearchOutline className="h-5 w-5" />
        </button>
      </div>

      <div className="gap-2 hidden">
        <Button
          onClick={() => {
            handlePrefill("completed surveys");
          }}
        >
          completed
        </Button>
        <Button
          onClick={() => {
            handlePrefill("my drafts");
          }}
        >
          drafts
        </Button>
        <Button
          onClick={() => {
            handlePrefill("ongoing surveys");
          }}
        >
          ongoing surveys
        </Button>
      </div>
    </div>
  );
}

type ButtonProps = HTMLAttributes<HTMLButtonElement>;

function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={twMerge(
        "tail-button-violet rounded-full text-sm px-2 py-[0.1rem] text-background hover:via-sky-300",
        className
      )}
    >
      {children}
    </button>
  );
}

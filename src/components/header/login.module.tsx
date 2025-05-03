import { useRouter } from "next/router";
import { FiArrowRight } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export function HeaderLogin() {
  const router = useRouter();

  function handleSignInClick() {
    router.push("/login");
  }

  return (
    <div
      onClick={handleSignInClick}
      className={twMerge(
        "flex items-center [&>svg]:opacity-0 [&>svg]:scale-0 hover:[&>svg]:opacity-100 hover:[&>svg]:scale-100",
        "hover:[&>svg]:ml-0 [&>svg]:-ml-1 hover:cursor-pointer hover:underline"
      )}
    >
      Sign In
      <FiArrowRight className="transition-all duration-200 w-[0.9rem]" />{" "}
    </div>
  );
}

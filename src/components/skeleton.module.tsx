import { createContext, HTMLAttributes, ReactNode, useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type contextProps = {
  showContent: boolean;
};

const context = createContext({} as contextProps);

type SkeletonProps = {
  condition: boolean;
  children?: ReactNode;
};

export function Skeleton(props: SkeletonProps) {
  const [showContent, setShowContent] = useState(props.condition);

  useEffect(() => {
    setShowContent(props.condition);
  }, [props.condition]);

  return (
    <context.Provider
      value={{
        showContent,
      }}
    >
      {props.children}
    </context.Provider>
  );
}

type SkelProps = {
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

Skeleton.Skel = function Skel(props: SkelProps) {
  const { showContent } = useContext(context);
  if (showContent) return null;

  return <div className={twMerge("skeleton rounded-full mb-1", props.className)} />;
};

type ContentProps = HTMLAttributes<HTMLDivElement>;

Skeleton.Content = function Content({ children, ...rest }: ContentProps) {
  const { showContent } = useContext(context);
  return <>{showContent ? <div {...rest}>{children}</div> : null}</>;
};

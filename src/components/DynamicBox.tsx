import { HTMLAttributes, useEffect, useRef, useState } from "react";

type ClassName = HTMLAttributes<HTMLDivElement>["className"];
type Style = HTMLAttributes<HTMLDivElement>["style"];

type DynamicBoxProps = {
  className?: ClassName;
  onChange: (rect: DOMRect, window: { width: number, height: number }) => Style,
  children?: React.ReactNode;
};

/**
 * A React Hook component that listens to screen size changes and applies a callback to determine CSS styles.
 */
export function DynamicBox({ onChange, children, className }: DynamicBoxProps) {
  const [style, setStyle] = useState<Style>();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleChange() {
      const rect = ref.current?.getBoundingClientRect();
      const windowRect = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      if (rect) {
        const newStyle = onChange(rect, windowRect);
        setStyle(newStyle);
      }
    }

    // Initial call to set the style
    handleChange();

    // Add event listener for resize
    window.addEventListener("resize", handleChange);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleChange);
    };
  }, [onChange]);

  return <div className={
    className
  } ref={ref} style={style}>
    {children}
  </div>
}

import { dataContext } from "@/context/dataContext.module";
import { HTMLAttributes, useContext } from "react";

export const Logo = (props: HTMLAttributes<HTMLOrSVGElement>) => {

  const { data } = useContext(dataContext)

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 592 133" {...props} style={{
      overflow: "visible"
    }}>
      <title>{"Privora"}</title>
      <defs>
        <linearGradient
          id="g1"
          x2={1}
          gradientTransform="matrix(198.33 220.268 -152.271 137.105 368.141 -38.713)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#37828b" />
          <stop offset={0.26} stopColor="#37828b" />
          <stop offset={0.61} stopColor="#554294" />
          <stop offset={0.78} stopColor="#633083" />
          <stop offset={1} stopColor="#633083" />
        </linearGradient>
        <linearGradient
          id="g2"
          x2={1}
          gradientTransform="matrix(197.724 219.595 -151.805 136.686 365.91 -4.158)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#37828b" />
          <stop offset={0.26} stopColor="#37828b" />
          <stop offset={0.61} stopColor="#554294" />
          <stop offset={0.78} stopColor="#633083" />
          <stop offset={1} stopColor="#633083" />
        </linearGradient>
        <linearGradient
          id="g3"
          x2={1}
          gradientTransform="matrix(197.724 219.595 -151.805 136.686 287.987 -5.321)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#37828b" />
          <stop offset={0.26} stopColor="#37828b" />
          <stop offset={0.61} stopColor="#554294" />
          <stop offset={0.78} stopColor="#633083" />
          <stop offset={1} stopColor="#633083" />
        </linearGradient>
        <linearGradient
          id="g4"
          x2={1}
          gradientTransform="matrix(198.33 220.268 -152.271 137.105 290.218 -39.876)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#37828b" />
          <stop offset={0.26} stopColor="#37828b" />
          <stop offset={0.61} stopColor="#554294" />
          <stop offset={0.78} stopColor="#633083" />
          <stop offset={1} stopColor="#633083" />
        </linearGradient>
        <linearGradient
          id="g5"
          x2={1}
          gradientTransform="matrix(222.451 247.057 -393.671 354.463 394.215 -52.108)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#04e3fe" />
          <stop offset={0.266} stopColor="#04e3fe" />
          <stop offset={0.611} stopColor="#7e58fe" />
          <stop offset={0.781} stopColor="#ab28ff" />
          <stop offset={1} stopColor="#ab28ff" />
        </linearGradient>
      </defs>
      <style>{`
    .s4 {
      fill:var(--color-foreground);
    }
    .s5{
      fill:var(--color-background);
    }
    `}</style>
      <g id="FG BG">
        <path
          id="BG1"
          fillRule="evenodd"
          d="m494.6 12.1 31.2 120.5h65.6L560.8 12.1z"
          style={{
            fill: "url(#g2)",
          }}
          className="opacity-40 dark:opacity-100"
        />
        <path
          fillRule="evenodd"
          d="m416.7 12.1 31.1 120.5h65.6L482.9 10.9z"
          style={{
            fill: "url(#g3)"
          }}
          className="opacity-40 dark:opacity-100"
        />

        <g id="Privora">
          <path
            id="P"
            fillRule="evenodd"
            d="M20.9 118H.5V6.4h39.4q18.8 0 29.3 9.3Q79.8 24.9 79.8 42q0 16.8-10.6 26.1-10.5 9.3-29.3 9.3h-19zm0-94.1L25 44l-4.1 15.7h19q9.4 0 14.2-5Q59 49.7 59 42q0-7.9-4.9-13-4.8-5.1-14.2-5.1z"
            className="fill-purple-400 dark:fill-foreground"
          />
          <path
            id="r"
            d="M112.3 119H92V35.2h20.3zm0-36.6h-5q0-16.4 3.7-27.2 3.7-10.7 9.9-15.9 6.3-5.2 13.9-5.2 2.1 0 3.9.2 1.9.3 3.7.8l-.4 20.3q-2.2-.5-4.8-.9-2.5-.3-4.6-.3-6.7 0-11.3 3.3-4.5 3.1-6.8 9.4-2.2 6.3-2.2 15.5z"
            className="fill-purple-500 dark:fill-foreground"
          />
          <path
            id="i"
            d="M162.6 23.7q-6 0-9.3-3.1-3.3-3.1-3.3-8.7 0-5.5 3.3-8.6 3.3-3.3 9.3-3.3 5.8 0 9.2 3.3 3.3 3.1 3.3 8.6 0 5.6-3.3 8.7-3.4 3.1-9.2 3.1zm10.7 95.1H153V35h20.3z"
            className="fill-purple-600 dark:fill-foreground"
          />
          <path
            id="v"
            d="M212.1 118.4 181 35h23.4l19.9 66h-1.5l19.9-66h23.4L235 118.4z"
            className="fill-purple-700 dark:fill-foreground"
          />
          <path
            id="o"
            fillRule="evenodd"
            d="M315.8 121.2q-11.5 0-20.8-4.9-9.2-4.9-14.6-14.6c-3.6-6.5-5.9-15.2-5.9-25 0-9.9 2.3-17.7 5.9-24.3q5.4-9.8 14.6-14.6 9.3-4.8 20.8-4.8 11.2 0 20.3 4.8c6.2 3.2 11.9 7.7 15.5 14.2 3.6 6.5 7 14.9 7 24.9 0 9.8-3.5 18.1-7.1 24.6-3.6 6.5-9.9 11.2-16 14.5-6.1 3.3-12.2 5.2-19.7 5.2zm.6-19.8c4 0 6.1-.3 9.2-2.3 3.2-2 6.4-4.5 8.6-7.9 2.4-3.5 2.8-8 2.8-13.8 0-8.9-2.5-14.7-6-19.2-3.4-4.4-8-6.3-14-6.3-4.1 0-7.1-.2-10.3 1.8q-4.7 2.9-7.5 8.9c-1.8 3.9-3 8.6-3 14.5 0 8.7 2.3 15.5 6.4 19.4 3.8 3.6 7.8 4.8 13.8 4.9z"
            className="fill-purple-800 dark:fill-foreground"
          />
          <path
            d="M396.3 119H376V35.2h20.3zm0-36.6h-5q0-16.4 3.7-27.2 3.7-10.7 9.9-15.9 6.3-5.2 13.9-5.2 2.1 0 3.9.2 1.9.3 3.7.8l-.4 20.3q-2.2-.5-4.8-.9-2.5-.3-4.6-.3-6.7 0-11.3 3.3-4.5 3.1-6.8 9.4-2.2 6.3-2.2 15.5z"
            className="fill-purple-900 dark:fill-foreground"
          />
          <path
            id="a"
            d="m501.7 117.4-18.5-.7.4-17.1-1.4-34.6s.1-4-1.9-7.3c-1.9-3.2-3.4-5.5-8.9-6-3.4-.4-5.7-.3-8.3 0-2.3.2-5.2 1.2-7.4 2.9-1.7 1.3-4.5 6.7-5.4 8.8l-18-7c2.2-6.2 2.4-6.1 5.4-10.5 2.9-4.1 7.4-7.4 13-9.4 5.7-2 11.7-2.4 19.6-2.4 7.2 0 12.8 1.3 18.8 4.5 5.8 3 7 5.7 10.1 10.5 3.1 4.6 2.6 9.5 2.6 17zm-40.6 1.6s-10.9.1-15.4-2c-4.9-2.2-10.2-5.1-12.6-9.2q-3.7-6.1-3.7-13.3c0-5.2 1.6-9.2 3.8-13.1 2.6-4.5 7.1-7.4 12.2-9.2 5.1-1.8 10.7-2 17.7-2.1 5.1 0 19.9.1 19.9.1l4.2 1 1.2 14.9q-4.7-1.5-10.3-2.4-5.6-.9-10.5-.9-7.2 0-11.8 2.7-4.7 2.7-4.7 9c0 3.1 1.5 5 4 7.2 2.6 2.2 8.4 2.6 13.9 1.3 3.8-1 7.1-4.4 7.1-4.4 2.5-2.5 4.9-6.9 4.9-6.9 1.4-3 1.6-8.2 1.6-10.9l8.8 7.2c0 6-3.4 8.3-5.7 13.4-2.2 5-5.1 9-9.6 12.1-4.3 3-9.8 5.3-15 5.5z"
            className="fill-purple-900 dark:fill-foreground"
          />
        </g>
        <path
          id="FG1"
          fillRule="evenodd"
          d="m561.7 12.1-46 120.5h-66.5l46.3-120.5z"
          style={{
            fill: "url(#g5)",
          }}
          className={
            data ? "animation-logo-2" : ""
          }
        />
      </g>
    </svg>
  )
}
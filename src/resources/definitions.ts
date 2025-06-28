import { Operations } from "./definitions/operations";
import { FontFamily, FontWeight } from "./definitions/typography";
import { clone, merge, SafeObject } from "./utils";

// Time Definitions
export const TimeUnit = {
  "ms": 1 * 1,
  "s": 1 * 1000,
  "m": 1000 * 60,
  "h": 1000 * 60 * 60,
  "d": 1000 * 60 * 60 * 24,
  "w": 1000 * 60 * 60 * 24 * 7,
  "mo": 1000 * 60 * 60 * 24 * 28,
  "y": 1000 * 60 * 60 * 24 * 265
} as const;
export type TimeUnit = keyof typeof TimeUnit;

export const TimeLongUnit = {
  "ms": "millisecond",
  "s": "second",
  "m": "minute",
  "h": "hour",
  "d": "day",
  "w": "week",
  "mo": "month",
  "y": "year"
} as const;
export type TimeLongUnit = keyof typeof TimeLongUnit;

// Survey Definitions
export const STATUS = {
  disabled: 0,
  scheduled: 1,
  active: 2,
  ended: 3,
} as const;

export type STATUS = keyof typeof STATUS;
export type STATUSValue = (typeof STATUS)[keyof typeof STATUS];

// Question Definitions
export type QuestionTypes = "text-input" | "selection" | "slider" | "text-message";

export const QuestionProperties = {
  id: null as string | null,
  type: "none" as QuestionTypes,
  section: {
    title: "Thoughtful title that introduces your question" as string,
    description: "Brief explanation of what you are asking" as string,
    tags: [] as string[],
  },

  typography: {
    title: {
      fontFamily: "sans" as FontFamily,
      weight: "normal" as FontWeight,
    },
    description: {
      fontFamily: "sans" as FontFamily,
      weight: "normal" as FontWeight,
    },

    buttons: {
      fontFamily: "sans" as FontFamily,
      weight: "normal" as FontWeight,
    },
  },

  input: {
    min: null as null | number,
    max: null as null | number,
    minText: "Disagree",
    maxText: "Agree",
    placeholder: "Type your answer here...",
    bias: 1 as null | number,
  },

  selection: {
    multiple: false,
    multipleLimit: 2 as null | number,
    multipleMethod: "mean" as Operations,
    options: [
      {
        text: "Option 1",
        bias: 1 as null | number,
      },
      {
        text: "Option 2",
        bias: 1 as null | number,
      },
      {
        text: "Option 3",
        bias: 1 as null | number,
      },
      {
        text: "Option 4",
        bias: 1 as null | number,
      },
    ],
  },
};

export const AutoProperties = {
  input: {
    max: {
      slider: 100,
      "text-input": 512,
    } as Record<QuestionTypes, number>,
    min: {
      slider: 0,
      "text-input": 1,
    } as Record<QuestionTypes, number>,
  },
} as const;

export const TextInputQuestion = SafeObject(merge(clone(QuestionProperties), { type: "text-input" } as const), {
  id: 1,
  type: 1,
  section: 1,
  typography: {
    description: 1,
    title: 1,
  },
  input: {
    max: 1,
    min: 1,
    placeholder: 1,
  },
});

export const SelectionQuestion = SafeObject(merge(clone(QuestionProperties), { type: "selection" } as const), {
  id: 1,
  type: 1,
  section: 1,
  typography: {
    description: 1,
    title: 1,
    buttons: 1,
  },
  selection: 1,
});

export const SliderQuestion = SafeObject(merge(clone(QuestionProperties), { type: "slider" } as const), {
  id: 1,
  type: 1,
  section: 1,
  typography: {
    description: 1,
    title: 1,
  },
  input: {
    min: 1,
    max: 1,
    minText: 1,
    maxText: 1,
    bias: 1,
  },
});

export const TextMessageQuestion = SafeObject(merge(clone(QuestionProperties), { type: "text-message" } as const), {
  id: 1,
  type: 1,
  section: {
    description: 1,
    title: 1,
  },
  typography: {
    description: 1,
    title: 1,
  },
});

export type QuestionProperties = typeof QuestionProperties;
export type SelectionQuestion = typeof SelectionQuestion;
export type TextInputQuestion = typeof TextInputQuestion;
export type SliderQuestion = typeof SliderQuestion;
export type TextMessageQuestion = typeof TextMessageQuestion;

export type Question = SelectionQuestion | TextInputQuestion | SliderQuestion | TextMessageQuestion;

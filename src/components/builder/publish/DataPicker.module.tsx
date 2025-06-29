import Calendar from "react-calendar";
import { twMerge } from "tailwind-merge";

type DataPickerProps = {
    value?: Date,
    startAt?: Date,
    onChange?: (date?: Date) => void;
    min?: Date,
    max?: Date
}

export function DataPicker({ value, startAt, onChange, min, max }: DataPickerProps) {

    return (
        <div>
            <Calendar className={twMerge(
                value ? "picked" : "no-picked"
            )} onClickDay={(date) => {
                if (date.toDateString() === value?.toDateString()) {
                    return onChange?.(undefined)
                }

                if (!value) {
                    const now = new Date();
                    const update = new Date(date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0))
                    return onChange?.(update < (min ?? -Infinity) ? min : (update > (max ?? Infinity)) ? max : update)
                }
                onChange?.(new Date(date.setHours(value.getHours(), value.getMinutes(), value.getSeconds())))

            }}
                defaultActiveStartDate={startAt}
                value={value} minDate={min} maxDate={max} calendarType="gregory" />
        </div>
    );
}
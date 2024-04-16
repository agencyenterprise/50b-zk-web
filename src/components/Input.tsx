"use client";

type InputFieldProps = {
  id: string;
  label: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function InputField({
  id,
  label,
  disabled,
  defaultValue,
  onChange,
}: InputFieldProps) {
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="message"
        className="block text-sm font-semibold leading-6 text-white mb-2"
      >
        {label}
      </label>

      <textarea
        onChange={(e) => onChange && onChange(e)}
        disabled={disabled}
        name={label}
        id={id}
        rows={4}
        className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
        defaultValue={defaultValue || ""}
      />
    </div>
  );
}

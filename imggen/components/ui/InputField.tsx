// components/ui/InputField.tsx
'use client'
type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
};

export default function InputField({ label, value, onChange, textarea }: InputFieldProps) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full border rounded-md p-2"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full border rounded-md p-2"
        />
      )}
    </div>
  );
}

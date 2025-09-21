import { FormControl } from "@/types/config/index.types";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  controls: FormControl[];
  onSubmit: (values: Record<string, string>) => void;
  submitText?: string;
  loading?: boolean;
  errors?: Record<string, string>;
  defaultValues?: Record<string, string>;
}

export default function Form({
  controls,
  onSubmit,
  submitText = "Xác nhận",
  loading,
  errors: serverErrors,
  defaultValues = {},
}: Props) {
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const validateField = (
    value: string,
    allValues: Record<string, string>,
    rules?: FormControl["rules"]
  ) => {
    if (!rules) return;
    for (const rule of rules) {
      switch (rule.type) {
        case "required":
          if (!value) return rule.message || "Trường này là bắt buộc";
          break;
        case "min":
          if (value.length < Number(rule.value))
            return rule.message || `Tối thiểu ${rule.value} ký tự`;
          break;
        case "max":
          if (value.length > Number(rule.value))
            return rule.message || `Tối đa ${rule.value} ký tự`;
          break;
        case "pattern":
          if (rule.value instanceof RegExp && !rule.value.test(value))
            return rule.message || "Định dạng không hợp lệ";
          break;
        case "match":
          if (value !== allValues[String(rule.value)])
            return rule.message || "Giá trị không khớp";
          break;
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    controls.forEach((c) => {
      values[c.name] = (formData.get(c.name) as string) || "";
    });

    // validate client theo config
    const newErrors: Record<string, string> = {};
    controls.forEach((c) => {
      const msg = validateField(values[c.name], values, c.rules);
      if (msg) newErrors[c.name] = msg;
    });

    if (Object.keys(newErrors).length) {
      setClientErrors(newErrors);
      return;
    }

    setClientErrors({});
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {controls.map((control) => {
        const errorMsg =
          clientErrors[control.name] || serverErrors?.[control.name];
        return (
          <div key={control.name} className="space-y-2">
            <Label htmlFor={control.name}>{control.label}</Label>
            {control.type === "textarea" ? (
              <Textarea
                id={control.name}
                name={control.name}
                placeholder={control.placeholder}
                className={errorMsg ? "border-red-500" : ""}
              />
            ) : control.type === "select" ? (
              <Select name={control.name}>
                <SelectTrigger>
                  <SelectValue placeholder={control.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {control.options?.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={control.name}
                name={control.name}
                type={control.type}
                placeholder={control.placeholder}
                defaultValue={defaultValues[control.name] || ""}
                className={errorMsg ? "border-red-500" : ""}
              />
            )}
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          </div>
        );
      })}
      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitText}
      </Button>
    </form>
  );
}

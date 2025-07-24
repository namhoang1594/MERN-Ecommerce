// src/common/form.tsx
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export interface FormControlItem {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  componentType: "input" | "select" | "textarea";
  id?: string;
  options?: Array<{
    id: string;
    label: string;
  }>;
}

// ✅ Refactor dùng generic T
interface CommonFormProps<T extends Record<string, any>> {
  formControls: FormControlItem[];
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  buttonText?: string;
  isBtnDisabled?: boolean;
}

// ✅ Refactor renderInputByComponentType cũng nhận generic T
function renderInputByComponentType<T extends Record<string, any>>(
  getControlItem: FormControlItem,
  formData: T,
  setFormData: React.Dispatch<React.SetStateAction<T>>
): React.ReactNode {
  const value = formData[getControlItem.name] ?? "";

  switch (getControlItem.componentType) {
    case "input":
      return (
        <Input
          id={getControlItem.name}
          name={getControlItem.name}
          placeholder={getControlItem.placeholder}
          type={getControlItem.type}
          value={value}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              [getControlItem.name]: event.target.value,
            }))
          }
        />
      );

    case "select":
      return (
        <Select
          value={value}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              [getControlItem.name]: value,
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={getControlItem.label} />
          </SelectTrigger>
          <SelectContent>
            {getControlItem.options?.map((optionItem) => (
              <SelectItem key={optionItem.id} value={optionItem.id}>
                {optionItem.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "textarea":
      return (
        <Textarea
          id={getControlItem.id}
          name={getControlItem.name}
          placeholder={getControlItem.placeholder}
          value={value}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              [getControlItem.name]: event.target.value,
            }))
          }
        />
      );

    default:
      return (
        <Input
          id={getControlItem.name}
          name={getControlItem.name}
          placeholder={getControlItem.placeholder}
          type={getControlItem.type}
          value={value}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              [getControlItem.name]: event.target.value,
            }))
          }
        />
      );
  }
}

// ✅ Refactor function chính
function CommonForm<T extends Record<string, any>>({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}: CommonFormProps<T>): React.ReactElement {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputByComponentType(controlItem, formData, setFormData)}
          </div>
        ))}
      </div>
      <Button className="mt-2 w-full" type="submit" disabled={isBtnDisabled}>
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;

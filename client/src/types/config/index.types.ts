export type InputType = "text" | "email" | "password" | "number" | "textarea" | "select";
export type RuleType = "required" | "min" | "max" | "pattern" | "match";
export interface FieldRule {
    type: RuleType;
    value?: number | string | RegExp; // min/max length, target name, hoặc regex
    message?: string;
}
export interface FormControl {
    type: InputType;
    name: string;
    label: string;
    placeholder?: string;
    options?: { label: string; value: string | number }[]; // dùng cho select
    rules?: FieldRule[]; // validate rules
}

export type UploadedResult = {
    url: string;
    public_id: string;
};
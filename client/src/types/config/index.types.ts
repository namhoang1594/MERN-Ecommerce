export type ComponentType = "input" | "select" | "textarea";

export interface BaseFormControl {
    label: string;
    name: string;
    componentType: ComponentType;
    placeholder?: string;
}

export interface InputControl extends BaseFormControl {
    componentType: "input";
    type: "text" | "email" | "password" | "number";
}

export interface TextAreaControl extends BaseFormControl {
    componentType: "textarea";
}

export interface SelectControl extends BaseFormControl {
    componentType: "select";
    options: OptionItem[];
}

export type FormControlItem = InputControl | TextAreaControl | SelectControl;

export interface OptionItem {
    id: string;
    label: string;
}

export interface HeaderMenuItem {
    id: string;
    label: string;
    path: string;
}

export type FilterOptions = {
    category: OptionItem[];
    brand: OptionItem[];
};

export const categoryOptionsKeys = ["man", "woman", "kids", "accessories", "footwear"] as const;
export type CategoryOptionKey = typeof categoryOptionsKeys[number];

export const brandOptionsKeys = ["nike", "adidas", "gucci", "dior", "h&m"] as const;
export type BrandOptionKey = typeof brandOptionsKeys[number];

"use client";

import { useEffect } from "react";

// RHF
import { FieldArrayWithId, useFormContext, useWatch } from "react-hook-form";

// DnD
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ShadCn
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Components
import { BaseButton, FormInput, FormTextarea } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";

// Types
import { ItemType, NameType } from "@/types";

type SingleItemProps = {
    name: NameType;
    index: number;
    fields: ItemType[];
    field: FieldArrayWithId<ItemType>;
    moveFieldUp: (index: number) => void;
    moveFieldDown: (index: number) => void;
    removeField: (index: number) => void;
};

const SingleItem = ({
    name,
    index,
    fields,
    field,
    moveFieldUp,
    moveFieldDown,
    removeField,
}: SingleItemProps) => {
    const { control, setValue } = useFormContext();

    const { _t } = useTranslationContext();

    // Items
    const itemName = useWatch({
        name: `${name}[${index}].name`,
        control,
    });

    const rate = useWatch({
        name: `${name}[${index}].unitPrice`,
        control,
    });

    const quantity = useWatch({
        name: `${name}[${index}].quantity`,
        control,
    });

    const total = useWatch({
        name: `${name}[${index}].total`,
        control,
    });

    // Currency
    const currency = useWatch({
        name: `details.currency`,
        control,
    });

    // Ajout des champs pour status et eom dans le formulaire d'une ligne
    const status = useWatch({
        name: `${name}[${index}].status`,
        control,
    });
    const eom = useWatch({
        name: `${name}[${index}].eom`,
        control,
    });

    useEffect(() => {
        if (rate != undefined && quantity != undefined) {
            const calculatedTotal = (rate * quantity).toFixed(2);
            if (total !== calculatedTotal) {
                setValue(`${name}[${index}].total`, calculatedTotal);
            }
        }
    }, [rate, quantity, setValue, name, index, total]);

    // DnD
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const boxDragClasses = isDragging
        ? "border-2 bg-gray-200 border-blue-600 dark:bg-slate-900 z-10"
        : "border";

    const gripDragClasses = isDragging
        ? "opacity-0 group-hover:opacity-100 transition-opacity cursor-grabbing"
        : "cursor-grab";

    return (
        <div
            style={style}
            {...attributes}
            className={`${boxDragClasses} group flex flex-col gap-y-5 p-3 my-2 cursor-default rounded-xl bg-gray-50 dark:bg-slate-800 dark:border-gray-600`}
        >
            {/* {isDragging && <div className="bg-blue-600 h-1 rounded-full"></div>} */}
            <div className="flex flex-wrap justify-between">
                {itemName != "" ? (
                    <p className="font-medium">
                        #{index + 1} - {itemName}
                    </p>
                ) : (
                    <p className="font-medium">#{index + 1} - Empty name</p>
                )}

                <div className="flex gap-3">
                    {/* Drag and Drop Button */}
                    <div
                        className={`${gripDragClasses} flex justify-center items-center`}
                        ref={setNodeRef}
                        {...listeners}
                    >
                        <GripVertical className="hover:text-blue-600" />
                    </div>

                    {/* Up Button */}
                    <BaseButton
                        size={"icon"}
                        tooltipLabel="Move the item up"
                        onClick={() => moveFieldUp(index)}
                        disabled={index === 0}
                    >
                        <ChevronUp />
                    </BaseButton>

                    {/* Down Button */}
                    <BaseButton
                        size={"icon"}
                        tooltipLabel="Move the item down"
                        onClick={() => moveFieldDown(index)}
                        disabled={index === fields.length - 1}
                    >
                        <ChevronDown />
                    </BaseButton>
                </div>
            </div>
            <div
                className="flex flex-wrap justify-between gap-y-5 gap-x-2"
                key={index}
            >
                <FormInput
                    name={`${name}[${index}].description`}
                    label="ITEMS DESCRIPTIONS"
                    placeholder="Description de l'article"
                />
                <FormInput
                    name={`${name}[${index}].status`}
                    label="STATUT"
                    placeholder="Statut (ex: Livré, En attente...)"
                />
                <FormInput
                    name={`${name}[${index}].eom`}
                    label="EOM"
                    placeholder="EOM (ex: 2025-05, 2025-Q2...)"
                />
                <FormInput
                    name={`${name}[${index}].quantity`}
                    label="QTY"
                    type="number"
                    min={0}
                />
                <FormInput
                    name={`${name}[${index}].unitPrice`}
                    label="PRIX U."
                    type="number"
                    min={0}
                />
                <FormInput
                    name={`${name}[${index}].total`}
                    label="PRIX TOTAL"
                    type="number"
                    min={0}
                    disabled
                />
            </div>
            <div className="flex flex-wrap gap-4 w-full">
                <FormInput
                    name={`${name}[${index}].description`}
                    label={_t("form.steps.lineItems.description")}
                    placeholder="Item description"
                />
                <FormInput
                    name={`${name}[${index}].status`}
                    label="STATUT"
                    placeholder="Statut (ex: Livré, En attente...)"
                />
                <FormInput
                    name={`${name}[${index}].eom`}
                    label="EOM"
                    placeholder="EOM (ex: 2025-05, 2025-Q2...)"
                />
                <FormInput
                    name={`${name}[${index}].quantity`}
                    label="QTY"
                    type="number"
                    min={0}
                />
                <FormInput
                    name={`${name}[${index}].unitPrice`}
                    label="PRIX U."
                    type="number"
                    min={0}
                />
                <FormInput
                    name={`${name}[${index}].total`}
                    label="PRIX TOTAL"
                    type="number"
                    min={0}
                    disabled
                />
            </div>
            <FormTextarea
                name={`${name}[${index}].description`}
                label={_t("form.steps.lineItems.description")}
                placeholder="Item description"
            />
            <div>
                {/* Not allowing deletion for first item when there is only 1 item */}
                {fields.length > 1 && (
                    <BaseButton
                        variant="destructive"
                        onClick={() => removeField(index)}
                    >
                        <Trash2 />
                        {_t("form.steps.lineItems.removeItem")}
                    </BaseButton>
                )}
            </div>
        </div>
    );
};

export default SingleItem;

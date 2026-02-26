import React from "react";
import { Input, Label, Paragraph, YStack } from "tamagui";

type InputFieldProps = {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    helpText?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    id?: string;
};

export const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    helpText,
    secureTextEntry = false,
    autoCapitalize = "none",
    keyboardType = "default",
    id,
}: InputFieldProps) => {
    return (
        <YStack gap="$1" marginBottom="$3">
            {label && (
                <Label htmlFor={id} fontWeight="bold">
                    {label}
                </Label>
            )}

            <Input
                id={id}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                backgroundColor={(error ? "$red2" : "$background") as any}
                color={(error ? "$red12" : "$color") as any}
                borderColor={(error ? "$red8" : "$color7") as any}
                borderWidth={error ? 2 : 1}
            />

            {error ? (
                <Paragraph color={"$red10" as any} size="$2">
                    {error}
                </Paragraph>
            ) : helpText ? (
                <Paragraph color={"$gray10" as any} size="$2">
                    {helpText}
                </Paragraph>
            ) : null}
        </YStack>
    );
};

import { IonButton } from "@ionic/react";

export interface IButton {
    disabled?: boolean;
    link?: string;
    label: string;
    color?: string;
    type?: "button" | "submit";
    onClick?: () => void;
}
const Button = (props: IButton) => {
    const { disabled, link, label, color, type, onClick } = props;
    return (
        <IonButton
            color={color ?? "dark"}
            disabled={disabled}
            href={link}
            type={type ?? "button"}
            onClick={onClick!}
            style={{
                fontFamily: "Inter",
                fontWeight: "500",
                textTransform: "capitalize",
                borderRadius: "10px",
            }}
        >
            {label}
        </IonButton>
    );
};

export default Button;

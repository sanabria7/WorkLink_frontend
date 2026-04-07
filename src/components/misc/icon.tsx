import { AppIcons, type IconName } from "../../assets/icons/AppIcons";

interface IconProps {
    name: IconName;
}

export default function Icon({name}: IconProps) {
    return <>{AppIcons[name]}</>
}
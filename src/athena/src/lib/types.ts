import { SvgProps, NumberProp } from 'react-native-svg';
interface Props extends SvgProps {
  size?: NumberProp;
}
export type HeroIcon = ({ size, ...props }: Props) => JSX.Element;

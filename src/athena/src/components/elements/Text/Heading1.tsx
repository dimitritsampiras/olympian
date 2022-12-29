import { Text } from 'react-native';
interface Heading1Props {
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

export const Heading1: React.FC<Heading1Props> = ({ children, textAlign = 'center'}) => {
  return (
    <Text
      style={{
        fontWeight: '700',
        fontSize: 32,
        color: 'black',
        textAlign: textAlign,
        marginBottom: 35,
      }}>
      {children}
    </Text>
  );
};

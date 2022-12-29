import { Text } from 'react-native';
import theme from '../../../theme';

interface SubHeading1Props {
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

export const SubHeading1: React.FC<SubHeading1Props> = ({ children, textAlign = 'center'}) => {
  return (
    <Text
      style={{
        fontWeight: '500',
        fontSize: 16,
        color: theme.gray[400],
        textAlign: textAlign,
        marginBottom: 35,
      }}>
      {children}
    </Text>
  );
};
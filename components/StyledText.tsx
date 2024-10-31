import { Text } from '@/components/Themed';
import { TextProps } from '@/components/Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[{ fontFamily: 'SpaceMono' }]} />;
}

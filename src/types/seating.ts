export interface Person {
  id: string;
  name: string;
  seatNumber: number;
  department?: string;
  expression: 'smile' | 'frown' | 'surprised';
  outfit: {
    color: string;
    pattern?: 'stripes' | 'checks' | 'solid';
  };
}

export interface MinifigureProps {
  person: Person;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export interface SignProps {
  name: string;
  isActive: boolean;
}

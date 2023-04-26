interface ModCard {
  id: string;
  name: string;
  cost: number;
  disabled?: boolean;
  effects: Array<{
    name: string;
    group: string;
    mutate?: number;
  }>;
}

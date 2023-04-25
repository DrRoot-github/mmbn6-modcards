interface ModCard {
  id: string;
  name: string;
  cost: number;
  effects: Array<{
    name: string;
    group: string;
    mutate?: number;
  }>;
}

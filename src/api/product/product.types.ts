export type productDetails = LaptopDetails | TestDetails;

export type LaptopDetails = {
  category: 'Laptop';
  capacity: number;
  capacityUnit: 'GB' | 'TB';
  capacityType: 'SSD' | 'HD';
  brand: string;
  series: string;
};

export type TestDetails = {
  category: 'Test';
  test: boolean;
};

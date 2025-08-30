/**
 * SauceDemo Product Test Data
 * Centralized product information for e-commerce testing
 */

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  priceDisplay: string;
  imageName: string;
  category: 'apparel' | 'accessories' | 'other';
}

export const SAUCEDEMO_PRODUCTS: Record<string, ProductData> = {
  SAUCE_LABS_BACKPACK: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: 29.99,
    priceDisplay: '$29.99',
    imageName: 'sauce-backpack-1200x1500.jpg',
    category: 'accessories'
  },
  SAUCE_LABS_BIKE_LIGHT: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    description: 'A red light isn\'t the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.',
    price: 9.99,
    priceDisplay: '$9.99',
    imageName: 'bike-light-1200x1500.jpg',
    category: 'accessories'
  },
  SAUCE_LABS_BOLT_TSHIRT: {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    price: 15.99,
    priceDisplay: '$15.99',
    imageName: 'bolt-shirt-1200x1500.jpg',
    category: 'apparel'
  },
  SAUCE_LABS_FLEECE_JACKET: {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    description: 'It\'s not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.',
    price: 49.99,
    priceDisplay: '$49.99',
    imageName: 'sauce-pullover-1200x1500.jpg',
    category: 'apparel'
  },
  SAUCE_LABS_ONESIE: {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    description: 'Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won\'t unravel.',
    price: 7.99,
    priceDisplay: '$7.99',
    imageName: 'red-onesie-1200x1500.jpg',
    category: 'apparel'
  },
  TEST_ALLTHETHINGS_TSHIRT: {
    id: 'test-allthethings-t-shirt-red',
    name: 'Test.allTheThings() T-Shirt (Red)',
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
    price: 15.99,
    priceDisplay: '$15.99',
    imageName: 'red-tatt-1200x1500.jpg',
    category: 'apparel'
  }
};

export interface CheckoutData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const CHECKOUT_DATA: Record<string, CheckoutData> = {
  VALID_CUSTOMER: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  },
  INTERNATIONAL_CUSTOMER: {
    firstName: 'María',
    lastName: 'García',
    postalCode: 'SW1A 1AA'
  }
};

export const INVALID_CHECKOUT_DATA: Record<string, Partial<CheckoutData>> = {
  EMPTY_FIRST_NAME: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345'
  },
  EMPTY_LAST_NAME: {
    firstName: 'John',
    lastName: '',
    postalCode: '12345'
  },
  EMPTY_POSTAL_CODE: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: ''
  }
};

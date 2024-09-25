export const getProducts = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        products: [
          {
            id: 1,
            name: "Product 1",
            price: 9.99,
          },
          {
            id: 2,
            name: "Product 2",
            price: 19.99,
          },
        ],
      });
    }, 2000);
  });

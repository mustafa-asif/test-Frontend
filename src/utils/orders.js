import { xFetch } from "./constants";

export const dummyOrders = [
  {
    timestamps: {
      created: "2021-09-16T20:36:52.734Z",
      requested: "2021-09-16T22:33:50.073Z",
      started: "2021-09-16T22:37:51.921Z",
      fulfilled: "2021-09-16T22:46:54.939Z",
    },
    timeline: [
      "draft - 9/16/2021 4:36:52 PM",
      "awaiting pickup - 9/16/2021 4:37:28 PM",
      "awaiting transfer - 9/16/2021 5:32:21 PM",
      "pending - 9/16/2021 6:11:13 PM",
      "awaiting transfer - 9/16/2021 6:12:58 PM",
      "pending - 9/16/2021 6:33:50 PM",
      "in progress - 9/16/2021 6:37:51 PM",
      "fulfilled - 9/16/2021 6:46:54 PM",
    ],
    variableProducts: true,
    openable: true,
    _id: "orvtg855",
    products: [
      {
        product: {
          _id: "prkpq848",
          name: "iPhone 13",
        },
        quantity: 1,
      },
    ],
    target: {
      city: "purvis",
      address: "an address",
      phone: "0000000",
      name: "another x",
      zone: "b",
    },
    cost: 200,
    status: "fulfilled",
    reserved: false,
    client: {
      _id: "Gyc3AXPNG2",
      options: {
        pack: "apple",
        priority: "cost",
      },
    },
    events: [
      {
        user: {
          _id: "0X8unnwZ1n",
          role: "client",
          name: "Client One",
        },
        timestamps: {
          created: "2021-09-16T20:36:52.735Z",
        },
        en: "Order Created",
        fr: "Order Created",
        _id: "evmyr880",
      },
      {
        user: {
          _id: "0X8unnwZ1n",
          role: "client",
          name: "Client One",
        },
        timestamps: {
          created: "2021-09-16T20:37:28.494Z",
        },
        en: "Order awaiting pickup ",
        fr: "Order awaiting pickup ",
        _id: "evsmq125",
      },
      {
        user: {
          _id: "lBYuJHGi3i",
          role: "warehouse",
          name: "Warehouser two",
        },
        timestamps: {
          created: "2021-09-16T22:12:58.246Z",
        },
        en: "Order awaiting transfer; Target Edited",
        fr: "Order awaiting transfer; Target Edited",
        _id: "evcup490",
      },
      {
        user: {
          _id: "lBYuJHGi3i",
          role: "warehouse",
          name: "Warehouser two",
        },
        timestamps: {
          created: "2021-09-16T22:33:37.158Z",
        },
        en: "Order Target Changed",
        fr: "Order Target Changed",
        _id: "evptq034",
      },
      {
        user: {
          _id: "lBYuJHGi3i",
          role: "warehouse",
          name: "Warehouser two",
        },
        timestamps: {
          created: "2021-09-16T22:33:50.046Z",
        },
        en: "Order pending ",
        fr: "Order pending ",
        _id: "evixe316",
      },
      {
        user: {
          _id: "lBYuJHGi3i",
          role: "warehouse",
          name: "Warehouser two",
        },
        timestamps: {
          created: "2021-09-16T22:34:28.418Z",
        },
        en: "Order pending; Target Edited",
        fr: "Order pending; Target Edited",
        _id: "evjaw548",
      },
      {
        user: {
          _id: "lBYuJHGi3i",
          role: "warehouse",
          name: "Warehouser two",
        },
        timestamps: {
          created: "2021-09-16T22:35:02.234Z",
        },
        en: "Order Target Changed",
        fr: "Order Target Changed",
        _id: "eviab215",
      },
      {
        user: {
          _id: "us_oix_364",
          role: "deliverer",
          name: "Deliverer Two",
        },
        timestamps: {
          created: "2021-09-16T22:37:51.916Z",
        },
        en: "Order In Progress",
        fr: "Order In Progress",
        _id: "evohg140",
      },
      {
        timestamps: {
          created: "2021-09-16T22:46:54.933Z",
        },
        en: "Order Fulfilled",
        fr: "Order Fulfilled",
        user: {
          _id: "us_oix_364",
          role: "deliverer",
          name: "Deliverer Two",
        },
        _id: "evhcg990",
      },
    ],
    items: [
      {
        _id: "itlbd282",
        product: {
          _id: "prkpq848",
        },
      },
    ],
    __v: 17,
    deliverer: {
      deliverer: {
        options: {
          cities: [],
          zones: [],
          pickups: true,
          orders: true,
        },
      },
      _id: "us_oix_364",
      name: "Deliverer Two",
      phone: "044242442",
    },
  },
];

export const xGetOrders = async () => {
  return await xFetch(`/orders`);
};

export const xAddOrder = async (body) => {
  return await xFetch("/orders", { method: "POST", body });
};

export const xEditOrder = async (id, body) => {
  return await xFetch(`/orders/${id}`, { method: "PATCH", body });
};

export const xAddFileOrders = async (file) => {
  const body = new FormData();
  body.append("file", file);
  return await xFetch("/orders/file", { method: "POST", body }, true);
};

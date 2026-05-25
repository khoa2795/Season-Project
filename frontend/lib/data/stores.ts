export type Store = {
  id: string;
  name: string;
  address: string;
  openingHours: string;
  phone: string;
  images: string[];
};

export const stores: Store[] = [
  {
    id: "hanoi-store",
    name: "SEASON HÀ NỘI",
    address: "44 Tôn Đức Thắng, Đống Đa, Hà Nội",
    openingHours: "9:00 AM - 10:00 PM | Monday - Sunday",
    phone: "+84 986 009 390",
    images: [
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733646/Hanoi_01_ywfflj.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733646/Hanoi_02_bz22uj.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733646/Hanoi_03_p32nah.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733647/Hanoi_04_blnu3e.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733647/Hanoi_05_ffzpoq.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733647/Hanoi_06_i7omec.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733644/Hanoi_07_dbthgl.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733644/Hanoi_08_o3hck6.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733645/Hanoi_09_bgcniu.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733645/Hanoi_10_hnkumt.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733645/Hanoi_11_wet2eh.jpg",
    ],
  },
  {
    id: "saigon-store",
    name: "SEASON SÀI GÒN",
    address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
    openingHours: "9:00 AM - 10:00 PM | Monday - Sunday",
    phone: "+84 986 009 390",
    images: [
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733648/Saigon_01_o1wl1h.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733648/Saigon_02_qtjik0.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733648/Saigon_03_d72fju.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733648/Saigon_04_i92ymr.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733644/Saigon_05_cprtpr.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733650/Saigon_06_d7tb1z.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733644/Saigon_07_f7lkd3.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733644/Saigon_08_v7a98w.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733645/Saigon_09_ebxs2r.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733645/Saigon_10_jojfty.jpg",
      "https://res.cloudinary.com/du2zsbi0i/image/upload/v1779733646/Saigon_11_mnm8zq.jpg",
    ],
  },
];

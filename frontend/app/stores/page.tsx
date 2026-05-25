import type { Metadata } from "next";
import { StoreGalleryCard } from "@/components/sections/StoreGalleryCard";
import { stores, type Store } from "@/lib/data/stores";

export const metadata: Metadata = {
  title: "Hệ thống cửa hàng",
};

type OfficialDealer = {
  name: string;
  address: string;
  phone: string;
  openingHours: string;
};

const officialDealers: OfficialDealer[] = [
  {
    name: "Đại lý trung tâm Hà Nội",
    address: "Khu vực Hoàn Kiếm, Hà Nội",
    phone: "+84 986 009 390",
    openingHours: "10:00 AM - 9:00 PM | Monday - Sunday",
  },
  {
    name: "Đại lý phía Tây Hà Nội",
    address: "Khu vực Cầu Giấy, Hà Nội",
    phone: "+84 986 009 390",
    openingHours: "10:00 AM - 9:00 PM | Monday - Sunday",
  },
  {
    name: "Đại lý trung tâm Sài Gòn",
    address: "Khu vực Quận 1, TP.HCM",
    phone: "+84 986 009 390",
    openingHours: "10:00 AM - 9:00 PM | Monday - Sunday",
  },
  {
    name: "Đại lý phía Đông Sài Gòn",
    address: "Khu vực Thủ Đức, TP.HCM",
    phone: "+84 986 009 390",
    openingHours: "10:00 AM - 9:00 PM | Monday - Sunday",
  },
];

function getFlagshipStores(): Store[] {
  const uniqueStores: Store[] = [];

  stores.forEach((store) => {
    const alreadyAdded = uniqueStores.some((item) => item.id === store.id);

    if (alreadyAdded === false) {
      uniqueStores.push(store);
    }
  });

  return uniqueStores.slice(0, 2);
}

export default function Page() {
  const flagshipStores = getFlagshipStores();

  return (
    <main className="bg-[#f1f1f1] text-black">
      <section className="px-5 pb-20 pt-16 sm:px-8 md:px-14 md:pb-28 md:pt-24 lg:px-20 xl:px-28">
        <div className="mx-auto max-w-[1680px]">
          <div className="grid gap-8 pb-10 md:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] md:gap-12 md:pb-14 lg:gap-16">
            <div className="space-y-5">
              <h1 className="font-afacad text-[36px] font-semibold uppercase leading-[0.95] tracking-[0.02em] text-black sm:text-[48px] md:text-6xl lg:text-7xl">
                HỆ THỐNG CỬA HÀNG
              </h1>
              <p className="font-afacad text-[14px] font-semibold uppercase tracking-[0.2em] text-black/52">
                FLAGSHIP
              </p>
            </div>

            <div className="flex items-end">
              <p className="max-w-[720px] font-afacad text-base leading-[1.72] text-black/68 md:text-lg">
                Không gian cửa hàng được thiết kế để khách hàng trực tiếp trải
                nghiệm chất liệu, phom dáng và cảm giác đeo của từng thiết kế
                kính trong nhịp độ mua sắm chậm rãi, riêng tư.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {flagshipStores.map((store, index) => (
              <StoreGalleryCard
                key={store.id}
                name={store.name}
                address={store.address}
                openingHours={store.openingHours}
                phone={store.phone}
                images={store.images}
                priority={index === 0}
              />
            ))}
          </div>

          <section className="mt-12 border-t border-black/14 pt-10 md:mt-16 md:pt-14">
            <div className="grid gap-10 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-16">
              <div className="md:sticky md:top-24 md:h-fit">
                <p className="mb-5 font-afacad text-[12px] font-semibold uppercase tracking-[0.22em] text-black/42">
                  Official Distribution
                </p>
                <h2 className="font-afacad text-[32px] font-semibold uppercase leading-[1.02] tracking-[0.02em] text-black sm:text-[42px] md:text-[54px]">
                  HỆ THỐNG ĐẠI LÝ PHÂN PHỐI CHÍNH THỨC
                </h2>
              </div>

              <div className="space-y-9 font-afacad">
                <div className="max-w-[800px] space-y-5 text-base leading-[1.78] text-black/68 md:text-lg">
                  <p>
                    Các điểm phân phối chính thức được chọn lọc để giữ trải
                    nghiệm tư vấn nhất quán, hỗ trợ khách hàng thử kính, kiểm
                    tra tình trạng sản phẩm và tiếp nhận yêu cầu hậu mãi.
                  </p>
                  <p>
                    Danh sách dưới đây là dữ liệu tạm thời để hoàn thiện giao
                    diện. Thông tin có thể được thay thế bằng dữ liệu đại lý
                    thực tế khi backend hoặc file data riêng sẵn sàng.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {officialDealers.map((dealer) => (
                    <article
                      key={`${dealer.name}-${dealer.address}`}
                      className="border-t border-black/16 py-6"
                    >
                      <h3 className="text-xl font-semibold uppercase leading-[1.16] tracking-[0.08em] text-black md:text-2xl">
                        {dealer.name}
                      </h3>
                      <div className="mt-5 space-y-2 text-sm leading-[1.65] text-black/62 md:text-base">
                        <p>{dealer.address}</p>
                        <p>{dealer.openingHours}</p>
                        <p>{dealer.phone}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

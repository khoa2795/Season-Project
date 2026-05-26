import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { stores, type Store } from "@/lib/data/stores";

type StoreFlagshipSectionProps = {
  className?: string;
};

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

export function StoreFlagshipSection({
  className,
}: StoreFlagshipSectionProps) {
  const flagshipStores = getFlagshipStores();

  return (
    <section
      className={cn(
        "w-full bg-[#f1f1f1] px-5 py-16 text-black sm:px-8 md:px-14 md:py-20 lg:px-20 xl:px-28",
        className,
      )}
    >
      <div className="mx-auto max-w-420">
        <div className="max-w-190 space-y-5 pb-10 md:pb-14">
          <h2 className="font-afacad text-[34px] font-semibold uppercase leading-[0.95] tracking-[0.02em] text-black sm:text-[48px] md:text-[68px]">
            HỆ THỐNG CỬA HÀNG
          </h2>
          <p className="font-afacad text-[14px] font-semibold uppercase tracking-[0.18em] text-black/55">
            FLAGSHIP
          </p>
          <p className="max-w-155 font-afacad text-[16px] leading-[1.55] text-black/68 md:text-[18px]">
            Không gian trải nghiệm kính mắt được thiết kế tối giản, tập trung
            vào ánh sáng, chất liệu và cảm giác thử sản phẩm trực tiếp.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {flagshipStores.map((store, index) => (
            <article
              key={`${store.id}-${store.images[0]}`}
              className="relative min-h-105 overflow-hidden bg-black md:min-h-155"
            >
              <Image
                src={store.images[0]}
                alt={store.name}
                fill
                priority={index === 0}
                sizes="(max-width: 767px) calc(100vw - 40px), 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/38 via-black/8 to-black/12" />
              <div className="absolute left-5 top-5 max-w-[82%] font-afacad text-white md:left-7 md:top-7">
                <h3 className="text-[20px] font-semibold uppercase leading-tight tracking-[0.08em] md:text-[24px]">
                  {store.name}
                </h3>
                <div className="mt-4 space-y-1.5 text-[14px] leading-[1.35] text-white/88 md:text-[15px]">
                  <p>{store.address}</p>
                  <p>{store.openingHours}</p>
                  <p>{store.phone}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t border-black/12 pt-12 font-afacad md:mt-16 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 md:pt-16">
          <div>
            <h2 className="text-[28px] font-semibold uppercase leading-[1.05] tracking-[0.02em] text-black md:text-[44px]">
              <Link
                href="/stores"
                className="transition-opacity hover:opacity-60 hover:underline hover:underline-offset-8"
              >
                HỆ THỐNG ĐẠI LÝ PHÂN PHỐI CHÍNH THỨC
              </Link>
            </h2>
          </div>
          <div className="space-y-5 text-[16px] leading-[1.65] text-black/68 md:text-[18px]">
            <p>
              Bên cạnh hệ thống cửa hàng flagship, Season hợp tác cùng các đại
              lý phân phối chính thức để khách hàng có thể tiếp cận sản phẩm
              thuận tiện hơn tại nhiều khu vực.
            </p>
            <p>
              Thông tin đại lý có thể được cập nhật theo từng giai đoạn. Vui
              lòng liên hệ cửa hàng gần nhất để được hỗ trợ kiểm tra tình trạng
              sản phẩm và lịch hẹn thử kính.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

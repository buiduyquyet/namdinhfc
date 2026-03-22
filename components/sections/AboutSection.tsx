import SectionTitle from "@/components/SectionTitle";
import SectionBackground from "./SectionBackground";
import ImageSlider from "@/components/ImageSlider";

const AboutSection = () => {
  const aboutImages = [
    "/cover-bg-2.jpg",
    "/thientruong-stadium-1.jpg",
    "/cdv-2.jpg",
  ];

  return (
    <section
      id="gioi-thieu"
      style={{
        padding: "5rem 0",
        marginTop: "80px",
        background:
          "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), var(--color-primary-light))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SectionBackground variant="full" />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <SectionTitle
          title="Giới thiệu"
          subtitle="Thép Xanh Nam Định FC"
          light
        />
        <div className="flex justify-between gap-10 flex-wrap lg:flex-nowrap">
          <div className="max-w-full lg:max-w-[50%] text-white">
            Năm 1965, câu lạc bộ chính thức được thành lập với tên gọi Thanh
            niên Nam Hà (thời gian này Nam Hà gồm tỉnh Hà Nam và Nam Định nhập
            lại), đến năm 1978 đổi tên thành Công nghiệp Hà Nam Ninh. Đây là
            tiền thân của đội Nam Định ngày nay. <br /> Ở mùa giải gần nhất
            (2024-25), đội bóng vẫn giữ được phong độ tuơng đối tốt và giành
            chức vô địch lần thứ hai liên tiếp trong lịch sử câu lạc bộ.
          </div>
          <div className="relative w-full lg:w-[570px] h-[300px] lg:h-[400px] shrink-0">
            <ImageSlider
              images={aboutImages}
              className="w-full h-full rounded-md shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
